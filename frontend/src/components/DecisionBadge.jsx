export default function DecisionBadge({ decision }) {
  if (!decision) return null;

  const styles = {
    STOP: "bg-red-600 text-white",
    "SLOW DOWN": "bg-yellow-500 text-black",
    CONTINUE: "bg-green-600 text-white",
  };

  return (
    <div className={`text-center py-4 rounded-xl text-2xl font-bold ${styles[decision]}`}>
      {decision}
    </div>
  );
}