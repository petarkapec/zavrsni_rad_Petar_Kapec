import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { ProtectedRoute } from "./components/protected-route"
import { LoginPage } from "./pages/login-page"
import { CustomerLayout } from "./layouts/customer-layout"
import { OrganizerLayout } from "./layouts/organizer-layout"
import { EventFeed } from "./pages/customer/event-feed"
import { EventDetails } from "./pages/customer/event-details"
import { ReservationForm } from "./pages/customer/reservation-form"
import { Payment } from "./pages/customer/payment"
import { CustomerProfile } from "./pages/customer/customer-profile"
import { CustomerReservations } from "./pages/customer/customer-reservations"
import { OrganizerDashboard } from "./pages/organizer/organizer-dashboard"
import { CreateEvent } from "./pages/organizer/create-event"
import { OrganizerEvents } from "./pages/organizer/organizer-events"
import { OrganizerProfile } from "./pages/organizer/organizer-profile"
import { ManageReservations } from "./pages/organizer/manage-reservations"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute role="Kupac">
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<EventFeed />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="events/:id/reserve" element={<ReservationForm />} />
              <Route path="payment/:reservationId" element={<Payment />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="reservations" element={<CustomerReservations />} />
            </Route>

            {/* Organizer Routes */}
            <Route
              path="/organizer"
              element={
                <ProtectedRoute role="Organizator">
                  <OrganizerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OrganizerDashboard />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="events" element={<OrganizerEvents />} />
              <Route path="reservations" element={<ManageReservations />} />
              <Route path="profile" element={<OrganizerProfile />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
