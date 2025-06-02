"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, MapPin, LogOut, Plus, Star, Clock, Euro, User } from "lucide-react"
import ProfileView from "./profile-view"
import EventsView from "./events-view"
import OffersView from "./offers-view"
import ReservationsView from "./reservations-view"
import EventsFeed from "./events-feed"

type UserType = {
  korisnik_id: number
  username: string
  ime: string
  prezime: string
  email: string
  uloga: "Organizator" | "Kupac"
}

type DashboardProps = {
  user: UserType
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const isOrganizer = user.uloga === "Organizator"

  // Mock statistike
  const stats = isOrganizer
    ? {
        totalEvents: 12,
        activeReservations: 8,
        totalRevenue: 15420,
        avgRating: 4.8,
      }
    : {
        totalReservations: 5,
        upcomingEvents: 2,
        totalSpent: 2340,
        favoriteEvents: 8,
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800">EventManager</h1>
              <Badge variant="outline" className="border-sky-300 text-sky-700">
                {user.uloga}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {user.ime} {user.prezime}
              </span>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-slate-800">
                <LogOut className="h-4 w-4 mr-2" />
                Odjava
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-white/60 border border-sky-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-sky-100">
              Pregled
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-sky-100">
              Profil
            </TabsTrigger>
            {isOrganizer ? (
              <>
                <TabsTrigger value="offers" className="data-[state=active]:bg-sky-100">
                  Ponude
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-sky-100">
                  Događaji
                </TabsTrigger>
                <TabsTrigger value="reservations" className="data-[state=active]:bg-sky-100">
                  Rezervacije
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="feed" className="data-[state=active]:bg-sky-100">
                  Događaji
                </TabsTrigger>
                <TabsTrigger value="reservations" className="data-[state=active]:bg-sky-100">
                  Rezervacije
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isOrganizer ? (
                <>
                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Ukupno događaja</CardTitle>
                      <Calendar className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.totalEvents}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Aktivne rezervacije</CardTitle>
                      <Users className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.activeReservations}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Ukupni prihod</CardTitle>
                      <Euro className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">€{stats.totalRevenue}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Prosječna ocjena</CardTitle>
                      <Star className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.avgRating}</div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Moje rezervacije</CardTitle>
                      <Calendar className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.totalReservations}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Nadolazeći događaji</CardTitle>
                      <Clock className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.upcomingEvents}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Ukupno potrošeno</CardTitle>
                      <Euro className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">€{stats.totalSpent}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border-sky-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Omiljeni događaji</CardTitle>
                      <Star className="h-4 w-4 text-sky-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{stats.favoriteEvents}</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Brzi pristup */}
            <Card className="bg-white/80 border-sky-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Brzi pristup</CardTitle>
                <CardDescription className="text-slate-600">Najčešće korištene funkcije</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {isOrganizer ? (
                    <>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("events")}
                      >
                        <Plus className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Novi događaj</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("offers")}
                      >
                        <MapPin className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Upravljaj ponudama</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("reservations")}
                      >
                        <Users className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Rezervacije</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("profile")}
                      >
                        <User className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Profil</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("feed")}
                      >
                        <Calendar className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Pretraži događaje</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("reservations")}
                      >
                        <Clock className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Moje rezervacije</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50"
                        onClick={() => setActiveTab("profile")}
                      >
                        <User className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Profil</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2 border-sky-200 hover:bg-sky-50">
                        <Star className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Omiljeni</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileView user={user} />
          </TabsContent>

          {isOrganizer && (
            <>
              <TabsContent value="offers">
                <OffersView />
              </TabsContent>
              <TabsContent value="events">
                <EventsView />
              </TabsContent>
            </>
          )}

          {!isOrganizer && (
            <TabsContent value="feed">
              <EventsFeed />
            </TabsContent>
          )}

          <TabsContent value="reservations">
            <ReservationsView userRole={user.uloga} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
