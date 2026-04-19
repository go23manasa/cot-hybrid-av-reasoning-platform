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
        },
      ],
      ego_speed: Number(form.speed),
      weather: form.weather,
      timestamp: new Date().toISOString(),
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 space-y-4"
    >
      <h2 className="text-xl font-semibold">Simulation Input</h2>

      {/* Object */}
      <div>
        <label className="text-gray-400 text-sm">Object Type</label>
        <select
          name="object_type"
          value={form.object_type}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-black text-white border border-zinc-700 rounded"
        >
          <option value="pedestrian">Pedestrian</option>
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="cyclist">Cyclist</option>
        </select>
      </div>

      {/* Distance */}
      <div>
        <label className="text-gray-400 text-sm">Distance (m)</label>
        <input
          type="number"
          name="distance"
          value={form.distance}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-black text-white border border-zinc-700 rounded"
        />
      </div>

      {/* Speed */}
      <div>
        <label className="text-gray-400 text-sm">Speed (km/h)</label>
        <input
          type="number"
          name="speed"
          value={form.speed}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-black text-white border border-zinc-700 rounded"
        />
      </div>

      {/* Weather */}
      <div>
        <label className="text-gray-400 text-sm">Weather</label>
        <select
          name="weather"
          value={form.weather}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-black text-white border border-zinc-700 rounded"
        >
          <option value="clear">Clear</option>
          <option value="rain">Rain</option>
          <option value="fog">Fog</option>
          <option value="snow">Snow</option>
        </select>
      </div>

      {/* Button */}
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