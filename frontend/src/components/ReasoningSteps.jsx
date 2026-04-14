export default function ReasoningSteps({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex gap-3"
        >
          <div className="text-gray-400 font-bold">{index + 1}</div>
          <div>{step}</div>
        </div>
      ))}
    </div>
  );
}