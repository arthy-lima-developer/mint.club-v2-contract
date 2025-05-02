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
  const maxSupply = ethers.utils.parseUnits("1000", 0);  // 1000 tokens no decimals
  const steps     = 10;                                  // 10 segments
  const kWei      = ethers.utils.parseEther("0.001");   // slope k = 0.001 xDAI per token
  const ONE_ETHER = ethers.constants.WeiPerEther;

  // Build step arrays
  const rangeSize = maxSupply.div(steps);
  const stepRanges = [];
  const stepPrices = [];
  for (let i = 1; i <= steps; i++) {
    const r = rangeSize.mul(i);
    stepRanges.push(r);
    // price = kWei * r / 1e18
    stepPrices.push(kWei.mul(r).div(ONE_ETHER));
  }

  const mintRoyalty = 0;     // 0%
  const burnRoyalty = 0;     // 0%
  const creationFee = ethers.utils.parseEther("0.0007");

  console.log("Creating ProposalToken (P001) curve...");
  const tx = await bond.createToken(
    { name: "ProposalToken", symbol: "P001" },
    {
      mintRoyalty,
      burnRoyalty,
      reserveToken,
      maxSupply,
      stepRanges,
      stepPrices
    },
    { value: creationFee }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === "TokenCreated");
  console.log("New token address:", event.args.token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
