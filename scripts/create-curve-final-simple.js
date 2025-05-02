require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const bondAddress   = "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2";
  const reserveToken  = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";
  const name          = "ProposalToken";
  const symbol        = "P001";

  // Precomputed values (strings)
  const maxSupply    = "1000";                   // 1000 units total
  const steps        = 10;                         // 10 segments
  const priceFactor  = "1000000000000000";       // 0.001 ETH == 1e15 Wei per token unit
  const creationFee  = "700000000000000";        // 0.0007 ETH == 7e14 Wei

  // Build stepRanges ["100","200",...]
  const stepRanges = Array.from({ length: steps }, (_, i) => ((i + 1) * 100).toString());
  // Build stepPrices by BigInt multiplication
  const stepPrices = stepRanges.map(r => {
    const units = BigInt(r);
    return (units * BigInt(priceFactor)).toString();
  });

  console.log("stepRanges:", stepRanges);
  console.log("stepPrices:", stepPrices);

  const bond = await ethers.getContractAt("MCV2_Bond", bondAddress, deployer);
  const tx = await bond.createToken(
    { name, symbol },
    {
      mintRoyalty: 0,
      burnRoyalty: 0,
      reserveToken,
      maxSupply,
      stepRanges,
      stepPrices
    },
    { value: creationFee }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log(
    "New token address:",
    receipt.events.find(e => e.event === "TokenCreated").args.token
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
