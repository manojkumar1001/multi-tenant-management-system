import { CollectionConfig, PayloadRequest } from 'payload'
import { isAdmin, sameTenant } from '@/access/tenant'

type EventBookingRequestBody = {
  eventId: number
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name' },
  access: {
    read: sameTenant,
    create: isAdmin,
    update: sameTenant,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Attendee', value: 'attendee' },
        { label: 'Organizer', value: 'organizer' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'attendee',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
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

          // Count confirmed bookings
          const confirmedCount = await req.payload
            .find({
              collection: 'bookings',
              where: {
                event: { equals: eventId },
                status: { equals: 'confirmed' },
              },
            })
            .then((res) => res.totalDocs)

          // Determine status
          const status = confirmedCount < event.capacity ? 'confirmed' : 'waitlisted'
          const createdAt = new Date().toDateString()
          const autoAction = status === 'confirmed' ? 'auto_confirm' : 'auto_waitlist'
          const tenant = req.user.tenant

          // Create booking
          const booking = await req.payload.create({
            collection: 'bookings',
            req,
            data: {
              event: parseInt(eventId),
              user: userId,
              status,
              tenant,
              createdAt,
            },
          })

          // Create Notification
          await req.payload.create({
            collection: 'notifications',
            req,
            data: {
              user: userId,
              booking: booking.id,
              type: status === 'confirmed' ? 'booking_confirmed' : 'waitlisted',
              title: 'Booking Update',
              message: `Your booking is ${status}`,
              tenant: req.user.tenant,
            },
          })

          // Create BookingLog
          await req.payload.create({
            collection: 'bookinglogs',
            req,
            data: {
              booking: booking.id,
              event: parseInt(eventId),
              user: userId,
              action: autoAction,
              note: 'Automatic booking',
              tenant: req.user.tenant,
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
