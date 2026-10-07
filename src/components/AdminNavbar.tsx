import {
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronDown,
  CalendarDays,
  CalendarClock,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  const isLoggedIn =
    sessionStorage.getItem("mindease-admin-auth") === "true";

  const links = [
    { label: "Dashboard", path: "/admin" },
    { label: "Assessment Analysis", path: "/admin/assessment" },
    { label: "Mental Health", path: "/admin/mental-health" },
    { label: "Trends", path: "/admin/trends" },
    { label: "Participation", path: "/admin/participation" },
  ];

  const curriculumLinks = [
    {
      label: "Academic Calendar",
      path: "/admin/curriculum/academic-calendar",
      icon: CalendarDays,
    },
    {
      label: "Exam Schedule",
      path: "/admin/curriculum/exam-schedule",
      icon: CalendarClock,
    },
    {
      label: "Common Test Results",
      path: "/admin/curriculum/common-test-results",
      icon: BarChart3,
    },
  ];

  const isCurriculumActive = curriculumLinks.some(
    (item) => location.pathname === item.path
  );

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
      <nav className="relative flex h-16 items-center px-6 whitespace-nowrap">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-lg font-bold">MindEase Admin</span>
        </div>

        {/* Navigation */}
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

          {/* Curriculum Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  alert("Please login first");
                  return;
                }

                setCurriculumOpen((open) => !open);
              }}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm ${
                isCurriculumActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Curriculum
              <ChevronDown className="h-4 w-4" />
            </button>

            {isLoggedIn && curriculumOpen && (
              <div className="absolute left-0 top-full z-[9999] mt-1 w-60 rounded-md border bg-background p-1 shadow-lg">
                {curriculumLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        setCurriculumOpen(false);
                        navigate(item.path);
                      }}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-muted ${
                        location.pathname === item.path
                          ? "bg-muted font-medium"
                          : ""
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Login / Logout */}
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
