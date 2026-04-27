import { useState } from "react";
import { API } from "../api/api";

const Merkle = () => {
  const [certId, setCertId] = useState("");
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);

  const handleFetchProof = async () => {
    if (!certId) return alert("Enter certificate ID");

    try {
      const res = await API.get(`/cert/merkle-proof/${certId}`);
      setData(res.data);
      setResult(null);
    } catch (err) {
      alert("Error fetching proof");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await API.post("/cert/verify-proof", data);
      setResult(res.data);
    } catch (err) {
      alert("Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">

      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl shadow-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Merkle Proof Verification 🌳
        </h1>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-700"
          />

          <button
            onClick={handleFetchProof}
            className="bg-blue-600 px-4 rounded"
          >
            Get Proof
          </button>
        </div>

        {data && (
          <div className="mt-4">

            <p className="text-sm break-all mb-2">
              <span className="text-blue-400">Cert Hash:</span> {data.certHash}
            </p>

            <p className="text-sm break-all mb-4">
              <span className="text-green-400">Merkle Root:</span> {data.merkleRoot}
            </p>

            <h2 className="mb-2 text-yellow-400">Proof Steps:</h2>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {data.proof.map((p, i) => (
                <div key={i} className="bg-gray-700 p-2 rounded text-xs break-all">
                  {p.position} → {p.hash}
                </div>
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="bg-green-600 mt-4 w-full p-3 rounded"
            >
              Verify Proof
            </button>

          </div>
        )}

        {result && (
          <div className="mt-4 text-center">

            <h2 className={`text-lg ${
              result.valid ? "text-green-400" : "text-red-400"
            }`}>
              {result.valid ? "✅ Proof Valid" : "❌ Proof Invalid"}
            </h2>

          </div>
        )}

      </div>
    </div>
  );
};

export default Merkle;
