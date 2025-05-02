require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  const bondAddress = "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2";
  const reserveToken = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";
  const name = "ProposalToken";
  const symbol = "P001";

  // Curve parameters
  const maxSupply = ethers.BigNumber.from("1000");  // 1000 units
  const steps     = 10;                              // 10 segments
  const kWei      = ethers.utils.parseEther("0.001");
  const ONE       = ethers.constants.WeiPerEther;

  console.log({ maxSupply: maxSupply.toString(), steps });

  const rangeSize = maxSupply.div(steps);
  console.log("rangeSize:", rangeSize.toString());

  const stepRanges = [];
  const stepPrices = [];
  for (let i = 1; i <= steps; i++) {
    const r = rangeSize.mul(i);
    const price = kWei.mul(r).div(ONE);
    console.log(`step ${i}: range=${r.toString()}, price=${price.toString()}`);
    stepRanges.push(r);
    stepPrices.push(price);
  }

  console.log("Creating ProposalToken (P001) curve...");
  const bond = await ethers.getContractAt("MCV2_Bond", bondAddress);
  const tx = await bond.createToken(
    { name, symbol },
    { mintRoyalty: 0, burnRoyalty: 0, reserveToken, maxSupply, stepRanges, stepPrices },
    { value: ethers.utils.parseEther("0.0007") }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction mined:", receipt.transactionHash);

  const event = receipt.events.find(e => e.event === "TokenCreated");
  console.log("New token address:", event.args.token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
