import { CollectionConfig } from 'payload'
import { sameTenant } from '../access/tenant'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    read: sameTenant,
    create: sameTenant,
    update: sameTenant,
    delete: sameTenant,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'booking', type: 'relationship', relationTo: 'bookings', required: true },
    {
      name: 'type',
      type: 'select',
      options: ['booking_confirmed', 'waitlisted', 'waitlist_promoted', 'booking_canceled'],
      required: true,
    },
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'read', type: 'checkbox', defaultValue: false },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date() },
  ],
  endpoints: [
    {
      path: '/my-notifications',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ message: 'Unauthorized' }, { status: 401 })
        }
        try {
          const notifications = await req.payload.find({
            collection: 'notifications',
            where: {
              user: { equals: req.user.id },
              read: { equals: false },
            },
            sort: '-createdAt',
          })
          return Response.json(notifications.docs)
        } catch (err) {
          return Response.json({ message: 'Server error' }, { status: 500 })
        }
      },
    },
    {
      path: '/:id/read',
      method: 'post',
      handler: async (req) => {
        try {
          const { id } = req.routeParams as { id: string }
          await req.payload.update({
            collection: 'notifications',
            id,
            data: { read: true },
          })
          return Response.json({ message: 'Notification marked as read' })
        } catch (err) {
          return Response.json({ message: 'Server error' }, { status: 500 })
        }
      },
    },
  ],
}
