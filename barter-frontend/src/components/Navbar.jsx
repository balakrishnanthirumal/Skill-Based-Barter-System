import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();

  // ✅ Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ If no user → don't show navbar
  if (!user) return null;

  const logout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Barter</h1>

      <div className="flex items-center space-x-4">
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/barter">Barter</Link>
        <Link to="/skills"> Skills</Link>
        <Link to="/sessions">Sessions</Link>
        <Link to="/profile">Profile</Link>

        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
