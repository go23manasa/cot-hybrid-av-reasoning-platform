import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DisagreementChart = ({ data }) => {
    if (!data || !data.counts) return null;
    const chartData = Object.entries(data.counts).map(([key, value]) => ({
    type: key,
    value,
  }));

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2>Disagreement Levels</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="type" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-red-400">
        Critical Rate: {data.critical_rate}%
      </p>
    </div>
  );
};

export default DisagreementChart;