const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const {
  readContractFunction,
  writeContractFunction,
} = require("./helpers/contractInteractions");

const { getMerkleData } = require("./helpers/merkleTree");
const { verifySignature } = require("./helpers/helperFunctions");

// Secret key for JWT
const JWT_SECRET_KEY = process.env.JWT_ENV;

// Importing JWT Packages
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Authorization middleware to protect routes
app.use(
  expressJwt({
    secret: JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({ method: "POST", path: ["/login", "/"] })
);

// Error handling middleware for invalid tokens
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" });
  } else {
    next(err); // For other errors, pass them along
  }
});

// Default routes
app.get("/", (req, res) => {
  res.send("Welcome to choraClub!");
});

app.post("/login", async (req, res) => {
  try {
    console.log("Login Endpoint called");

    const { userAddress, signature } = req.body;

    if (!userAddress || !signature) {
      return res.status(400).json({
        error:
          "Invalid request: userAddress(String) and signature(String) in body",
      });
    }

    const payload = { userAddress, signature };
    const valid = await verifySignature(userAddress, signature);

    if (valid) {
      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
      return res.status(200).json({ token });
    }

    return res.status(401).json({ error: "Invalid signature" });
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/mint/:chainId", async (req, res) => {
  const chainId = Number(req.params.chainId);

  const { userAddress, signature } = req.body;
  console.log("network", chainId);

  const proof = [
    "0xc6a978a0f74976cd1e73310e6b5df1f6454f429d7f3a6e2de46439846b81c401",
  ];

  const mint = await writeContractFunction("safeMint", chainId, [
    userAddress,
    "tokenUrI",
    proof,
  ]);
  console.log(mint);
  res.json({ proof, mint });
});

app.post("/check/:userAddress", async (req, res) => {
  const { userAddress, signature } = req.params;
  //   const { proof, isMember } = await getMerkleData(userAddress);

  const mint = await readContractFunction("owner", "mumbai");
  console.log(mint);
  res.json({ mint });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
