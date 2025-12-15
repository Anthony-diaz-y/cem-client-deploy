'use client'


import { useState, useEffect } from 'react'
import DashboardLayoutWrapper from './_layout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import Instructor from '../../modules/dashboard/instructor/components/Instructor'
import { useAppSelector } from '../../shared/store/hooks'
import { ACCOUNT_TYPE } from '../../shared/utils/constants'

export default function InstructorPage() {
  const { user } = useAppSelector((state) => state.profile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return null
  }

  return (
    <ProtectedRoute>
      <DashboardLayoutWrapper>
        <Instructor />
      </DashboardLayoutWrapper>
    </ProtectedRoute>
  )
}

