import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="layout-main">
      <Navbar />
      <main className="layout-main__content" style={{ paddingTop: "68px", minHeight: "calc(100vh - 68px)" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
