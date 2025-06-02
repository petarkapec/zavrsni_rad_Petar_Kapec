"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Euro, Plus, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalEvents: number
  totalReservations: number
  monthlyRevenue: number
  pendingReservations: number
}

interface RecentReservation {
  rezervacija_id: number
  dogadjaj: {
    naziv: string
  }
  kupac: {
    ime: string
    prezime: string
  }
  datum_pocetka: string
  ukupna_cijena: number
  status: string
}

export function OrganizerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Promise.all([
    //   fetch('/api/organizer/stats'),
    //   fetch('/api/organizer/recent-reservations')
    // ]).then(([statsRes, reservationsRes]) => {
    //   return Promise.all([statsRes.json(), reservationsRes.json()])
    // }).then(([statsData, reservationsData]) => {
    //   setStats(statsData)
    //   setRecentReservations(reservationsData)
    //   setIsLoading(false)
    // })

    // Mock data
    setTimeout(() => {
      setStats({
        totalEvents: 8,
        totalReservations: 24,
        monthlyRevenue: 4250,
        pendingReservations: 3,
      })

      setRecentReservations([
        {
          rezervacija_id: 1,
          dogadjaj: { naziv: "Rođendanska zabava" },
          kupac: { ime: "Ana", prezime: "Anić" },
          datum_pocetka: "2024-02-15T18:00",
          ukupna_cijena: 275,
          status: "Čeka potvrdu",
        },
        {
          rezervacija_id: 2,
          dogadjaj: { naziv: "Poslovni seminar" },
          kupac: { ime: "Marko", prezime: "Marković" },
          datum_pocetka: "2024-03-10T09:00",
          ukupna_cijena: 450,
          status: "Potvrđeno",
        },
        {
          rezervacija_id: 3,
          dogadjaj: { naziv: "Vjenčana svečanost" },
          kupac: { ime: "Petra", prezime: "Petrić" },
          datum_pocetka: "2024-04-20T16:00",
          ukupna_cijena: 1200,
          status: "Čeka potvrdu",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Pregled vaših događaja i rezervacija</p>
        </div>
        <Link to="/organizer/create-event">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novi događaj
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno događaja</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.totalEvents}</div>
            <p className="text-xs text-gray-600">Aktivni događaji</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rezervacije</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats?.totalReservations}</div>
            <p className="text-xs text-gray-600">Ukupno rezervacija</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mjesečni prihod</CardTitle>
            <Euro className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats?.monthlyRevenue}€</div>
            <p className="text-xs text-gray-600">Ovaj mjesec</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Na čekanju</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats?.pendingReservations}</div>
            <p className="text-xs text-gray-600">Čeka potvrdu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Nedavne rezervacije</CardTitle>
              <CardDescription>Najnovije rezervacije vaših događaja</CardDescription>
            </div>
            <Link to="/organizer/reservations">
              <Button variant="outline" size="sm">
                Pogledaj sve
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div key={reservation.rezervacija_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-blue-900">{reservation.dogadjaj.naziv}</div>
                  <div className="text-sm text-gray-600">
                    {reservation.kupac.ime} {reservation.kupac.prezime} • {formatDate(reservation.datum_pocetka)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={reservation.status === "Potvrđeno" ? "default" : "secondary"}>
                    {reservation.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-semibold">{reservation.ukupna_cijena}€</div>
                    <div className="text-sm text-gray-600">#{reservation.rezervacija_id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/organizer/create-event">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Kreiraj novi događaj</h3>
              <p className="text-sm text-gray-600 mt-1">Dodaj novi događaj u svoju ponudu</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/organizer/reservations">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Upravljaj rezervacijama</h3>
              <p className="text-sm text-gray-600 mt-1">Potvrdi ili otkaži rezervacije</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/organizer/events">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Moji događaji</h3>
              <p className="text-sm text-gray-600 mt-1">Pregled i uređivanje događaja</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
