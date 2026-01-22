import Gutter from '@shared/ui/gutter'
import { UserManagement } from '@widgets/user-management'

export default async function AdminPage() {
  return (
    <Gutter>
      <h1 className="my-8 text-3xl font-bold">Admin</h1>

      <UserManagement />
    </Gutter>
  )
}
