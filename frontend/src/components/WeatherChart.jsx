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
          <Bar dataKey="STOP" />
          <Bar dataKey="SLOW_DOWN" />
          <Bar dataKey="CONTINUE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;