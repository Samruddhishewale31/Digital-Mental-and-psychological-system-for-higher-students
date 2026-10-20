
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Copy,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "Self Assessment", path: "/assessment" },
  { label: "AI Support Chat", path: "/chat" },
  { label: "Journal", path: "/journal" },
  { label: "Stress Relief", path: "/stress-relief" },
  { label: "Creative Corner", path: "/creative-corner" },
  { label: "Counselling", path: "/counselling" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();

  const copyId = async () => {
    if (!user) return;

    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Unable to copy MindEase ID:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 h-16 backdrop-blur-md bg-card/70 border-b border-border/50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* LOGO */}
        <Link
          to="/home"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Heart className="w-6 h-6 text-primary fill-primary/20" />
          <span className="text-foreground">MindEase</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}

              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* DESKTOP AUTH AND PROFILE */}
        <div className="hidden lg:flex items-center gap-3 relative">
          {user ? (
            <>
              <Button
                variant="soft"
                size="sm"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
                aria-expanded={profileOpen}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-lg p-4 z-50"
                  >
                    {/* PROFILE HEADER */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-semibold text-foreground">
                          MindEase User
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Anonymous account
                        </p>
                      </div>
                    </div>

                    {/* MINDEASE ID */}
                    <div className="py-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        MindEase ID
                      </p>

                      <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-xl px-3 py-2">
                        <span className="font-mono text-sm font-semibold break-all">
                          {user.id}
                        </span>

                        <button
                          type="button"
                          onClick={copyId}
                          className="p-1.5 rounded-lg hover:bg-background transition-colors shrink-0"
                          title="Copy MindEase ID"
                          aria-label="Copy MindEase ID"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Keep this ID safe. You need it to log in again.
                      </p>
                    </div>

                    {/* ACCOUNT CREATED */}
                    <div className="pb-4">
                      <p className="text-xs text-muted-foreground">
                        Account created
                      </p>

                      <p className="text-sm font-medium mt-1">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Not available"}
                      </p>
                    </div>

                    {/* LOGOUT */}
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="soft" size="sm">
                  Login
                </Button>
              </Link>

              <Link to="/auth?register=true">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-16 inset-x-0 bg-card border-b border-border shadow-float p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* MOBILE PROFILE AND AUTH */}
            <div className="pt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-muted/40 border border-border p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-semibold">MindEase User</p>
                        <p className="text-xs text-muted-foreground">
                          Anonymous account
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      MindEase ID
                    </p>

                    <div className="flex items-center justify-between gap-2 bg-background rounded-xl px-3 py-2">
                      <span className="font-mono text-sm font-semibold break-all">
                        {user.id}
                      </span>

                      <button
                        type="button"
                        onClick={copyId}
                        title="Copy MindEase ID"
                        aria-label="Copy MindEase ID"
                        className="shrink-0 p-1"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      Keep this ID safe. You need it to log in again.
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/auth"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    <Button variant="soft" className="w-full">
                      Login
                    </Button>
                  </Link>

                  <Link
                    to="/auth?register=true"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
