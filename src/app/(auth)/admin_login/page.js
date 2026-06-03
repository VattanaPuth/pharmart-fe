"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [show, setShow] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/admin/login", {
        admin_name: username,
        password: password,
      });

      const { token, admin } = res.data;

      // ✅ IMPORTANT: match interceptor key
      // ✅ save token

      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/`;

      // ✅ save role
      localStorage.setItem("role", admin.role);

      // ✅ save user info (optional but VERY useful)
      localStorage.setItem("user", JSON.stringify(admin));

      //refresh auth context
      await refreshAuth();
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        {/* Username */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F06292] focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative w-full flex justify-center">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="
          w-full p-3 pr-10 mb-3
          rounded-lg border border-gray-300
          focus:ring-2 focus:ring-[#F06292]
          focus:outline-none
        "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-500 hover:text-gray-700
        "
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-[#F06292] text-white p-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
