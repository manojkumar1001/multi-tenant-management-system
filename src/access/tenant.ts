import type { Access } from 'payload'

export const isLoggedIn: Access = ({ req }) => !!req.user

export const sameTenant: Access = ({ req }) => {
  if (!req.user) return false
  const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
  return {
    tenant: {
      equals: Number(tenantId),
    },
  }
}

export const isOrganizerOrAdmin: Access = ({ req }) => {
  if (!req.user) return false
  return ['organizer', 'admin'].includes(req.user.role)
}

export const isAdmin: Access = ({ req }) => {
  if (!req.user) return false
  return req.user.role === 'admin'
}
