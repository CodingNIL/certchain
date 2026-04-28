import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { API } from "../api/api";

const Scanner = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let scanner;
    let isProcessing = false; // ✅ prevents multiple scans

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("reader");

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            if (isProcessing) return; // ✅ block duplicate scans
            isProcessing = true;

            try {
              setError("");
              setResult(null);

              // ✅ safer: QR should directly contain ID
              const id = decodedText.split("/").pop();

              const res = await API.get(`/cert/verify/${id}`);

              setResult(res.data);

              await scanner.stop();
            } catch (err) {
              console.error(err);
              setResult(null);
              setError("Verification failed");
            } finally {
              isProcessing = false;
            }
          }
        );

        setStarted(true);
      } catch (err) {
        console.error(err);
        setError("Camera not supported or permission denied");
      }
    };

    const timer = setTimeout(startScanner, 500);

    return () => {
      clearTimeout(timer);

      if (scanner) {
        scanner.stop().catch(() => {});
        scanner.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">

      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md text-center shadow-lg">

        <h1 className="text-xl font-bold mb-4">
          QR Scanner 📱
        </h1>

        {/* Scanner box */}
        <div
          id="reader"
          className="rounded-lg overflow-hidden bg-black"
          style={{ minHeight: "250px" }}
        />

        {/* Status */}
        {!started && !error && (
          <p className="mt-3 text-gray-400">Starting camera...</p>
        )}

        {error && (
          <p className="mt-3 text-red-400">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-4">

            <h2 className={`text-lg ${
              result.valid ? "text-green-400" : "text-red-400"
            }`}>
              {result.valid
                ? "✅ Valid Certificate"
                : "❌ Invalid Certificate"}
            </h2>

            {result.valid && result.certificate && (
              <div className="text-sm mt-2">
                <p>{result.certificate.studentName}</p>
                <p>{result.certificate.course}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Scanner;
