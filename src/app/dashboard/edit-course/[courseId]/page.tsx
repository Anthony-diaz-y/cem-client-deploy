'use client'


import { useState, useEffect } from 'react'
import EditCourse from '../../../../modules/instructor/containers/EditCourse'
import { useAppSelector } from '../../../../shared/store/hooks'
import { ACCOUNT_TYPE } from '../../../../shared/utils/constants'

export default function EditCoursePage() {
  const { user } = useAppSelector((state) => state.profile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return null
  }

  return (
    <EditCourse />
  )
}

