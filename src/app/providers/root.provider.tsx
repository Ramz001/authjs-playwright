import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'
import BackgroundPattern from '@app/styles/background-pattern'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <BackgroundPattern />
          {children}
        </ToastProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}
