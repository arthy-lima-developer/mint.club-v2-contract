require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const bondAddress = "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2";
  const sDai       = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";
  const name       = "ProposalToken";
  const symbol     = "P001";

  // Parameters
  const maxSupply = 1000;                                  // JS number
  const steps     = 10;                                    // segments
  const kWei      = ethers.utils.parseEther("0.001");    // BigNumber
  const ONE_ETH   = ethers.constants.WeiPerEther;         // BigNumber

  // Build curve arrays
  const stepRanges = [];
  const stepPrices = [];
  for (let i = 1; i <= steps; i++) {
    const r     = (maxSupply / steps) * i;
    const price = kWei.mul(r).div(ONE_ETH);
    stepRanges.push(r);
    stepPrices.push(price);
  }

  // Debug logs
  console.log("maxSupply:", maxSupply);
  console.log("stepRanges:", stepRanges);
  console.log("stepPrices:", stepPrices.map(p => p.toString()));

  // Create the curve token
  const bond = await ethers.getContractAt("MCV2_Bond", bondAddress);
  const tx   = await bond.createToken(
    { name, symbol },
    { mintRoyalty: 0, burnRoyalty: 0, reserveToken: sDai, maxSupply, stepRanges, stepPrices },
    { value: ethers.utils.parseEther("0.0007") }
  );

  console.log("tx hash:", tx.hash);
  const rec = await tx.wait();
  const ev  = rec.events.find(e => e.event === "TokenCreated");
  console.log("TokenCreated:", ev.args.token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
