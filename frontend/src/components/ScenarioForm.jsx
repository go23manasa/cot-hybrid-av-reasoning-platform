import { useState } from "react";

export default function ScenarioForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    object: "pedestrian",
    distance: 10,
    speed: 30,
    weather: "clear",
    mode: "hybrid",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg shadow-black/30 space-y-4">
      <h2 className="text-xl font-semibold">Simulation Input</h2>

      <select name="object" onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
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
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
      />

      <input
        type="number"
        name="speed"
        placeholder="Speed (km/h)"
        onChange={handleChange}
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
      />

      <select name="weather" onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
        <option>clear</option>
        <option>rain</option>
        <option>fog</option>
        <option>snow</option>
      </select>

      <select name="mode" onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
        <option value="hybrid">Hybrid</option>
        <option value="rag">RAG</option>
      </select>

      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="w-full bg-white text-black py-2 rounded-xl font-semibold hover:bg-gray-200"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>
    </div>
  );
}