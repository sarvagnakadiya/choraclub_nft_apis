const { verifyTypedData } = require("viem");
const welcomeMessage = `Welcome to ChoraClub!
            Click to sign in and accept the ChoraClub Terms of Service (https://ChoraClub.io/tos) and Privacy Policy (https://ChoraClub.io/privacy).
            This request will not trigger a blockchain transaction or cost any gas fees.

            URL: https://ChoraClub.io
            `;
async function verifySignature(userAddress, signature) {
  const valid = await verifyTypedData({
    address: userAddress,
    domain: {
      name: "ChoraClub",
      version: "1",
    },
    types: {
      Login: [
        { name: "Message", type: "string" },
        { name: "from", type: "address" },
      ],
    },
    primaryType: "Login",
    message: {
      from: userAddress,
      Message: welcomeMessage,
    },
    signature: signature,
  });
  console.log(valid);
  return valid;
}
// verifySignature(
//   "0x97861976283e6901b407d1e217b72c4007d9f64d",
//   80001,
//   "0x04b29a4dfeed0edaf820f576bab855396d2588f16138cfadbc4389c005214d1e0c6c621621460fa68d8854c33000aefa7c4f5082e613919c96d12ba9edc3116d1b"
// );
module.exports = {
  verifySignature,
};
