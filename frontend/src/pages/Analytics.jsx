import { useEffect, useState } from "react";
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

  const BASE_URL = "http://127.0.0.1:8000"; // adjust if needed

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

        setSummary(summaryRes.data);
        setRisk(riskRes.data);
        setWeather(weatherRes.data);
        setDisagreement(disagreementRes.data);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl">Loading analytics...</h2>
      </div>
    );
  }

  if (!summary || !risk || !weather || !disagreement) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl text-red-500">Failed to load analytics</h2>
      </div>
    );
  }

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