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
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Compare Models</h1>

      <CompareForm onSubmit={handleCompare} loading={loading} />

      {data && <CompareGrid data={data} />}
    </div>
  );
};

export default Compare;