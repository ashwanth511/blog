'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show skeleton loading state
  if (!isClient) {
    return (
      <nav className="border-b py-4">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-xl font-bold">Blog</span>
          <div className="flex gap-4">
            <div className="w-24 h-10 bg-gray-200 rounded" />
            <div className="w-24 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </nav>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Blog</Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="flex gap-4">
              <div className="w-24 h-10 bg-gray-200 rounded" />
              <div className="w-24 h-10 bg-gray-200 rounded" />
            </div>
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/articles/write">
                <Button>Write Article</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
