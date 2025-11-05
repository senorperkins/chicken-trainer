import { User, Tenant, OOCode } from './types'
import { assignDeterministicAvatar } from './avatars'

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

export async function mockAppleSSO(): Promise<{ email: string; name: string; avatar: string }> {
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

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase()
  const width = window.innerWidth
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet'
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent)) {
    return 'mobile'
  }
  
  if (width < 768) {
    return 'mobile'
  }
  
  if (width >= 768 && width < 1024) {
    return 'tablet'
  }
  
  return 'desktop'
}

export async function recordDeviceAccess() {
  const deviceType = getDeviceType()
  const timestamp = new Date().toISOString()
  
  const accessLogs = await window.spark.kv.get<Array<{ device: string; timestamp: string }>>('device_access_logs') || []
  accessLogs.push({ device: deviceType, timestamp })
  
  await window.spark.kv.set('device_access_logs', accessLogs)
}

export async function checkUserExists(email: string): Promise<{
  exists: boolean
  user?: User
  tenant?: Tenant
}> {
  const users = await window.spark.kv.get<User[]>('users') || []
  const tenants = await window.spark.kv.get<Tenant[]>('tenants') || []
  
  const user = users.find(u => u.email === email && u.active)
  
  if (user) {
    const tenant = tenants.find(t => t.id === user.tenant_id)
    if (tenant) {
      return { exists: true, user, tenant }
    }
  }
  
  return { exists: false }
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
  let user = users.find(u => u.email === email && u.tenant_id === ooCode.tenant_id)
  
  if (!tenant) {
    return { valid: false }
  }
  
  if (user) {
    if (!user.avatar_id && !user.avatar_url) {
      const assignedAvatar = assignDeterministicAvatar(user.id || user.email)
      user = {
        ...user,
        avatar_id: assignedAvatar.id,
        avatar_source: 'default_pack'
      }
      
      const updatedUsers = users.map(u => 
        u.id === user!.id ? user! : u
      )
      await window.spark.kv.set('users', updatedUsers)
    }
    
    return { valid: true, user, tenant, ooCode }
  } else if (ooCode.type === 'developer') {
    const assignedAvatar = assignDeterministicAvatar(email)
    const newUser: User = {
      id: `dev_${Date.now()}`,
      email,
      display_name: email.split('@')[0],
      role: 'Developer',
      oo_code: code,
      tenant_id: tenant.id,
      active: true,
      created_at: new Date().toISOString(),
      avatar_id: assignedAvatar.id,
      avatar_source: 'default_pack'
    }
    
    await window.spark.kv.set('users', [...users, newUser])
    
    return { valid: true, user: newUser, tenant, ooCode }
  } else {
    return { valid: true, tenant, ooCode }
  }
}

export function isDeveloperWhitelisted(email: string): boolean {
  const whitelist = ['samuelosorioperkins@gmail.com']
  return whitelist.includes(email.toLowerCase())
}

export const DEVELOPER_CODE = '8675309'
