'use client'

import React, { useEffect, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { MOCK_MODE } from "../../../shared/services/apiConnector";
import { RootState } from "../../../shared/store/store"

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter()
    const { token } = useSelector((state: RootState) => state.auth);

    // 🎭 DEMO MODE: Allow access without authentication when in mock mode
    if (MOCK_MODE) {
        return children;
    }

    useEffect(() => {
        // user not logged in
        if (token === null) {
            router.push('/')
        }
    }, [token, router])

    // user logged in
    if (token !== null) {
        return children;
    }

    return null
}

export default ProtectedRoute