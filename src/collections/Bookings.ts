import { CollectionConfig } from 'payload'
import { sameTenant, isLoggedIn } from '../access/tenant'
import { handleBookingCreate, handleBookingUpdate } from '../hooks/bookingHooks'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    read: sameTenant,
    create: isLoggedIn,
    update: sameTenant,
    delete: sameTenant,
  },
  hooks: {
    beforeChange: [handleBookingCreate],
    afterChange: [handleBookingUpdate],
  },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['confirmed', 'waitlisted', 'canceled'],
      required: true,
      defaultValue: 'confirmed',
    },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
    { name: 'createdAt', type: 'date', admin: { readOnly: true }, defaultValue: () => new Date() },
  ],
  endpoints: [
    {
      path: '/book-event',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }

        try {
          const data = (await (req as any).json()) as { eventId: string }
          const eventId = data.eventId

          const userId = req.user.id

          const event = await req.payload.findByID({
            collection: 'events',
            id: eventId,
          })

          if (!event) {
            return Response.json({ message: 'Event not found' }, { status: 404 })
          }

          const eventTenantId = typeof event.tenant === 'number' ? event.tenant : event.tenant.id
          const userTenantId =
            typeof req.user.tenant === 'number' ? req.user.tenant : req.user.tenant.id

          if (eventTenantId !== userTenantId) {
            return Response.json(
              { message: 'Cannot book events from another tenant' },
              { status: 403 },
            )
          }

          const createdAt = new Date().toDateString()
          const tenant = req.user.tenant

          const booking = await req.payload.create({
            collection: 'bookings',
            req,
            data: {
              event: parseInt(eventId),
              user: userId,
              status: 'waitlisted',
              tenant,
              createdAt,
            },
          })

          return Response.json({ booking })
        } catch (err) {
          console.error(err)
          return Response.json({ message: 'Server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/cancel-booking',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const data = (await (req as any).json()) as { bookingId: string }
        const bookingId = data.bookingId

        try {
          const booking = await req.payload.findByID({
            collection: 'bookings',
            id: bookingId,
          })

          if (!booking) {
            return Response.json({ message: 'Booking not found' }, { status: 404 })
          }

          if (booking.user !== req.user.id && req.user.role !== 'admin') {
            return Response.json({ message: 'Forbidden' }, { status: 403 })
          }

          await req.payload.update({
            collection: 'bookings',
            id: bookingId,
            data: { status: 'canceled' },
          })
          return Response.json({ message: 'Booking canceled successfully' })
        } catch (err) {
          console.error(err)
          return Response.json({ message: 'Server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/my-bookings',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }

        try {
          const bookings = await req.payload.find({
            collection: 'bookings',
            where: { user: { equals: req.user.id } },
          })

          return Response.json(bookings.docs)
        } catch (err) {
          console.error(err)
          return Response.json({ message: 'Server error' }, { status: 500 })
        }
      },
    },
  ],
}
