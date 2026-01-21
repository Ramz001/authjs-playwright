import { ProfileCard } from '@features/profile-settings'
import { ProfileEditForm } from '@/features/profile-settings/ui/profile-edit-form'
import { AdminRoleManager } from '@/features/profile-settings/ui/admin-role-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

export default async function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileCard />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <ProfileEditForm />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <AdminRoleManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
