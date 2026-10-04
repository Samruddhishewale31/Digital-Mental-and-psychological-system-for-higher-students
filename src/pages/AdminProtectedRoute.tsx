import { Navigate } from "react-router-dom";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({
  children,
}: AdminProtectedRouteProps) => {
  const isAdmin =
    sessionStorage.getItem("mindease-admin-auth") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;