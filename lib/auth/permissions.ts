export type UserRole = "member" | "leader" | "pastor" | "admin"

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export const rolePermissions: Record<UserRole, Record<string, Permission>> = {
  member: {
    news: { create: false, read: true, update: false, delete: false },
    devotionals: { create: false, read: true, update: false, delete: false },
    events: { create: false, read: true, update: false, delete: false },
    chat: { create: true, read: true, update: true, delete: false },
    members: { create: false, read: false, update: false, delete: false },
    families: { create: false, read: false, update: false, delete: false },
    ministries: { create: false, read: false, update: false, delete: false },
    visitors: { create: false, read: false, update: false, delete: false },
    institutional: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    "prayer-requests": { create: true, read: true, update: true, delete: false },
  },
  leader: {
    news: { create: true, read: true, update: true, delete: true },
    devotionals: { create: true, read: true, update: true, delete: true },
    events: { create: true, read: true, update: true, delete: true },
    chat: { create: true, read: true, update: true, delete: true },
    members: { create: true, read: true, update: true, delete: false },
    families: { create: true, read: true, update: true, delete: false },
    ministries: { create: false, read: true, update: false, delete: false },
    visitors: { create: false, read: false, update: false, delete: false },
    institutional: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: false, update: false, delete: false },
    "prayer-requests": { create: true, read: true, update: true, delete: true },
  },
  pastor: {
    news: { create: true, read: true, update: true, delete: true },
    devotionals: { create: true, read: true, update: true, delete: true },
    events: { create: true, read: true, update: true, delete: true },
    chat: { create: true, read: true, update: true, delete: true },
    members: { create: true, read: true, update: true, delete: true },
    families: { create: true, read: true, update: true, delete: true },
    ministries: { create: true, read: true, update: true, delete: true },
    visitors: { create: false, read: false, update: false, delete: false },
    institutional: { create: true, read: true, update: true, delete: false },
    settings: { create: false, read: true, update: true, delete: false },
    "prayer-requests": { create: true, read: true, update: true, delete: true },
  },
  admin: {
    news: { create: true, read: true, update: true, delete: true },
    devotionals: { create: true, read: true, update: true, delete: true },
    events: { create: true, read: true, update: true, delete: true },
    chat: { create: true, read: true, update: true, delete: true },
    members: { create: true, read: true, update: true, delete: true },
    families: { create: true, read: true, update: true, delete: true },
    ministries: { create: true, read: true, update: true, delete: true },
    visitors: { create: true, read: true, update: true, delete: true },
    institutional: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: true },
    "prayer-requests": { create: true, read: true, update: true, delete: true },
  },
}

// Páginas completamente públicas (não requerem autenticação)
export const publicPages = ["/", "/news", "/devotionals", "/institutional", "/calendar", "/prayer-requests"]

// Páginas que requerem login
export const requiresLogin = ["/members", "/families", "/ministries", "/visitors", "/settings", "/chat"]

export function hasPermission(userRole: string | null, resource: string, action: keyof Permission): boolean {
  if (!userRole) return false

  // Convert role to lowercase to ensure case-insensitive matching
  const normalizedRole = userRole.toLowerCase() as UserRole

  // Check if the role exists in our permissions
  if (!rolePermissions[normalizedRole]) {
    console.warn(`Role "${userRole}" not found in permissions configuration`)
    return false
  }

  // Check if the resource exists for this role
  if (!rolePermissions[normalizedRole][resource]) {
    console.warn(`Resource "${resource}" not found for role "${userRole}"`)
    return false
  }

  return rolePermissions[normalizedRole][resource][action] || false
}

export function canAccessPage(userRole: string | null, path: string): boolean {
  // Check if it's a public page
  if (publicPages.some((page) => path === page || path.startsWith(`${page}/`))) return true

  // Check if it's a page that requires login
  if (requiresLogin.some((page) => path === page || path.startsWith(`${page}/`))) return userRole !== null

  // Check if it's a create/edit page
  if (path.includes("/create") || path.includes("/edit")) return userRole !== null

  // Default: allow access
  return true
}

export function shouldShowInNavigation(userRole: string | null, path: string): boolean {
  // Always show public pages
  if (publicPages.includes(path)) return true

  // If not authenticated, only show public pages
  if (!userRole) return publicPages.includes(path)

  // Convert role to lowercase to ensure case-insensitive matching
  const normalizedRole = userRole?.toLowerCase() as UserRole | null

  // Hide admin-only pages from non-admins
  const adminOnlyPages = ["/settings"]
  if (adminOnlyPages.includes(path) && normalizedRole !== "admin") return false

  // Hide management pages from members
  const managementPages = ["/members", "/families", "/ministries", "/visitors"]
  if (managementPages.includes(path) && normalizedRole === "member") return false

  return true
}
