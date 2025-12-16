'use client'


import { useState, useEffect } from 'react'
import Cart from '../../../modules/dashboard/cart/components/Cart'
import { useAppSelector } from '../../../shared/store/hooks'
import { ACCOUNT_TYPE } from '../../../shared/utils/constants'

export default function CartPage() {
  const { user } = useAppSelector((state) => state.profile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || user?.accountType !== ACCOUNT_TYPE.STUDENT) {
    return null
  }

  return (
    <Cart />
  )
}

