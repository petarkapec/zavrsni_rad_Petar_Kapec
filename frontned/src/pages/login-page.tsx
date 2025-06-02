"use client"

import type React from "react"

import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users } from "lucide-react"

export function LoginPage() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    const redirectPath = user.uloga === "Organizator" ? "/organizer" : "/customer"
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(username, password)
    if (!success) {
      setError("Neispravno korisničko ime ili lozinka")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OrganizatorDogađaja</h1>
          <p className="text-gray-600">Prijavite se u svoj račun</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-blue-900">Prijava</CardTitle>
            <CardDescription className="text-center">Unesite svoje podatke za pristup aplikaciji</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Prijavljivanje..." : "Prijavite se"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center mb-4">Demo računi:</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="font-medium text-blue-900">Organizator</span>
                  </div>
                  <div className="text-gray-600">
                    <div>Username: organizator1</div>
                    <div>Password: password</div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-medium text-green-900">Kupac</span>
                  </div>
                  <div className="text-gray-600">
                    <div>Username: kupac1</div>
                    <div>Password: password</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
