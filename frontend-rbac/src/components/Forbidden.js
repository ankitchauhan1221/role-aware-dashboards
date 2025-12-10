import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 text-center max-w-md w-full">
        <div className="text-4xl font-bold text-red-500">403</div>
        <h1 className="text-2xl font-semibold mt-2">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this page. Please contact an
          administrator if you need access.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
