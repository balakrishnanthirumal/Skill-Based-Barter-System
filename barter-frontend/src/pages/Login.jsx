import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    // Show loading toast
    const toastId = toast.loading("Logging in...");

    try {
      const res = await api.post("/users/auth", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));

      // Success toast
      toast.success("Login successful!", { id: toastId });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Get the most accurate error message
      let message = "Something went wrong. Try again!";

      if (err.response?.data?.message) {
        message = err.response.data.message; // Server error
      } else if (err.message) {
        message = err.message; // Network or axios error
      }

      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to continue to Barter
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="input mt-1 w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="input mt-1 w-full border rounded px-3 py-2"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          className="w-full mt-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
