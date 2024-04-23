const fs = require("fs");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const ownerAddresses = require("../ownerAddresses.json");
const leafNodes = ownerAddresses.map((addr) => keccak256(addr));

// Create a Merkle tree
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortLeaves: true,
  sortPairs: true,
});
// Get the Merkle root
const merkleRoot = merkleTree.getRoot().toString("hex");
console.log("Merkle Root:", merkleRoot);

async function getMerkleData(address) {
  const hexProof = merkleTree.getHexProof(keccak256(address));
  console.log(merkleTree.verify(hexProof, keccak256(address), merkleRoot));
  return {
    proof: hexProof,
    isMember: merkleTree.verify(hexProof, keccak256(address), merkleRoot),
  };
}

module.exports = {
  getMerkleData,
};
