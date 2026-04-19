import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DecisionChart = ({ data }) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, value]) => ({
    decision: key,
    count: value,
  }));

  const getColor = (decision) => {
    if (decision === "STOP") return "#ef4444";        // red
    if (decision === "SLOW_DOWN") return "#f59e0b";   // yellow
    if (decision === "CONTINUE") return "#22c55e";    // green
    return "#3b82f6"; // fallback
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="mb-2 text-white">Decision Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="decision" stroke="#ccc" />
          <YAxis stroke="#ccc" />

          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #444" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />

          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.decision)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecisionChart;