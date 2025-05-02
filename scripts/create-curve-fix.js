require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Configuration
  const BOND_ADDRESS = "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2";
  const SDAI_ADDRESS = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";
  const NAME = "ProposalToken";
  const SYMBOL = "P001";

  // Curve parameters (linear y=kx)
  const MAX_SUPPLY = 1000n;
  const STEPS = 10n;
  const K_WEI = ethers.parseEther("0.001");
  const ONE_ETHER = ethers.parseEther("1");

  const rangeSize = MAX_SUPPLY / STEPS;
  const stepRanges = [];
  const stepPrices = [];

  for (let i = 1n; i <= STEPS; i++) {
    const range = rangeSize * i;
    stepRanges.push(range);
    stepPrices.push((K_WEI * range) / ONE_ETHER);
  }

  const mintRoyalty = 0;
  const burnRoyalty = 0;
  const creationFee = ethers.parseEther("0.0007");

  // Attach to deployed bond contract
  const bond = await ethers.getContractAt("MCV2_Bond", BOND_ADDRESS);

  console.log("Creating bond token...");
  const tx = await bond.createToken(
    { name: NAME, symbol: SYMBOL },
    {
      mintRoyalty,
      burnRoyalty,
      reserveToken: SDAI_ADDRESS,
      maxSupply: MAX_SUPPLY,
      stepRanges,
      stepPrices,
    },
    { value: creationFee }
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  const event = receipt.events.find((e) => e.event === "TokenCreated");
  console.log("New token address:", event.args.token);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
