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
    const payload = {
      objects: [
        {
          type: form.object_type,
          distance: Number(form.distance),
        }
      ],
      ego_speed: Number(form.speed),
      weather: form.weather,
      timestamp: new Date().toISOString()
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-5 rounded-xl shadow-lg space-y-4 border border-zinc-700"
    >
      {/* Object Type */}
      <select
        name="object_type"
        value={form.object_type}
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded"
      >
        <option value="pedestrian">pedestrian</option>
        <option value="car">car</option>
        <option value="truck">truck</option>
        <option value="cyclist">cyclist</option>
      </select>

      {/* Distance */}
      <input
        type="number"
        name="distance"
        value={form.distance}
        placeholder="Distance (m)"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded placeholder-gray-400"
      />

      {/* Speed */}
      <input
        type="number"
        name="speed"
        value={form.speed}
        placeholder="Speed (km/h)"
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded placeholder-gray-400"
      />

      {/* Weather */}
      <select
        name="weather"
        value={form.weather}
        onChange={handleChange}
        className="w-full p-2 bg-black text-white border border-zinc-700 rounded"
      >
        <option value="clear">clear</option>
        <option value="rain">rain</option>
        <option value="fog">fog</option>
        <option value="snow">snow</option>
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