import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { hasPermission } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasPermission("view:reports")) return navigate("/403");
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/reports");
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [hasPermission, navigate]);

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-purple-600 font-semibold">Reports</p>
        <h1 className="text-3xl font-bold mt-1">Insights</h1>
        <p className="text-gray-600">Static demo data for ADMIN and MANAGER.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                {r.id}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500">Demo report</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
