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
}
