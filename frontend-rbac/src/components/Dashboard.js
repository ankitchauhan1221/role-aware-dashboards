import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user, logout, hasPermission } = useContext(AuthContext);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-blue-600 font-semibold">Dashboard</p>
        <h1 className="text-3xl font-bold mt-1">Welcome, {user.name}</h1>
        <p className="text-gray-600">Role: {user.role}</p>
        <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-600">
          {user.permissions.map((p) => (
            <span
              key={p}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {hasPermission("read:users") && (
          <Link
            to="/users"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-5 shadow hover:shadow-md transition block"
          >
            <div className="text-sm opacity-90">Manage</div>
            <div className="text-xl font-semibold">User Management</div>
            <p className="text-xs mt-1 opacity-80">
              Create, edit, and delete users.
            </p>
          </Link>
        )}

        {hasPermission("view:reports") && (
          <Link
            to="/reports"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-5 shadow hover:shadow-md transition block"
          >
            <div className="text-sm opacity-90">Insights</div>
            <div className="text-xl font-semibold">View Reports</div>
            <p className="text-xs mt-1 opacity-80">
              Static sample reports for demo.
            </p>
          </Link>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-500">Session</div>
            <div className="text-xl font-semibold text-gray-800">Signed in</div>
            <p className="text-xs mt-1 text-gray-500">
              Use the links to manage or view reports.
            </p>
          </div>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
