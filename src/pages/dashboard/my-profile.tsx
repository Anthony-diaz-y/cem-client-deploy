'use client'

import DashboardLayoutWrapper from './_layout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import MyProfile from '../../modules/dashboard/profile/components/MyProfile'

export default function MyProfilePage() {
  return (
    <ProtectedRoute>
      <DashboardLayoutWrapper>
        <MyProfile />
      </DashboardLayoutWrapper>
    </ProtectedRoute>
  )
}

