import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DisagreementChart = ({ data }) => {
  if (!data || !data.counts) return null;

  const chartData = Object.entries(data.counts).map(([key, value]) => ({
    type: key,
    value,
  }));

  const getColor = (type) => {
    if (type === "NONE") return "#22c55e";       // green
    if (type === "MODERATE") return "#f59e0b";   // yellow
    if (type === "CRITICAL") return "#ef4444";   // red
    return "#3b82f6"; // fallback
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="text-white mb-2">Disagreement Levels</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="type" stroke="#ccc" />
          <YAxis stroke="#ccc" />

          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #444" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />

          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-red-400">
        Critical Rate: {data.critical_rate}%
      </p>
    </div>
  );
};

export default DisagreementChart;