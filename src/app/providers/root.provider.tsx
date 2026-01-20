import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthSessionProvider>
  )
}
