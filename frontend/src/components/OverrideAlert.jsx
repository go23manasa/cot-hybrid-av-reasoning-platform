export default function OverrideAlert({ decisions }) {
  if (!decisions || !decisions.override) return null;

  return (
    <div className="bg-red-900 border border-red-500 p-4 rounded-xl text-white">
      <p className="font-bold">⚠️ Rule Engine Override Applied</p>
      <p>
        Disagreement:{" "}
        <span className="font-bold">{decisions.disagreement_level}</span>
      </p>
      <p>
        LLM: {decisions.llm} → Rule: {decisions.rule}
      </p>
    </div>
  );
}