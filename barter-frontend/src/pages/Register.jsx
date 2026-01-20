import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    rollNumber: "",
  });

  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/users", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Join Barter and start skill exchanging
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              className="input mt-1 w-full"
              placeholder="John Doe"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="input mt-1 w-full"
              placeholder="john@email.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="input mt-1 w-full"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Department</label>
            <input
              className="input mt-1 w-full"
              placeholder="Computer Science"
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Roll Number</label>
            <input
              className="input mt-1 w-full"
              placeholder="123456"
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          className="w-full mt-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
        >
          Register
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
