import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

const RiskChart = ({ data }) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2>Risk Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskChart;