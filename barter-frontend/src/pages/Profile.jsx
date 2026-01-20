import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [teachSelect, setTeachSelect] = useState("");
  const [learnSelect, setLearnSelect] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchSkills();
    fetchUserSkills();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/users/profile");
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  const fetchSkills = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  const fetchUserSkills = async () => {
    const res = await api.get("/userskills/user");

    setTeachSkills(res.data.filter((s) => s.type === "CAN_TEACH"));
    setLearnSkills(res.data.filter((s) => s.type === "WANT_TO_LEARN"));
  };

  const addTeachSkill = () => {
    if (!teachSelect || teachSkills.some((s) => s.skillsId._id === teachSelect))
      return;

    setTeachSkills([...teachSkills, skills.find((s) => s._id === teachSelect)]);

    setTeachSelect("");
  };

  const addLearnSkill = () => {
    if (!learnSelect || learnSkills.some((s) => s.skillsId._id === learnSelect))
      return;

    setLearnSkills([...learnSkills, skills.find((s) => s._id === learnSelect)]);

    setLearnSelect("");
  };

  const removeSkill = (type, id) => {
    if (type === "teach")
      setTeachSkills(teachSkills.filter((s) => s.skillsId._id !== id));
    else setLearnSkills(learnSkills.filter((s) => s.skillsId._id !== id));
  };

  const updateSkills = async () => {
    await api.put("/userskills/profile", {
      teachSkills: teachSkills.map((s) => s.skillsId._id),
      learnSkills: learnSkills.map((s) => s.skillsId._id),
    });

    fetchUserSkills();
    alert("Skills updated successfully");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {/* USER INFO */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Department</p>
            <p className="font-semibold">{user.department}</p>
          </div>
        </div>

        {/* SKILLS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* TEACH */}
          <div>
            <h3 className="font-semibold mb-3">Skills I Can Teach</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {teachSkills.map((s) => (
                <span
                  key={s.skillsId._id}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {s.skillsId.name}
                  <button
                    onClick={() => removeSkill("teach", s.skillsId._id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={teachSelect}
                onChange={(e) => setTeachSelect(e.target.value)}
              >
                <option value="">Select skill</option>
                {skills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addTeachSkill}
                className="bg-green-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>

          {/* LEARN */}
          <div>
            <h3 className="font-semibold mb-3">Skills I Want to Learn</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {learnSkills.map((s) => (
                <span
                  key={s.skillsId._id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {s.skillsId.name}
                  <button
                    onClick={() => removeSkill("learn", s.skillsId._id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={learnSelect}
                onChange={(e) => setLearnSelect(e.target.value)}
              >
                <option value="">Select skill</option>
                {skills.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addLearnSkill}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={updateSkills}
          className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Update Skills
        </button>
      </div>
    </div>
  );
}
