import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Self Assessment", path: "/assessment" },
  { label: "AI Support Chat", path: "/chat" },
  { label: "Journal", path: "/journal" },
  { label: "Stress Relief", path: "/stress-relief" },
  { label: "Counselling", path: "/counselling" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const { user, logout } = useAuth();

  const userName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  return (
    <nav className="sticky top-0 z-50 h-16 backdrop-blur-md bg-card/70 border-b border-border/50">

      <div className="container mx-auto h-full flex items-center justify-between px-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Heart className="w-6 h-6 text-primary fill-primary/20" />

          <span className="text-foreground">
            MindEase
          </span>
        </Link>


        {/* Desktop Navigation */}
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


        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-3">

          {user ? (

            <>
              <span className="text-sm font-medium">
                Hi, {userName}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </>

          ) : (

            <>
              <Link to="/auth">

                <Button
                  variant="soft"
                  size="sm"
                >
                  Login
                </Button>

              </Link>


              <Link to="/auth?register=true">

                <Button size="sm">
                  Register
                </Button>

              </Link>
            </>

          )}

        </div>



        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
        >

          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}

        </button>

      </div>



      {/* Mobile Menu */}
      <AnimatePresence>

        {open && (

          <motion.div

            initial={{
              opacity: 0,
              y: -10
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            exit={{
              opacity: 0,
              y: -10
            }}

            className="lg:hidden absolute top-16 inset-x-0 bg-card border-b border-border shadow-float p-4 space-y-1"

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



            <div className="flex gap-3 pt-3">

              {user ? (

                <>

                  <span className="flex-1 flex items-center justify-center text-sm">
                    Hi, {userName}
                  </span>


                  <Button

                    className="flex-1"

                    variant="outline"

                    onClick={() => {

                      logout();
                      setOpen(false);

                    }}

                  >

                    Logout

                  </Button>

                </>

              ) : (

                <>

                  <Link
                    to="/auth"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >

                    <Button
                      variant="soft"
                      className="w-full"
                    >
                      Login
                    </Button>

                  </Link>


                  <Link
                    to="/auth?register=true"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >

                    <Button
                      className="w-full"
                    >
                      Register
                    </Button>

                  </Link>

                </>

              )}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>
  );
};

export default Navbar;