import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex-col flex justify-center items-center gap-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Hey there! 👋</h1>
      <h2 className="text-xl text-gray-600 mb-6">Welcome to our Auth Demo</h2>
      <Button>
        <Link href={"/auth/sign-in"}>Get Started with Authentication</Link>
      </Button>
    </div>
  );
}
