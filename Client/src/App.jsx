import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./booking/contexts/LanguageContext";

import Login from "./Routes/Login";
import Dashboard from "./Routes/Dashboard/Dashboard";

import EmployeeList from "./Routes/Employee/EmployeeList";
import CreateEmployee from "./Routes/Employee/CreateEmployee";

import RoomList from "./Routes/Room/RoomList";
import CreateRoom from "./Routes/Room/CreateRoom";

import DepartmentList from "./Routes/Department/DepartmentList";

import BookingList from "./Routes/Booking/BookingList";
import CreateBooking from "./Routes/Booking/CreateBooking";
import PriceSetting from "./Routes/PriceSetting/PriceSetting";

import BookingNavbar from "./booking/components/Navbar";
import BookingHero from "./booking/components/Hero";
import BookingStory from "./booking/components/Story";
import BookingHighlights from "./booking/components/Highlights";
import BookingRooms from "./booking/components/Rooms";
import BookingRestaurant from "./booking/components/Restaurant";
import BookingGallery from "./booking/components/Gallery";
import BookingLayout from "./booking/components/Layout";
import BookingLocation from "./booking/components/Location";
import BookingFooter from "./booking/components/Footer";
import BookingRoomDetail from "./booking/components/RoomDetail";
import BookingPage from "./booking/components/BookingPage";

const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

function BookingHome() {
  return (
    <>
      <BookingNavbar />
      <BookingHero />
      <BookingStory />
      <BookingHighlights />
      <BookingRooms />
      <BookingRestaurant />
      <BookingGallery />
      <BookingLayout />
      <BookingLocation />
      <BookingFooter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>

        {/* ── Customer Webpage Routes ── */}
        <Route path="/" element={<LanguageProvider><BookingHome /></LanguageProvider>} />
        <Route path="/booking" element={<LanguageProvider><BookingPage /></LanguageProvider>} />
        <Route path="/rooms/:id" element={<LanguageProvider><BookingRoomDetail /></LanguageProvider>} />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/login"
          element={
            isAuthenticated()
              ? <Navigate to="/admin/dashboard" replace />
              : <Login />
          }
        />
        <Route path="/admin/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="/admin/employee/list" element={<PrivateRoute> <EmployeeList /> </PrivateRoute>} />
        <Route path="/admin/employee/create" element={<PrivateRoute> <CreateEmployee /> </PrivateRoute>} />
        <Route path="/admin/room/list" element={<PrivateRoute> <RoomList /> </PrivateRoute>} />
        <Route path="/admin/room/create" element={<PrivateRoute> <CreateRoom /> </PrivateRoute>} />
        <Route path="/admin/department/list" element={<PrivateRoute> <DepartmentList /> </PrivateRoute>} />
        <Route path="/admin/booking/list" element={<PrivateRoute> <BookingList /> </PrivateRoute>} />
        <Route path="/admin/booking/create" element={<PrivateRoute> <CreateBooking /> </PrivateRoute>} />
        <Route path="/admin/pricesetting" element={<PrivateRoute> <PriceSetting /> </PrivateRoute>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
