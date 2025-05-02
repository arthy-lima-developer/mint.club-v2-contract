require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const bond = await ethers.getContractAt(
    "MCV2_Bond",
    "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2"
  );
  const reserveToken = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";

  // Linear curve y = k * supply
  const maxSupply = 1000n;
  const steps     = 10n;
  const kWei      = ethers.parseEther("0.001"); // price slope (wei per token unit)
  const ONE_ETHER = ethers.parseEther("1");      // 1 Ether

  const rangeSize = maxSupply / steps;
  const stepRanges = [];
  const stepPrices = [];
  for (let i = 1n; i <= steps; i++) {
    const r = rangeSize * i;
    stepRanges.push(r);
    // price scaled back to uint128: (kWei * r) / 1e18
    stepPrices.push((kWei * r) / ONE_ETHER);
  }

  console.log("Creating ProposalToken (P001) curve...");
  const tx = await bond.createToken(
    { name: "ProposalToken", symbol: "P001" },
    {
      mintRoyalty: 0,
      burnRoyalty: 0,
      reserveToken,
      maxSupply,
      stepRanges,
      stepPrices
    },
    { value: ethers.parseEther("0.0007") }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  const events = receipt.events.filter(e => e.event === "TokenCreated");
  for (const ev of events) {
    console.log("Created token:", ev.args.token);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
