import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/react"; // Import เข้ามา

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Highlights from "./components/Highlights";
import Rooms from "./components/Rooms";
import Gallery from "./components/Gallery";
import Location from "./components/Location";
import Footer from "./components/Footer";
import RoomDetail from "./components/RoomDetail";
import Layout from "./components/Layout";
import ShowCalendar from "./components/ShowCalendar";
import Restaurant from "./components/Restaurant";
import BookingRoom from "./components/Booking"

function AppContent() {
  const { lang } = useLanguage(); // ดึงภาษาปัจจุบัน

  return (
    <main className={`min-h-screen lang-${lang}`}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Story />
              <Highlights />
              <Rooms />
              <Restaurant/>
              {/* <ShowCalendar/> //ยังไม่ใช้*/}
              <Gallery />
              <Layout />
              <Location />
              <Footer />
            </>
          }
        />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/booking" element={<BookingRoom/>} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* <Analytics /> */}
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
