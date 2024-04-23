const dotenv = require("dotenv");
const { createPublicClient, createWalletClient, http } = require("viem");
const chorachub_abi = require("../ChoraClub.json").abi;
const {
  polygonMumbai,
  arbitrumSepolia,
  optimismSepolia,
} = require("viem/chains");
const { privateKeyToAccount } = require("viem/accounts");
dotenv.config();

const networks = {
  80001: {
    chainName: polygonMumbai,
    url: http(process.env.RPC_URL_MUMBAI),
    contractAddress: process.env.CONTRACT_ADDRESS_MUMBAI,
  },
  11155420: {
    chainName: optimismSepolia,
    url: http(process.env.RPC_URL_OPTIMISM_SEPOLIA),
    contractAddress: process.env.CONTRACT_ADDRESS_OP_SEPOLIA,
  },
  421614: {
    chainName: arbitrumSepolia,
    url: http(process.env.RPC_URL_ARBITRUM_SEPOLIA),
    contractAddress: process.env.CONTRACT_ADDRESS_ARB_SEPOLIA,
  },
};

async function readContractFunction(functionName, network, args = null) {
  const client = createPublicClient({
    chain: networks[network]["chainName"],
    transport: networks[network]["url"],
  });

  try {
    const result = await client.readContract({
      address: networks[network]["contractAddress"],
      abi: chorachub_abi,
      functionName: functionName,
      ...(args ? { args: args } : {}),
    });

    return result;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}

async function writeContractFunction(functionName, network, args = null) {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY),
    chain: networks[network]["chainName"],
    transport: networks[network]["url"],
  });
  try {
    const request = await walletClient.writeContract({
      address: networks[network]["contractAddress"],
      abi: chorachub_abi,
      functionName: functionName,
      ...(args ? { args: args } : {}),
    });
    console.log(request);
    return request;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
//   ...(args ? { args: args } : {}),

// async function example() {
//   try {
//     const result = await writeContractFunction("setMerkleRoot", [
//       "0x2d0233393a8c6ed12d0ab075c1d5b5732f76e114b64d35dbd7ae3984954b84b3",
//     ]);
//     console.log("Write contract function result:", result);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // Call the example function to execute the code
// example();
module.exports = {
  readContractFunction,
  writeContractFunction,
};
