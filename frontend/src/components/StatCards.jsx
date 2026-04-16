const StatCards = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Total Runs" value={data.total_runs} />
      <Card title="Override Rate" value={`${data.override_rate}%`} />
      <Card title="Avg Latency" value={`${data.avg_latency} ms`} />
      <Card title="Avg Risk Score" value={data.avg_risk_score} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

export default StatCards;