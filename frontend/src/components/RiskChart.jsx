import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const RiskChart = ({ data }) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = {
    low: "#22c55e",     // green
    medium: "#f59e0b",  // yellow
    high: "#ef4444",    // red
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="text-white mb-2">Risk Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toLowerCase()] || "#3b82f6"}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #444" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskChart;