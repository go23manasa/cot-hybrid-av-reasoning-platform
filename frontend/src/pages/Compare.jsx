import { useState } from "react";
import CompareForm from "../components/CompareForm";
import CompareGrid from "../components/CompareGrid";
import { compareModels } from "../api/client";

const Compare = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (formData) => {
    try {
      setLoading(true);

      const res = await compareModels(formData);

      // ✅ FIX: Map backend response to frontend format
      const mappedData = {
        plain: {
          ...res.data.comparison.plain_llm,
          latency: res.data.comparison.plain_llm.latency_ms,
        },
        rule: {
          decision: res.data.comparison.rule_only.decision,
          confidence: res.data.comparison.rule_only.risk_score, // fallback (since no confidence)
          latency: res.data.comparison.rule_only.latency_ms,
        },
        rag: {
          ...res.data.comparison.rag_llm,
          decision: res.data.comparison.rag_llm.final_decision,
          latency: res.data.comparison.rag_llm.latency_ms,
          rules: res.data.comparison.rag_llm.retrieved_rules,
          override: res.data.comparison.rag_llm.override_applied,
        },
        hybrid: {
          ...res.data.comparison.hybrid,
          latency: res.data.comparison.hybrid.latency_ms,
          override: res.data.comparison.hybrid.override_applied,
        },
      };

      setData(mappedData);
    } catch (err) {
      console.error(err);
      alert("Error fetching comparison");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
  <h1 className="text-3xl font-bold mb-6">Compare Models</h1>

  <div className="flex gap-6">

    {/* LEFT PANEL */}
    <div className="w-[320px] flex-shrink-0">
      <CompareForm onSubmit={handleCompare} loading={loading} />
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 bg-zinc-900 rounded-xl p-6">
      {data ? (
        <CompareGrid data={data} />
      ) : (
        <p className="text-gray-400 text-center mt-20">
          Run a simulation to see results
        </p>
      )}
    </div>

  </div>
</div>
);
};

export default Compare;