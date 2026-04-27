const { generateHash } = require("./hashService");

const getMerkleRoot = (hashes) => {
  if (hashes.length === 0) return null;

  let level = hashes;

  while (level.length > 1) {
    const nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        const combined = level[i] + level[i + 1];
        nextLevel.push(generateHash(combined));
      } else {
        const combined = level[i] + level[i];
        nextLevel.push(generateHash(combined));
      }
    }

    level = nextLevel;
  }

  return level[0];
};

module.exports = { getMerkleRoot };
