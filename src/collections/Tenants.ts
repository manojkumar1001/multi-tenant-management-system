import { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/tenant'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'createdAt', type: 'date', admin: { readOnly: true }, defaultValue: () => new Date() },
  ],
}
