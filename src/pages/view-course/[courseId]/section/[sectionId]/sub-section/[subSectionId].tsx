'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import ViewCourseLayout from '../../../../_layout'
import VideoDetails from '@/modules/view-course/components/VideoDetails'
import { useAppSelector } from '@/shared/store/hooks'
import { ACCOUNT_TYPE } from '@/shared/utils/constants'

export default function VideoDetailsPage() {
  const { user } = useAppSelector((state) => state.profile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null
  }

  return (
    <ProtectedRoute>
      <ViewCourseLayout>
        <VideoDetails />
      </ViewCourseLayout>
    </ProtectedRoute>
  )
}
