'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../store/hooks'
import { MOCK_MODE } from '../services/apiConnector'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // 🎭 DEMO MODE: Allow access without authentication when in mock mode
    if (MOCK_MODE) {
      return
    }

    // user not logged in
    if (token === null) {
      router.push('/')
    }
  }, [token, router])

  // 🎭 DEMO MODE: Allow access without authentication when in mock mode
  if (MOCK_MODE) {
    return <>{children}</>
  }

  // user logged in
  if (token !== null) {
    return <>{children}</>
  }

  return null
}

