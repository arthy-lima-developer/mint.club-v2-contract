require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  // Attach to MCV2_Bond
  const bond = await ethers.getContractAt(
    "MCV2_Bond",
    "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2"
  );

  const sDAI = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";

  // Linear curve: max 1000 tokens in 10 equal steps
  const stepRanges = Array.from({ length: 10 }, (_, i) => 100 * (i + 1));
  const stepPrices = stepRanges.map(r =>
    ethers.utils.parseEther((0.001 * r).toString())
  );

  console.log("stepRanges:", stepRanges);
  console.log("stepPrices (wei):", stepPrices.map(p => p.toString()));

  // Create token: ProposalToken (P001)
  const tx = await bond.createToken(
    { name: "ProposalToken", symbol: "P001" },
    {
      mintRoyalty: 0,
      burnRoyalty: 0,
      reserveToken: sDAI,
      maxSupply: 1000,
      stepRanges,
      stepPrices
    },
    { value: ethers.utils.parseEther("0.0007") }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log(
    "New token address:",
    receipt.events.find(e => e.event === "TokenCreated").args.token
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
