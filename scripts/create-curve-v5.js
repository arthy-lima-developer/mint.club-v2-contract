require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const signer = (await ethers.getSigners())[0];
  console.log("Using signer:", signer.address);

  const bond = await ethers.getContractAt(
    "MCV2_Bond",
    "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2",
    signer
  );

  // Reserve token (sDAI)
  const sDAI = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";

  // Token info
  const name = "ProposalToken";
  const symbol = "P001";

  // Curve parameters
  const maxSupply = ethers.BigNumber.from("1000"); // 1000 units
  const steps = 10;                                // number of steps
  const kWei = ethers.utils.parseEther("0.001"); // slope: 0.001 xDAI per token
  const fee = ethers.utils.parseEther("0.0007"); // creation fee

  // Build arrays
  const rangeSize = maxSupply.div(steps);
  const stepRanges = [];
  const stepPrices = [];
  for (let i = 1; i <= steps; i++) {
    const r = rangeSize.mul(i);
    stepRanges.push(r);
    const price = kWei.mul(r).div(ethers.constants.WeiPerEther);
    stepPrices.push(price);
  }

  console.log("Deploying curve with:", { name, symbol, maxSupply: maxSupply.toString(), steps });

  const tx = await bond.createToken(
    { name, symbol },
    {
      mintRoyalty: 0,
      burnRoyalty: 0,
      reserveToken: sDAI,
      maxSupply,
      stepRanges,
      stepPrices,
    },
    { value: fee }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  const evt = receipt.events.find(e => e.event === "TokenCreated");
  console.log("New token address:", evt.args.token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
