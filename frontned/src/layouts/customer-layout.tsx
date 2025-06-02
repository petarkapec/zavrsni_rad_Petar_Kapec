import { Outlet } from "react-router-dom"
import { CustomerNavbar } from "../components/customer-navbar"

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
