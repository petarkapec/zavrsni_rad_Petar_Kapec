"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import api from "../services/api"

type User = {
  korisnikId: number
  username: string
  ime: string
  prezime: string
  email: string
  uloga: "ORGANIZATOR" | "KUPAC"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

type RegisterData = {
  username: string
  ime: string
  prezime: string
  email: string
  password: string
  uloga: "ORGANIZATOR" | "KUPAC"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await api.get("/auth/me")
          setUser(response.data)
        }
      } catch (error) {
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password })
      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user)) // Dodajte JSON.stringify
      setUser(user)
    } catch (error) {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post("/auth/register", userData)
      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user)) // Dodajte JSON.stringify
      setUser(user)
    } catch (error) {
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
