export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex-col flex justify-center items-center">
      {children}
    </div>
  );
}
