'use client'

// This will prevent authenticated users from accessing this route
import { useEffect, ReactNode, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"

import { RootState } from "../../../shared/store/store"

interface OpenRouteProps {
  children: ReactNode
}

function OpenRoute({ children }: OpenRouteProps) {
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only redirect after component is mounted and if user is authenticated
    if (mounted && token !== null) {
      const isAuthPage = router.pathname === '/auth/login' || router.pathname === '/auth/signup'
      if (isAuthPage) {
        router.push("/dashboard/my-profile")
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

export default OpenRoute