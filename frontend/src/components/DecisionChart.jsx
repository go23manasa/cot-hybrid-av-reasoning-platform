import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DecisionChart = ({ data }) => {
    if (!data) return null;
    const chartData = Object.entries(data).map(([key, value]) => ({
    decision: key,
    count: value,
  }));

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <h2 className="mb-2">Decision Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="decision" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecisionChart;