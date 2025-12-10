import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-60" />
        <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="hidden lg:block text-left space-y-4">
            <p className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur rounded-full text-blue-700 text-sm font-semibold shadow-sm border border-blue-100">
              Secure RBAC Platform
            </p>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Manage users and permissions with confidence.
            </h1>
            <p className="text-gray-600 text-lg">
              Fast login, role-aware dashboards, and protected routes built on
              JWT + RBAC.
            </p>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />{" "}
                Token-based auth with refresh rotation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Admin &
                Manager user controls
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />{" "}
                Permission-guarded pages
              </li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur shadow-2xl rounded-2xl w-full p-8 border border-gray-100">
            <div className="mb-6 text-center lg:text-left">
              <p className="text-sm text-blue-600 font-semibold">RBAC Demo</p>
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mt-1">
                Sign in to manage users and reports.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Login
              </button>
            </form>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="font-semibold text-gray-700">Admin</p>
                <p>admin@example.com</p>
                <p>Admin@123</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="font-semibold text-gray-700">Manager</p>
                <p>manager@example.com</p>
                <p>Manager@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
