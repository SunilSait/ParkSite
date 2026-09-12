/**
 * App.jsx — Route definitions for the entire application.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Locations from './pages/public/Locations';
import ParkingDetail from './pages/public/ParkingDetail';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyBookings from './pages/user/MyBookings';
import BookingDetail from './pages/user/BookingDetail';
import Payment from './pages/user/Payment';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageLocations from './pages/admin/ManageLocations';
import ManageSlots from './pages/admin/ManageSlots';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import Reports from './pages/admin/Reports';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public Routes (with Navbar & Footer) ────── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:id" element={<ParkingDetail />} />
          </Route>

          {/* ── User Routes (Protected) ─────────────────── */}
          <Route element={<MainLayout />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/bookings" element={<MyBookings />} />
              <Route path="/user/booking/:id" element={<BookingDetail />} />
              <Route path="/user/booking/:id/payment" element={<Payment />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ── Admin Routes (Protected + Admin Only) ───── */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/locations" element={<ManageLocations />} />
            <Route path="/admin/slots" element={<ManageSlots />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
