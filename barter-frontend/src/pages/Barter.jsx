import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Barter() {
  const [skills, setSkills] = useState([]);
  const [offer, setOffer] = useState("");
  const [want, setWant] = useState("");
  const [openRequests, setOpenRequests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSkills();
    fetchMyOpenRequests();
  }, []);

  const fetchSkills = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  const fetchMyOpenRequests = async () => {
    const res = await api.get("/barter/all");

    const myOpen = res.data.filter(
      (r) => r.status === "OPEN" && r.userId._id === user._id
    );

    setOpenRequests(myOpen);
  };

  const submit = async () => {
    if (!offer || !want) {
      alert("Please select both skills");
      return;
    }

    await api.post("/barter/create", {
      skillOfferedId: offer,
      skillWantId: want,
    });
    toast.success("Barter request created successfully!");

    setOffer("");
    setWant("");
    fetchMyOpenRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* CREATE BARTER */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2">🤝 Create a Barter</h2>
          <p className="text-gray-500 mb-6">
            Offer one skill and request another in exchange
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Skill You Offer
              </label>
              <select
                className="input mt-1"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
              >
                <option value="">Select a skill</option>
                {skills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Skill You Want
              </label>
              <select
                className="input mt-1"
                value={want}
                onChange={(e) => setWant(e.target.value)}
              >
                <option value="">Select a skill</option>
                {skills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={submit}
            className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Create Barter Request
          </button>
        </div>

        {/* OPEN REQUESTS */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            📌 My Open Barter Requests
          </h2>

          {openRequests.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-lg">No open barter requests</p>
              <p className="text-sm mt-1">
                Create a barter and wait for a match ✨
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {openRequests.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500">You offer</p>
                      <p className="font-semibold text-green-700">
                        {r.skillOfferedId.name}
                      </p>
                    </div>

                    <div className="text-gray-400 text-xl">⇄</div>

                    <div>
                      <p className="text-xs text-gray-500">You want</p>
                      <p className="font-semibold text-blue-700">
                        {r.skillWantId.name}
                      </p>
                    </div>
                  </div>

                  <span className="self-start md:self-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    OPEN
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
