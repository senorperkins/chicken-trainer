import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, Tenant, RoleName } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, CircleNotch } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CreateUserDialogProps {
  currentUser: User
  currentTenant: Tenant
  isDeveloper?: boolean
}

export function CreateUserDialog({ currentUser, currentTenant, isDeveloper }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useKV<User[]>('users', [])
  const [tenants] = useKV<Tenant[]>('tenants', [])
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    position: '' as RoleName | '',
    ooCode: isDeveloper ? '' : currentUser.oo_code,
  })

  const isOwnerOrDM = currentUser.role === 'Owner' || currentUser.role === 'District Manager'

  const availablePositions: RoleName[] = [
    'Team Member',
    'Team Lead',
    'General Manager',
    'District Manager',
    'Owner',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.ooCode) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const targetTenant = isDeveloper
        ? tenants?.find(t => t.name.includes(formData.ooCode))
        : currentTenant

      if (!targetTenant) {
        toast.error('Invalid OO Code - tenant not found')
        setLoading(false)
        return
      }

      const existingUser = users?.find(u => u.email === formData.email)
      if (existingUser) {
        toast.error('User with this email already exists')
        setLoading(false)
        return
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: formData.email,
        display_name: `${formData.firstName} ${formData.lastName}`,
        role: formData.position as RoleName,
        oo_code: formData.ooCode,
        tenant_id: targetTenant.id,
        active: true,
        created_at: new Date().toISOString(),
      }

      setUsers((currentUsers) => [...(currentUsers || []), newUser])

      toast.success(`User ${newUser.display_name} created successfully`)
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        position: '',
        ooCode: isDeveloper ? '' : currentUser.oo_code,
      })
      
      setOpen(false)
    } catch (error) {
      toast.error('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus size={20} />
          Create New User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will be whitelisted and able to sign in with their email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value as RoleName })}
              disabled={loading}
            >
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {availablePositions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={loading}
              placeholder="Store location"
            />
          </div>

          {isDeveloper ? (
            <div className="space-y-2">
              <Label htmlFor="ooCode">OO Code *</Label>
              <Input
                id="ooCode"
                value={formData.ooCode}
                onChange={(e) => setFormData({ ...formData, ooCode: e.target.value })}
                disabled={loading}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="ooCode">OO Code</Label>
              <Input
                id="ooCode"
                value={formData.ooCode}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your OO Code is automatically assigned to new users
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 gap-2"
            >
              {loading && <CircleNotch className="animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
