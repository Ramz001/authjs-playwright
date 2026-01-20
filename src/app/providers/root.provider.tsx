import ToastProvider from './toast.provider'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToastProvider>{children}</ToastProvider>
}
