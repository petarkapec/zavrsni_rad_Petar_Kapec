import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import OrganizerDashboard from "./pages/organizer/Dashboard"
import OrganizerEvents from "./pages/organizer/Events"
import OrganizerOffers from "./pages/organizer/Offers"
import OrganizerSpaces from "./pages/organizer/Spaces"
import SpaceTimeSlots from "./pages/organizer/SpaceTImeSlots"
import OrganizerReservations from "./pages/organizer/Reservations"
import CustomerDashboard from "./pages/customer/Dashboard"
import CustomerEvents from "./pages/customer/Events"
import CustomerReservations from "./pages/customer/Reservations"
import EventDetails from "./pages/customer/EventDetails"
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Organizer Routes */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute requiredRole="ORGANIZATOR">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/organizer/dashboard" replace />} />
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="events" element={<OrganizerEvents />} />
            <Route path="offers" element={<OrganizerOffers />} />
            <Route path="spaces" element={<OrganizerSpaces />} />
            <Route path="spaces/:prostorId/time-slots" element={<SpaceTimeSlots />} />
            <Route path="reservations" element={<OrganizerReservations />} />
          </Route>

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="KUPAC">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="events" element={<CustomerEvents />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="reservations" element={<CustomerReservations />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
