import { CollectionConfig } from 'payload'
import { isOrganizerOrAdmin, sameTenant } from '../access/tenant'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title' },
  access: {
    read: sameTenant,
    create: isOrganizerOrAdmin,
    update: isOrganizerOrAdmin,
    delete: isOrganizerOrAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { name: 'date', type: 'date', required: true },
    { name: 'capacity', type: 'number', required: true },
    { name: 'organizer', type: 'relationship', relationTo: 'users', required: true },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
  ],
}
