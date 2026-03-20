import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="flex items-center gap-3 mb-8">
        <Camera className="w-10 h-10 text-zinc-300" />
        <h1 className="text-4xl font-bold tracking-tight text-white">henry-photoproof</h1>
      </div>
      <p className="text-zinc-400 text-lg mb-10 max-w-md">
        Streamlined photo proof delivery and client approval for photographers.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button className="bg-white text-black hover:bg-zinc-200 font-semibold px-6">
            Photographer Login
          </Button>
        </Link>
      </div>
    </main>
  )
}
