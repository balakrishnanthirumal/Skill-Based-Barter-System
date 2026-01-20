import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = localStorage.getItem("user");

  // ✅ If logged in → redirect away from login/register
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
