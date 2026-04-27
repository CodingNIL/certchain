const { generateHash } = require("./hashService");

// 🌳 MERKLE ROOT
const getMerkleRoot = (hashes) => {
  if (hashes.length === 0) return null;

  let level = hashes;

  while (level.length > 1) {
    const nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : left;

      nextLevel.push(generateHash(left + right));
    }

    level = nextLevel;
  }

  return level[0];
};

// 🌳 MERKLE PROOF
const getMerkleProof = (hashes, targetHash) => {
  let index = hashes.indexOf(targetHash);
  if (index === -1) return null;

  let proof = [];
  let level = hashes;

  while (level.length > 1) {
    let nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      let left = level[i];
      let right = i + 1 < level.length ? level[i + 1] : left;

      const combined = generateHash(left + right);
      nextLevel.push(combined);

      if (i === index || i + 1 === index) {
        if (i === index) {
          proof.push({ position: "right", hash: right });
        } else {
          proof.push({ position: "left", hash: left });
        }
        index = Math.floor(i / 2);
      }
    }

    level = nextLevel;
  }

  return proof;
};

// 🔐 VERIFY PROOF
const verifyMerkleProof = (targetHash, proof, root) => {
  let hash = targetHash;

  for (let step of proof) {
    if (step.position === "left") {
      hash = generateHash(step.hash + hash);
    } else {
      hash = generateHash(hash + step.hash);
    }
  }

  return hash === root;
};

module.exports = {
  getMerkleRoot,
  getMerkleProof,
  verifyMerkleProof
};
