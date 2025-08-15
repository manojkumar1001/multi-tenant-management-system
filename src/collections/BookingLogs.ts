import { CollectionConfig } from 'payload'
import { sameTenant } from '../access/tenant'

export const BookingLogs: CollectionConfig = {
  slug: 'bookinglogs',
  access: {
    read: sameTenant,
    create: sameTenant,
  },
  fields: [
    { name: 'booking', type: 'relationship', relationTo: 'bookings', required: true },
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'action',
      type: 'select',
      options: [
        'create_request',
        'auto_waitlist',
        'auto_confirm',
        'promote_from_waitlist',
        'cancel_confirmed',
      ],
      required: true,
    },
    { name: 'note', type: 'text' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date() },
  ],
}
