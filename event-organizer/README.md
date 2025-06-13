# Event Organizer Frontend

Modern, minimalist event organizer application built with TypeScript, Vite, and React.

## Features

### For Organizers (ORGANIZATOR)
- **Dashboard** - Overview of events, reservations, offers, and spaces
- **Event Management** - Create, edit, delete events with offers and spaces
- **Offer Management** - Manage services (props, catering, drinks, services)
- **Space Management** - Manage event venues with capacity
- **Reservation Management** - View and manage all reservations

### For Customers (KUPAC)
- **Event Browsing** - Filter events by price, capacity, location
- **Reservations** - Book events with automatic price calculation
- **Guest Lists** - Create and manage reusable guest lists
- **Payment Simulation** - Simple payment flow simulation

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit `.env` and set your API URL:
   \`\`\`
   VITE_API_URL=http://localhost:3000/api
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## Project Structure

\`\`\`
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProtectedRoute.tsx
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── organizer/      # Organizer-specific pages
│   ├── customer/       # Customer-specific pages
│   ├── Login.tsx
│   └── Register.tsx
├── services/           # API services
│   └── api.ts         # Axios configuration
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
\`\`\`

## API Integration

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Organizer Endpoints
- `GET /organizer/dashboard/stats` - Dashboard statistics
- `GET /organizer/events` - Get organizer's events
- `POST /organizer/events` - Create new event
- `PUT /organizer/events/:id` - Update event
- `DELETE /organizer/events/:id` - Delete event
- `GET /organizer/offers` - Get organizer's offers
- `POST /organizer/offers` - Create new offer
- `PUT /organizer/offers/:id` - Update offer
- `DELETE /organizer/offers/:id` - Delete offer
- `GET /organizer/spaces` - Get organizer's spaces
- `POST /organizer/spaces` - Create new space
- `PUT /organizer/spaces/:id` - Update space
- `DELETE /organizer/spaces/:id` - Delete space
- `GET /organizer/reservations` - Get all reservations for organizer's events

### Customer Endpoints
- `GET /customer/dashboard/stats` - Dashboard statistics
- `GET /customer/events` - Get all available events
- `GET /customer/events/:id` - Get event details
- `GET /customer/events/:id/offers` - Get event offers
- `GET /customer/events/:id/termini` - Get available time slots
- `GET /customer/reservations` - Get customer's reservations
- `POST /customer/reservations` - Create new reservation
- `PUT /customer/reservations/:id/pay` - Pay for reservation
- `PUT /customer/reservations/:id/cancel` - Cancel reservation
- `GET /customer/guest-lists` - Get customer's guest lists
- `POST /customer/guest-lists` - Create new guest list
- `PUT /customer/guest-lists/:id` - Update guest list
- `DELETE /customer/guest-lists/:id` - Delete guest list

## Features

### Automatic Price Calculation
The application automatically calculates event prices using the formula:
**Total Price = Fixed Price + (Number of Guests × Price Per Person)**

### Role-Based Access Control
- **ORGANIZATOR**: Can manage events, offers, spaces, and view reservations
- **KUPAC**: Can browse events, make reservations, and manage guest lists

### Responsive Design
The application is fully responsive and works on desktop, tablet, and mobile devices.

### Modern UI/UX
- Clean, minimalist design
- Intuitive navigation
- Loading states and error handling
- Modal dialogs for forms
- Search and filtering capabilities

## Environment Variables

- `VITE_API_URL` - Backend API base URL

## License

This project is licensed under the MIT License.
\`\`\`

Gotovo! Sada imate kompletnu modernu, minimalističku frontend aplikaciju za organizator događaja. Aplikacija uključuje:

## 🚀 **Za pokretanje:**

1. **Instaliraj dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Postavi environment varijable:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Uredi `.env` i postavi API URL:
   \`\`\`
   VITE_API_URL=http://localhost:3000/api
   \`\`\`

3. **Pokreni development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📁 **Struktura projekta je potpuna s:**
- Kompletnim routing sustavom
- Autentifikacijom i role-based pristupom
- Svim potrebnim stranicama za organizatore i kupce
- Responzivnim dizajnom
- TypeScript konfigurацијом
- Tailwind CSS setupom
- Vite konfigurацијом

Aplikacija je spremna za korištenje i integraciju s vašim backend API-jem!
