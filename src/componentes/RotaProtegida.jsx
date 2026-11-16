
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./VerificadorLogin";

export default function RotaProtegida() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando autenticação...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}