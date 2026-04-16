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
      setData(res.data);
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