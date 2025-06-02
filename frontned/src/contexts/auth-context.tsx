"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  korisnik_id: number
  username: string
  ime: string
  prezime: string
  email: string
  uloga: "Organizator" | "Kupac"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call to Spring Boot backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // })

      // Mock login for demo purposes
      const mockUsers = [
        {
          korisnik_id: 1,
          username: "organizator1",
          ime: "Marko",
          prezime: "Marković",
          email: "marko@example.com",
          uloga: "Organizator" as const,
        },
        {
          korisnik_id: 2,
          username: "kupac1",
          ime: "Ana",
          prezime: "Anić",
          email: "ana@example.com",
          uloga: "Kupac" as const,
        },
      ]

      const foundUser = mockUsers.find((u) => u.username === username)
      if (foundUser && password === "password") {
        setUser(foundUser)
        localStorage.setItem("user", JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
