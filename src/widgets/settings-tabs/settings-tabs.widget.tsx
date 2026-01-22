import { ProfileCard } from '@features/profile-settings'
import { ProfileEditForm } from '@/features/profile-settings/ui/profile-edit-form'
import { AdminRoleManager } from '@/features/profile-settings/ui/admin-role-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { requireAuth } from '@features/auth/server'
import { Role } from '@shared/generated/prisma/enums'

export async function SettingsTabs() {
  const user = await requireAuth()
  const isAdmin = user.role === Role.ADMIN

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
        {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileCard />
      </TabsContent>

      <TabsContent value="edit" className="mt-6">
        <ProfileEditForm />
      </TabsContent>

      {isAdmin && (
        <TabsContent value="admin" className="mt-6">
          <AdminRoleManager />
        </TabsContent>
      )}
    </Tabs>
  )
}
