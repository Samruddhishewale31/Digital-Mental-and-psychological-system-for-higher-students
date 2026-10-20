import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

const PublicAuthRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />

          <p className="text-muted-foreground">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicAuthRoute;