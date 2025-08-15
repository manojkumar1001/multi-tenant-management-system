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
}
