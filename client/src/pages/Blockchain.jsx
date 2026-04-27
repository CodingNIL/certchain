import { useEffect, useState } from "react";
import { API } from "../api/api";

const Blockchain = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await API.get("/cert/blocks");
        setBlocks(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">

      <div className="glass w-full max-w-3xl p-6">

        <h1 className="text-2xl font-bold text-center text-blue-400 mb-8">
          Blockchain Ledger 🔗
        </h1>

        {blocks.length === 0 ? (
          <p className="text-center text-gray-400">
            No blocks in chain
          </p>
        ) : (
          <div className="flex flex-col gap-6">

            {blocks.map((block, index) => (
              <div key={index} className="relative">

                {/* connection line */}
                {index !== 0 && (
                  <div className="absolute left-5 -top-6 w-0.5 h-6 bg-blue-500" />
                )}

                {/* node dot */}
                <div className="absolute left-3 top-6 w-4 h-4 bg-blue-500 rounded-full shadow-lg" />

                {/* block card */}
                <div className="ml-10 glass p-4">

                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-bold text-blue-300">
                      Block #{index}
                    </h2>

                    <span className="text-xs text-gray-400">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs break-all space-y-2">

                    <p>
                      <span className="text-green-400">Hash:</span><br />
                      {block.hash}
                    </p>

                    <p>
                      <span className="text-yellow-400">Prev Hash:</span><br />
                      {block.previousHash}
                    </p>

                    {block.merkleRoot && (
                      <p>
                        <span className="text-purple-400">Merkle Root:</span><br />
                        {block.merkleRoot}
                      </p>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Blockchain;
