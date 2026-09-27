import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CustomerDataProvider } from "../context/CustomerDataContext";

export default function Layout() {
  return (
    <CustomerDataProvider>
      <div className="app-shell">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </CustomerDataProvider>
  );
}
