import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await api.get("/session");
    setSessions(res.data.sessions);
  };

  const updateStatus = async (sessionId, status) => {
    try {
      await api.put(`/session/${sessionId}/status`, { status });
      fetchSessions();
    } catch (err) {
      alert("Failed to update session");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const renderTopActions = (s) => {
    const status = s.status.toLowerCase();

    if (status === "pending") {
      return (
        <>
          <button
            onClick={() => updateStatus(s._id, "CONFIRMED")}
            className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus(s._id, "CANCELLED")}
            className="text-xs px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Cancel
          </button>
        </>
      );
    }

    if (status === "confirmed" || status === "ongoing") {
      return (
        <>
          <button
            onClick={() => updateStatus(s._id, "COMPLETED")}
            className="text-xs px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Done
          </button>
          <button
            onClick={() => updateStatus(s._id, "CANCELLED")}
            className="text-xs px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Cancel
          </button>
        </>
      );
    }

    return null;
  };

  const renderBottomAction = (s) => {
    const status = s.status.toLowerCase();

    if (status === "confirmed" || status === "ongoing") {
      return (
        <a
          href={s.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Join Meeting
        </a>
      );
    }

    return (
      <div className="mt-4 w-full text-center bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg">
        {s.status}
      </div>
    );
  };

  return (
    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((s) => (
        <div
          key={s._id}
          className="relative bg-gradient-to-r from-white to-gray-50 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition"
        >
          {/* TOP RIGHT ACTIONS */}
          {renderTopActions(s) && (
            <div className="absolute top-4 right-4 flex gap-2">
              {renderTopActions(s)}
            </div>
          )}

          {/* USERS */}
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            {s.hostUser.username} ↔ {s.guestUser.username}
          </h3>

          {/* STATUS */}
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              s.status,
            )}`}
          >
            {s.status}
          </span>

          {/* SKILLS */}
          <div className="mt-3 space-y-2">
            {s.hostUser.skills?.canTeach?.length > 0 && (
              <div>
                <p className="text-sm font-semibold">
                  {s.hostUser.username} can teach:
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.hostUser.skills.canTeach.map((skill) => (
                    <span
                      key={skill._id}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {s.guestUser.skills?.wantToLearn?.length > 0 && (
              <div>
                <p className="text-sm font-semibold">
                  {s.guestUser.username} wants to learn:
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.guestUser.skills.wantToLearn.map((skill) => (
                    <span
                      key={skill._id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM ACTION */}
          {renderBottomAction(s)}
        </div>
      ))}
    </div>
  );
}
