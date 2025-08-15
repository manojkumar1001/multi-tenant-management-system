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
  endpoints: [
    {
      path: '/dashboard',
      method: 'get',
      handler: async (req) => {
        try {
          // Ensure user is logged in
          if (!req.user || !req.user.tenant) {
            return Response.json({ message: 'Unauthorized' })
          }

          const tenantId =
            typeof req.user.tenant === 'number' ? req.user.tenant : req.user.tenant.id
          // Fetch Tenant details
          const tenant = await req.payload.findByID({
            collection: 'tenants',
            id: tenantId,
          })

          // Fetch Users in this tenant
          const users = await req.payload.find({
            collection: 'users',
            where: { tenant: { equals: tenantId } },
          })

          // Fetch Events for this tenant
          const events = await req.payload.find({
            collection: 'events',
            where: { tenant: { equals: tenantId } },
          })

          // Fetch Bookings for this tenant
          const bookings = await req.payload.find({
            collection: 'bookings',
            where: { tenant: { equals: tenantId } },
          })

          return Response.json({
            tenant,
            users: users.docs,
            events: events.docs,
            bookings: bookings.docs,
          })
        } catch (err) {
          console.error(err)
          return Response.json({ message: 'Server error', error: err }, { status: 500 })
        }
      },
    },
  ],
}
