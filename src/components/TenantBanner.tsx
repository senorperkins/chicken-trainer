import { Tenant } from '@/lib/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from '@phosphor-icons/react'

interface TenantBannerProps {
  tenant: Tenant
  mode?: 'normal' | 'read_only' | 'maintenance'
}

export function TenantBanner({ tenant, mode = 'normal' }: TenantBannerProps) {
  const getModeInfo = () => {
    switch (mode) {
      case 'read_only':
        return {
          text: 'READ-ONLY MODE (Production)',
          className: 'bg-warning/10 border-warning text-warning-foreground'
        }
      case 'maintenance':
        return {
          text: 'MAINTENANCE MODE (Write Access Enabled)',
          className: 'bg-destructive/10 border-destructive text-destructive-foreground'
        }
      default:
        return null
    }
  }

  const modeInfo = getModeInfo()

  if (!modeInfo) {
    return (
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="font-medium">{tenant.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground text-xs">
            {tenant.type === 'developer_tenant' ? 'Developer Tenant' : 'Owner Tenant'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Alert className={`rounded-none border-x-0 border-t-0 ${modeInfo.className}`}>
      <Info size={16} />
      <AlertDescription className="flex items-center justify-center gap-3">
        <span className="font-medium">{tenant.name}</span>
        <span>•</span>
        <span className="font-bold">{modeInfo.text}</span>
      </AlertDescription>
    </Alert>
  )
}
