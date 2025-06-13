"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

type ProtectedRouteProps = {
  children: ReactNode
  requiredRole?: "ORGANIZATOR" | "KUPAC"
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.uloga !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user?.uloga === "ORGANIZATOR" ? "/organizer/dashboard" : "/customer/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
