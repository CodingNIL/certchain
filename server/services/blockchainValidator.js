const Block = require("../models/Block");
const { generateHash } = require("./hashService");

const validateChain = async () => {
  const blocks = await Block.find().sort({ timestamp: 1 });

  if (blocks.length === 0) {
    return {
      valid: true,
      message: "No blocks in chain"
    };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // 🔐 recompute hash
    const recalculatedHash = generateHash(
      JSON.stringify(block.data) + block.previousHash
    );

    // ❌ check tampering
    if (block.hash !== recalculatedHash) {
      return {
        valid: false,
        message: `Tampering detected at block ${i}`,
        error: "Hash mismatch"
      };
    }

    // 🔗 check chain link
    if (i > 0) {
      const prevBlock = blocks[i - 1];

      if (block.previousHash !== prevBlock.hash) {
        return {
          valid: false,
          message: `Chain broken at block ${i}`,
          error: "PreviousHash mismatch"
        };
      }
    }
  }

  return {
    valid: true,
    message: "Blockchain is intact ✅",
    blocksChecked: blocks.length
  };
};

module.exports = { validateChain };
