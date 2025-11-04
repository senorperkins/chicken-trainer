import { User, Tenant, OOCode, Training, Badge, Assignment, Schedule, MaintenanceTicket } from './types'
import { assignDeterministicAvatar } from './avatars'

export async function ensureSeedData() {
  const users = await window.spark.kv.get<User[]>('users') || []
  const tenants = await window.spark.kv.get<Tenant[]>('tenants') || []
  const ooCodes = await window.spark.kv.get<OOCode[]>('oo_codes') || []
  const trainings = await window.spark.kv.get<Training[]>('trainings') || []
  const badges = await window.spark.kv.get<Badge[]>('badges') || []
  const assignments = await window.spark.kv.get<Assignment[]>('assignments') || []
  const schedules = await window.spark.kv.get<Schedule[]>('schedules') || []
  const maintenanceTickets = await window.spark.kv.get<MaintenanceTicket[]>('maintenance_tickets') || []

  if (tenants.length > 0 && users.length > 0) {
    return
  }

  const developerTenant: Tenant = {
    id: 'dev_tenant_1',
    name: 'Developer Console',
    type: 'developer_tenant',
    created_at: new Date().toISOString()
  }

  const testTenant: Tenant = {
    id: 'test_tenant_1',
    name: 'Demo Restaurant',
    type: 'owner_tenant',
    created_at: new Date().toISOString()
  }

  const developerCode: OOCode = {
    code: '8675309',
    type: 'developer',
    tenant_id: developerTenant.id,
    created_at: new Date().toISOString(),
    status: 'active'
  }

  const testCode: OOCode = {
    code: 'TEST123',
    type: 'owner',
    tenant_id: testTenant.id,
    created_at: new Date().toISOString(),
    status: 'active'
  }

  const testAvatar = assignDeterministicAvatar('test_user_1')

  const testUser: User = {
    id: 'test_user_1',
    email: 'testuser@chickentrainer.com',
    display_name: 'Alex Johnson',
    role: 'Team Member',
    oo_code: testCode.code,
    tenant_id: testTenant.id,
    active: true,
    created_at: new Date().toISOString(),
    avatar_id: testAvatar.id,
    avatar_source: 'default_pack'
  }

  const testManagerAvatar = assignDeterministicAvatar('test_manager_1')

  const testManager: User = {
    id: 'test_manager_1',
    email: 'manager@chickentrainer.com',
    display_name: 'Sarah Williams',
    role: 'General Manager',
    oo_code: testCode.code,
    tenant_id: testTenant.id,
    active: true,
    created_at: new Date().toISOString(),
    avatar_id: testManagerAvatar.id,
    avatar_source: 'default_pack'
  }

  const sampleTraining: Training = {
    id: 'training_1',
    title: 'Food Safety Fundamentals',
    description: 'Learn the essential food safety protocols and best practices for handling food in a restaurant environment.',
    tags: ['safety', 'fundamentals', 'required'],
    role_targets: ['Team Member', 'Team Lead', 'Trainee'],
    estimated_time_minutes: 45,
    version: '1.0',
    effective_date: new Date().toISOString(),
    created_by: testManager.id,
    tenant_id: testTenant.id,
    created_at: new Date().toISOString()
  }

  const sampleTraining2: Training = {
    id: 'training_2',
    title: 'Customer Service Excellence',
    description: 'Master the art of providing exceptional customer service that creates memorable dining experiences.',
    tags: ['customer-service', 'required'],
    role_targets: ['Team Member', 'Team Lead'],
    estimated_time_minutes: 30,
    version: '1.0',
    effective_date: new Date().toISOString(),
    created_by: testManager.id,
    tenant_id: testTenant.id,
    created_at: new Date().toISOString()
  }

  const sampleBadge: Badge = {
    id: 'badge_1',
    name: 'Food Safety Certified',
    description: 'Successfully completed food safety training and demonstrated understanding of safe food handling practices.',
    criteria_text: 'Complete Food Safety Fundamentals training',
    expires: false,
    tenant_id: testTenant.id
  }

  const sampleAssignment: Assignment = {
    id: 'assignment_1',
    training_id: sampleTraining.id,
    user_id: testUser.id,
    assigned_by: testManager.id,
    assigned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'assigned',
    tenant_id: testTenant.id
  }

  const sampleSchedule: Schedule = {
    id: 'schedule_1',
    user_id: testUser.id,
    store_id: 'store_1',
    role_at_shift: 'Team Member',
    shift_start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    shift_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    type: 'in_store',
    tenant_id: testTenant.id
  }

  const sampleMaintenanceTicket: MaintenanceTicket = {
    id: 'ticket_1',
    tenant_id: testTenant.id,
    requested_by_user_id: testManager.id,
    reason_text: 'Need to bulk update training assignments for Q1 compliance rollout.',
    status: 'open',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }

  await window.spark.kv.set('tenants', [developerTenant, testTenant])
  await window.spark.kv.set('oo_codes', [developerCode, testCode])
  await window.spark.kv.set('users', [testUser, testManager])
  await window.spark.kv.set('trainings', [sampleTraining, sampleTraining2])
  await window.spark.kv.set('badges', [sampleBadge])
  await window.spark.kv.set('assignments', [sampleAssignment])
  await window.spark.kv.set('schedules', [sampleSchedule])
  await window.spark.kv.set('maintenance_tickets', [sampleMaintenanceTicket])
}
