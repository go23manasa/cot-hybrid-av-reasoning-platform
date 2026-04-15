import StatCards from "../components/StatCards";
import DecisionChart from "../components/DecisionChart";
import RiskChart from "../components/RiskChart";
import WeatherChart from "../components/WeatherChart";
import DisagreementChart from "../components/DisagreementChart";

const Analytics = () => {
  // ✅ DUMMY DATA (FOR TESTING UI)
  const data = {
    summary: {
      total_runs: 120,
      override_rate: 35,
      avg_latency: 220,
      avg_risk_score: 0.62,
      decision_distribution: {
        STOP: 30,
        SLOW_DOWN: 50,
        CONTINUE: 40,
      },
    },
    risk: {
      low: 40,
      medium: 50,
      high: 30,
    },
    weather: [
      { weather: "clear", STOP: 10, SLOW_DOWN: 20, CONTINUE: 30 },
      { weather: "rain", STOP: 15, SLOW_DOWN: 25, CONTINUE: 10 },
    ],
    disagreement: {
      counts: {
        low: 20,
        medium: 15,
        high: 10,
      },
      critical_rate: 12,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <StatCards data={data.summary} />
      <DecisionChart data={data.summary.decision_distribution} />
      <RiskChart data={data.risk} />
      <WeatherChart data={data.weather} />
      <DisagreementChart data={data.disagreement} />
    </div>
  );
};

export default Analytics;