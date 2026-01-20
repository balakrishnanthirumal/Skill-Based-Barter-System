import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function UserSkills() {
  const [allSkills, setAllSkills] = useState([]);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkillName, setNewSkillName] = useState("");

  // Fetch all available skills
  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setAllSkills(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch current user skills
  useEffect(() => {
    api
      .get("/userskills/user")
      .then((res) => {
        const canTeach = res.data
          .filter((s) => s.type === "CAN_TEACH")
          .map((s) => s.skillsId._id);
        const wantToLearn = res.data
          .filter((s) => s.type === "WANT_TO_LEARN")
          .map((s) => s.skillsId._id);

        setTeachSkills(canTeach);
        setLearnSkills(wantToLearn);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    try {
      await api.put("/userskills/profile", {
        teachSkills,
        learnSkills,
      });
      toast.success("Skills updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update skills");
    }
  };

  const toggleSkill = (id, type) => {
    if (type === "teach") {
      setTeachSkills((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
      // Remove from learnSkills if added to teach
      setLearnSkills((prev) => prev.filter((s) => s !== id));
    } else {
      setLearnSkills((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    }
  };

  // Add new skill to backend
  const addNewSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const res = await api.post("/skills", { name: newSkillName });
      toast.success(`Skill "${res.data.name}" added!`);
      setNewSkillName("");
      fetchSkills(); // refresh skills list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add skill");
    }
  };

  if (loading) return <div>Loading skills...</div>;

  // Filter skills for "Want to Learn" section
  const learnableSkills = allSkills.filter(
    (skill) =>
      !teachSkills.includes(skill._id) && !learnSkills.includes(skill._id)
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Update Your Skills</h2>

      {/* Add New Skill */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Add new skill"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          className="px-3 py-2 border rounded w-full"
        />
        <button
          onClick={addNewSkill}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {/* Skills User Can Teach */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Skills You Can Teach</h3>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <button
              key={skill._id}
              onClick={() => toggleSkill(skill._id, "teach")}
              className={`px-3 py-1 rounded-full border ${
                teachSkills.includes(skill._id)
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {skill.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills User Wants to Learn */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Skills You Want to Learn</h3>
        <div className="flex flex-wrap gap-2">
          {learnableSkills.map((skill) => (
            <button
              key={skill._id}
              onClick={() => toggleSkill(skill._id, "learn")}
              className={`px-3 py-1 rounded-full border ${
                learnSkills.includes(skill._id)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {skill.name}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Save Skills
      </button>

      {/* List of Skills User Already Knows */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Skills You Already Know</h3>
        <div className="flex flex-wrap gap-2">
          {teachSkills.length === 0 ? (
            <span className="text-gray-500">No skills added yet.</span>
          ) : (
            allSkills
              .filter((skill) => teachSkills.includes(skill._id))
              .map((skill) => (
                <span
                  key={skill._id}
                  className="px-3 py-1 rounded-full bg-green-200 text-green-800"
                >
                  {skill.name}
                </span>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
