import { useState, useEffect } from "react";
import StatCards from "../components/StatCards";
import DecisionChart from "../components/DecisionChart";
import RiskChart from "../components/RiskChart";
import WeatherChart from "../components/WeatherChart";
import DisagreementChart from "../components/DisagreementChart";
import axios from "axios";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [risk, setRisk] = useState(null);
  const [weather, setWeather] = useState(null);
  const [disagreement, setDisagreement] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const [summaryRes, riskRes, weatherRes, disagreementRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/analytics/summary`),
            axios.get(`${BASE_URL}/analytics/risk-analysis`),
            axios.get(`${BASE_URL}/analytics/weather`),
            axios.get(`${BASE_URL}/analytics/disagreements`),
          ]);

        const s = summaryRes.data;
        const r = riskRes.data;
        const w = weatherRes.data;
        const d = disagreementRes.data;

        // SUMMARY
        setSummary({
          total_runs: s.total_runs,
          override_rate: (s.override_rate * 100).toFixed(1),
          avg_latency: s.average_latency_ms,
          avg_risk_score: s.average_risk_score,
          decision_distribution: {
            STOP: s.decision_distribution["STOP"] || 0,
            SLOW_DOWN:
              s.decision_distribution["SLOW DOWN"] ||
              s.decision_distribution["SLOW_DOWN"] ||
              0,
            CONTINUE: s.decision_distribution["CONTINUE"] || 0,
          },
        });

        // RISK
        setRisk(r.risk_distribution);

        // WEATHER
        setWeather(
          Object.entries(w.decision_by_weather).map(
            ([weatherType, decisions]) => ({
              weather: weatherType,
              STOP: decisions["STOP"] || 0,
              SLOW_DOWN:
                decisions["SLOW DOWN"] ||
                decisions["SLOW_DOWN"] ||
                0,
              CONTINUE: decisions["CONTINUE"] || 0,
            })
          )
        );

        // DISAGREEMENT
        setDisagreement({
          counts: d.disagreement_distribution,
          critical_rate: (d.critical_rate * 100).toFixed(2),
        });

      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl">Loading analytics...</h2>
      </div>
    );
  }

  // ❌ ERROR UI
  if (!summary || !risk || !weather || !disagreement) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl text-red-500">Failed to load analytics</h2>
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <StatCards data={summary} />
      <DecisionChart data={summary.decision_distribution} />
      <RiskChart data={risk} />
      <WeatherChart data={weather} />
      <DisagreementChart data={disagreement} />
    </div>
  );
};

export default Analytics;