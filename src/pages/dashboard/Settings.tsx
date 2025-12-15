'use client'

import DashboardLayoutWrapper from './_layout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import Settings from '../../modules/dashboard/settings/components/Settings'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayoutWrapper>
        <Settings />
      </DashboardLayoutWrapper>
    </ProtectedRoute>
  )
}

