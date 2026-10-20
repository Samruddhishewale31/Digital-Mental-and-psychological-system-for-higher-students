import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const StudentNavbarGuard = () => {
  const location = useLocation();

  const isAdminPage =
    location.pathname === "/admin-login" ||
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  if (isAdminPage) {
    return null;
  }

  return <Navbar />;
};

export default StudentNavbarGuard;
