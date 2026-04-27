import { useState } from "react";
import { API } from "../api/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Select a file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentName", studentName);
      formData.append("course", course);

      const res = await API.post("/cert/upload", formData);

      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload Certificate 🚀
        </h1>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="p-3 rounded bg-gray-700"
          />

          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="p-3 rounded bg-gray-700"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="bg-blue-600 p-3 rounded">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center">

            <h2 className="text-green-400">✅ Success</h2>

            <p className="text-sm break-all">
              ID: {result.certificate._id}
            </p>

            <img
              src={result.qrCode}
              alt="QR"
              className="mx-auto w-40 h-40 my-3"
            />

            <a
              href={result.verifyUrl}
              target="_blank"
              className="text-blue-400 underline"
            >
              Verify Link
            </a>

          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
