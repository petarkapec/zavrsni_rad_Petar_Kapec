import { Outlet } from "react-router-dom"
import { OrganizerNavbar } from "../components/organizer-navbar"

export function OrganizerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizerNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
