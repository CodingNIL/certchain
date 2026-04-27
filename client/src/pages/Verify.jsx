import { useState } from "react";
import { API } from "../api/api";

const Verify = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!file) return alert("Select file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/cert/verify", formData);

      setResult(res.data);
    } catch (err) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">

      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Verify Certificate 🔍
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-2"
          />

          <button
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-green-700 p-3 rounded font-semibold"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {result && (
          <div className="mt-6 text-center">

            <h2 className={`text-lg font-semibold ${
              result.valid ? "text-green-400" : "text-red-400"
            }`}>
              {result.valid ? "✅ Certificate Valid" : "❌ Invalid Certificate"}
            </h2>

            {result.certificate && (
              <div className="mt-3 text-sm text-gray-300">
                <p><strong>Name:</strong> {result.certificate.studentName}</p>
                <p><strong>Course:</strong> {result.certificate.course}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Verify;
