import { useState } from "react";
import ScenarioForm from "../components/ScenarioForm";

import DecisionBadge from "../components/DecisionBadge";
import OverrideAlert from "../components/OverrideAlert";
import MetricsPanel from "../components/MetricsPanel";
import ReasoningSteps from "../components/ReasoningSteps";

import { runScenario, runRAG } from "../api/client";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    try {
      setLoading(true);

      const payload = {
        objects: [
          {
            type: form.object,
            distance: Number(form.distance),
          },
        ],
        ego_speed: Number(form.speed),
        weather: form.weather,
        timestamp: new Date().toISOString(),
      };

      const apiCall = form.mode === "rag" ? runRAG : runScenario;
      const res = await apiCall(payload);

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("API Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen bg-gray-950 text-white p-4 flex gap-4">

      {/* LEFT PANEL */}
      <div className="w-[280px] md:w-[320px] bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-lg font-semibold mb-6">
          Autonomous Simulation
        </h1>

        <ScenarioForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-8 overflow-y-auto">

        {!data ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Run a simulation to see results
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">

            <DecisionBadge decision={data?.decisions?.final} />
            <OverrideAlert decisions={data?.decisions} />
            {/* <MetricsPanel metrics={data?.metrics} /> */}
            <MetricsPanel 
              metrics={data?.metrics} 
              latency={data?.latency} 
            />
            <ReasoningSteps steps={data?.steps} />

          </div>
        )}

      </div>

    </div>
  );
}