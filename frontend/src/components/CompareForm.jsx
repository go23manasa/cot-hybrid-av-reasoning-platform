import { useState } from "react";

const CompareForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    object_type: "pedestrian",
    distance: "",
    speed: "",
    weather: "clear",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-5 rounded-xl shadow-lg space-y-4 border border-zinc-700"
    >
      <select
        name="object_type"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded"
      >
        <option>pedestrian</option>
        <option>car</option>
        <option>truck</option>
        <option>cyclist</option>
      </select>

      <input
        type="number"
        name="distance"
        placeholder="Distance (m)"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded placeholder-gray-400"
      />

      <input
        type="number"
        name="speed"
        placeholder="Speed (km/h)"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded placeholder-gray-400"
      />

      <select
        name="weather"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded"
      >
        <option>clear</option>
        <option>rain</option>
        <option>fog</option>
        <option>snow</option>
      </select>

      <button
        type="submit"
        className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
      >
        {loading ? "Running..." : "Run Comparison"}
      </button>
    </form>
  );
};

export default CompareForm;