import { useEffect, useState } from "react";
import { API } from "../api/api";

const Blockchain = () => {

  const [blocks, setBlocks] = useState([]);

  useEffect(() => {

    const fetchBlocks = async () => {

      try {

        const res = await API.get("/cert/blocks");

        setBlocks(res.data);

      } catch (err) {

        console.log(err);

      }
    };

    fetchBlocks();

  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Blockchain Explorer ⛓️
      </h1>

      <div className="max-w-5xl mx-auto">

        {blocks.length === 0 ? (

          <p className="text-center text-gray-400">
            No blocks found
          </p>

        ) : (

          blocks.map((block, index) => (

            <div
              key={block._id}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 border border-gray-700"
            >

              {/* BLOCK TITLE */}
              <h2 className="text-2xl font-bold text-white mb-4">
                Block #{index}
              </h2>

              {/* TIMESTAMP */}
              <p className="text-gray-400 mb-6">
                {new Date(block.timestamp).toLocaleString()}
              </p>

              {/* HASH */}
              <div className="mb-5">

                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Hash
                </h3>

                <p className="text-green-400 break-all text-sm">
                  {block.hash}
                </p>

              </div>

              {/* PREVIOUS HASH */}
              <div className="mb-5">

                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Previous Hash
                </h3>

                <p className="text-yellow-400 break-all text-sm">
                  {block.previousHash}
                </p>

              </div>

              {/* MERKLE ROOT */}
              {block.merkleRoot && (

                <div>

                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                    Merkle Root
                  </h3>

                  <p className="text-blue-400 break-all text-sm">
                    {block.merkleRoot}
                  </p>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Blockchain;
