import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WeatherChart = ({ data }) => {
    if (!data) return null;
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2>Weather Breakdown</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="weather" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          {/* Color-coded bars */}
          <Bar dataKey="STOP" fill="#ef4444" />        {/* red */}
          <Bar dataKey="SLOW_DOWN" fill="#f59e0b" />   {/* yellow */}
          <Bar dataKey="CONTINUE" fill="#22c55e" />    {/* green */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;