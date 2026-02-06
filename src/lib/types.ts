export type RoleName = 'Owner' | 'District Manager' | 'General Manager' | 'Team Lead' | 'Team Member' | 'Trainee' | 'Support' | 'Developer'

export type TenantType = 'owner_tenant' | 'developer_tenant'

export type OOCodeType = 'owner' | 'developer'

export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue'

export type ShiftType = 'in_store' | 'off_campus'

export type SwapType = 'offer' | 'pickup_request' | 'swap_request'

export type SwapStatus = 'pending' | 'approved' | 'denied' | 'expired'

export type NoteType = 'progress_note' | 'attendance_note' | 'general_note'

export type AttendanceStatus = 'present' | 'no_show' | 'call_out' | 'late'

export type EvidenceType = 'manager_note' | 'file_upload' | 'photo' | 'short_video' | 'link' | 'digital_signature' | 'timestamp'

export interface Tenant {
  id: string
  name: string
  type: TenantType
  primary_owner_id?: string
  created_at: string
}

export interface OOCode {
  code: string
  type: OOCodeType
  tenant_id: string
  owner_user_id?: string
  created_at: string
  status: 'active' | 'inactive'
}

export interface User {
  id: string
  email: string
  display_name: string
  role: RoleName
  oo_code: string
  tenant_id: string
  district_id?: string
  store_id?: string
  active: boolean
  created_at: string
  avatar_id?: string
  avatar_url?: string
  avatar_source?: 'default_pack' | 'uploaded'
  featured_badge_id?: string
}

export interface District {
  id: string
  name: string
  owner_id: string
  tenant_id: string
}

export interface Store {
  id: string
  name: string
  district_id: string
  address: string
  tenant_id: string
}

export interface Training {
  id: string
  title: string
  description: string
  pdf_file_id?: string
  tags: string[]
  role_targets: RoleName[]
  estimated_time_minutes: number
  version: string
  effective_date: string
  created_by: string
  tenant_id: string
  created_at: string
}

export interface Assignment {
  id: string
  training_id: string
  user_id: string
  assigned_by: string
  assigned_at: string
  due_date?: string
  expected_completion_date?: string
  status: AssignmentStatus
  completed_at?: string
  completed_by?: string
  tenant_id: string
}

export interface Evidence {
  id: string
  assignment_id: string
  type: EvidenceType
  url_or_blob?: string
  note?: string
  added_by: string
  timestamp: string
}

export interface Badge {
  id: string
  name: string
  description: string
  criteria_text: string
  expires: boolean
  tenant_id: string
}

export interface BadgeAward {
  id: string
  badge_id: string
  user_id: string
  awarded_by: string
  awarded_at: string
  related_assignment_id?: string
  tenant_id: string
}

export interface Schedule {
  id: string
  user_id: string
  store_id: string
  role_at_shift: string
  shift_start: string
  shift_end: string
  type: ShiftType
  off_campus_location?: string
  tenant_id: string
}

export interface ShiftSwap {
  id: string
  store_id: string
  offered_by_user_id: string
  original_shift_id: string
  type: SwapType
  requested_user_id?: string
  status: SwapStatus
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Note {
  id: string
  subject_user_id: string
  author_user_id: string
  type: NoteType
  text: string
  visibility_scope: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  schedule_id: string
  status: AttendanceStatus
  reason_code?: string
  reason_text?: string
  marked_by: string
  marked_at: string
  tenant_id: string
}

export interface AuditLog {
  id: string
  tenant_id: string
  actor_user_id: string
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, any>
  timestamp: string
}

export interface MaintenanceToken {
  id: string
  tenant_id: string
  issued_by_user_id: string
  issued_to_user_id: string
  scoped_actions: string[]
  expires_at: string
  created_at: string
  status: 'active' | 'expired' | 'revoked'
}

export interface MaintenanceTicket {
  id: string
  tenant_id: string
  requested_by_user_id: string
  developer_user_id?: string
  reason_text: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
}

export interface DashboardMetrics {
  role_counts: Record<RoleName, number>
  attendance_percentage: number
  no_show_rate: number
  call_out_rate: number
  shift_swaps_count: number
  training_completions: number
  badge_awards: number
  library_usage: number
}

export interface AvatarItem {
  id: string
  label: string
  asset: string
  category: 'cow' | 'chicken'
}

export interface AvatarPack {
  name: string
  description: string
  items: AvatarItem[]
  exclusions: string[]
}
