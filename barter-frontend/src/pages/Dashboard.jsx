import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    completedSessionsCount: 0,
    cancelledSessionsCount: 0,
    pendingSessionsCount: 0,
    unmatchedRequestsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/data")
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading dashboard data...
      </div>
    );
  }

  console.log(dashboardData);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Barter</h1>
        <p className="text-gray-600 mt-2">
          Exchange skills, learn faster, grow together 🚀
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Completed Sessions */}
        <div className="p-6 bg-gray-100 rounded-2xl text-center shadow hover:shadow-lg transition flex flex-col items-center">
          <FiCheckCircle className="text-green-500 text-3xl mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">
            {dashboardData.completedSessionsCount}
          </h2>
          <p className="text-gray-600 mt-1">Completed Sessions</p>
        </div>

        {/* Cancelled Sessions */}
        <div className="p-6 bg-red-100 rounded-2xl text-center shadow hover:shadow-lg transition flex flex-col items-center">
          <FiXCircle className="text-red-500 text-3xl mb-2" />
          <h2 className="text-3xl font-bold text-red-800">
            {dashboardData.cancelledSessionsCount}
          </h2>
          <p className="text-red-700 mt-1">Cancelled Sessions</p>
        </div>

        {/* Pending Sessions */}
        <div className="p-6 bg-yellow-100 rounded-2xl text-center shadow hover:shadow-lg transition flex flex-col items-center">
          <FiClock className="text-yellow-500 text-3xl mb-2" />
          <h2 className="text-3xl font-bold text-yellow-800">
            {dashboardData.pendingSessionsCount}
          </h2>
          <p className="text-yellow-700 mt-1">Pending Sessions</p>
        </div>

        {/* Unmatched Barter Requests */}
        <div className="p-6 bg-blue-100 rounded-2xl text-center shadow hover:shadow-lg transition flex flex-col items-center">
          <FiAlertCircle className="text-blue-500 text-3xl mb-2" />
          <h2 className="text-3xl font-bold text-blue-800">
            {dashboardData.unmatchedRequestsCount}
          </h2>
          <p className="text-blue-700 mt-1">Unmatched Requests</p>
        </div>
      </div>
    </div>
  );
}
