import { User, Tenant, OOCode } from './types'

export async function mockGoogleSSO(): Promise<{ email: string; name: string; avatar: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: 'samuelosorioperkins@gmail.com',
        name: 'Samuel Perkins',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel'
      })
    }, 500)
  })
}

export async function verifyOOCode(code: string, email: string): Promise<{
  valid: boolean
  user?: User
  tenant?: Tenant
  ooCode?: OOCode
}> {
  const ooCodes = await window.spark.kv.get<OOCode[]>('oo_codes') || []
  const users = await window.spark.kv.get<User[]>('users') || []
  const tenants = await window.spark.kv.get<Tenant[]>('tenants') || []
  
  const ooCode = ooCodes.find(oc => oc.code === code && oc.status === 'active')
  
  if (!ooCode) {
    return { valid: false }
  }
  
  const tenant = tenants.find(t => t.id === ooCode.tenant_id)
  const user = users.find(u => u.email === email && u.tenant_id === ooCode.tenant_id)
  
  if (!tenant) {
    return { valid: false }
  }
  
  if (user) {
    return { valid: true, user, tenant, ooCode }
  } else {
    return { valid: true, tenant, ooCode }
  }
}

export function isDeveloperWhitelisted(email: string): boolean {
  const whitelist = ['samuelosorioperkins@gmail.com']
  return whitelist.includes(email.toLowerCase())
}

export const DEVELOPER_CODE = '8675309'
