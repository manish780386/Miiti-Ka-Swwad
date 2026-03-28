import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "./Spinner.jsx";

export default function VendorRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)               return <Spinner />;
  if (!user)                 return <Navigate to="/login" replace />;
  if (user.role !== "vendor") return <Navigate to="/" replace />;
  return children;
}