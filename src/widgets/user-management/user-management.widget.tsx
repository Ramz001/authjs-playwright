'use client'

import { useState } from 'react'
import { UsersListCard, UserDetailsPanel } from '@features/user-management'

export function UserManagement() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <UsersListCard
        onSelectUser={setSelectedUserId}
        selectedUserId={selectedUserId}
      />
      {selectedUserId ? (
        <UserDetailsPanel
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      ) : (
        <div className="hidden items-center justify-center rounded-lg border border-dashed p-8 lg:flex">
          <p className="text-muted-foreground text-sm">
            Select a user to view details and manage sessions
          </p>
        </div>
      )}
    </div>
  )
}
