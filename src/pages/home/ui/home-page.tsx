import { Button } from '@/shared/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="mb-2 text-4xl font-bold text-gray-800">Hey there! 👋</h1>
      <h2 className="mb-6 text-xl text-gray-600">Welcome to our Auth Demo</h2>
      <Button>
        <Link href={'/auth/sign-in'}>Get Started with Authentication</Link>
      </Button>
    </div>
  )
}
