export default function MetricsPanel({ metrics, latency }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-[110px]">
        <p className="text-gray-400 text-sm">Risk Score</p>
        <p className="text-2xl font-semibold">{metrics.risk_score}</p>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-[110px]">
        <p className="text-gray-400 text-sm">Min TTC</p>
        <p className="text-2xl font-semibold">{metrics.min_ttc}s</p>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-[110px]">
        <p className="text-gray-400 text-sm">Stopping Distance</p>
        <p className="text-2xl font-semibold">{metrics.stopping_distance}m</p>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-[110px]">
        <p className="text-gray-400 text-sm">Latency</p>
        <p className="text-2xl font-semibold">
          {latency?.total_ms?.toFixed(2)} ms
        </p>
      </div>

    </div>
  );
}