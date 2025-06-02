"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  role?: "Organizator" | "Kupac"
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.uloga !== role) {
    const redirectPath = user.uloga === "Organizator" ? "/organizer" : "/customer"
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
