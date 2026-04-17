const getDecisionColor = (decision) => {
  if (decision === "STOP") return "bg-red-600";
  if (decision === "SLOW DOWN") return "bg-yellow-500";
  return "bg-green-600";
};

const CompareCard = ({ title, data, isBest, isDisagree }) => {
  if (!data) return null;

  return (
    <div
      className={`p-5 rounded-xl bg-zinc-900 shadow-lg border transition-transform duration-200 hover:scale-105
      ${
        isBest
          ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
          : isDisagree
          ? "border-red-500"
          : "border-zinc-700"
      }`}
    >
      {/* Title */}
      <h2 className="text-lg font-semibold mb-3 text-white">{title}</h2>

      {/* Decision Badge */}
      <div
        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white ${getDecisionColor(
          data.decision
        )}`}
      >
        {data.decision}
      </div>

      {/* Metrics */}
      <p className="mt-3 text-gray-400">
        Confidence: <span className="text-white">{data.confidence}%</span>
      </p>

      <p className="text-gray-400">
        Latency: <span className="text-white">{data.latency_ms} ms</span>
      </p>

      {/* RAG Rules */}
      {data.rules && (
        <div className="mt-3 text-sm text-gray-400">
          <p className="text-white font-medium">Retrieved Rules:</p>
          <ul className="list-disc ml-4 mt-1 space-y-1">
            {data.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Override */}
      {data.override && (
        <div className="mt-3 text-red-500 font-semibold text-sm">
          ⚠ Rule Override Applied
        </div>
      )}
    </div>
  );
};

const CompareGrid = ({ data }) => {
  if (!data) return null;

  // Hybrid is your "ground truth"
  const hybridDecision = data.hybrid?.decision;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
      
      <CompareCard
        title="Plain LLM"
        data={data.plain}
        isBest={data.plain?.decision === hybridDecision}
        isDisagree={data.plain?.decision !== hybridDecision}
      />

      <CompareCard
        title="Rule Engine"
        data={data.rule}
        isBest={data.rule?.decision === hybridDecision}
        isDisagree={data.rule?.decision !== hybridDecision}
      />

      <CompareCard
        title="RAG LLM"
        data={data.rag}
        isBest={data.rag?.decision === hybridDecision}
        isDisagree={data.rag?.decision !== hybridDecision}
      />

      <CompareCard
        title="Hybrid"
        data={data.hybrid}
        isBest={true}
        isDisagree={false}
      />

    </div>
  );
};

export default CompareGrid;