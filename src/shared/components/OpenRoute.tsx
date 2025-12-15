'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../store/hooks'

export default function OpenRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token } = useAppSelector((state) => state.auth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only redirect after component is mounted and if user is authenticated
    if (mounted && token !== null) {
      const isAuthPage = router.pathname === '/auth/login' || router.pathname === '/auth/signup'
      if (isAuthPage) {
        router.push('/dashboard/my-profile')
      }
    }
  }, [mounted, token, router.pathname, router])

  // If component is not mounted yet, render nothing to avoid flash
  if (!mounted) {
    return null
  }

  // If user is authenticated and on auth page, don't render (will redirect)
  if (token !== null && (router.pathname === '/auth/login' || router.pathname === '/auth/signup')) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}

