import { ShieldCheck, LogIn, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn =
    sessionStorage.getItem("mindease-admin-auth") === "true";

  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Assessment Analysis", path: "/admin/assessment" },
    { label: "Mental Health", path: "/admin/mental-health" },
    { label: "Trends", path: "/admin/trends" },
    { label: "Participation", path: "/admin/participation" },
  ];

  const handleNavigation = (path: string) => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) {
      return;
    }

    sessionStorage.removeItem("mindease-admin-auth");
    navigate("/admin-login", { replace: true });
  };

  return (
    <header className="w-full border-b bg-background">
      <nav className="flex h-16 items-center px-6 whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-lg font-bold">MindEase Admin</span>
        </div>

        <div className="flex flex-1 justify-center items-center gap-2">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNavigation(link.path)}
            className={`shrink-0 rounded-md px-3 py-2 text-sm ${
              isLoggedIn && location.pathname === link.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {link.label}
          </button>
        ))}
        </div>

        <div className="ml-auto shrink-0">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin-login")}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
