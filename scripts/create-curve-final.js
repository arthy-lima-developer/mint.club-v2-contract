require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;
const { BigNumber } = require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying curve with account:", deployer.address);

  const BOND_ADDRESS = "0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2";
  const SDAI_ADDRESS = "0xaf204776c7245bF4147c2612BF6e5972Ee483701";
  const NAME = "ProposalToken";
  const SYMBOL = "P001";

  const MAX_SUPPLY = BigNumber.from("1000");
  const STEPS = 10;
  const K_WEI = ethers.utils.parseEther("0.001");
  const rangeSize = MAX_SUPPLY.div(STEPS);
  const stepRanges = [];
  const stepPrices = [];

  for (let i = 1; i <= STEPS; i++) {
    const range = rangeSize.mul(i);
    stepRanges.push(range);
    const price = K_WEI.mul(range).div(ethers.constants.WeiPerEther);
    stepPrices.push(price);
  }

  const mintRoyalty = 0;
  const burnRoyalty = 0;
  const creationFee = ethers.utils.parseEther("0.0007");

  const bond = await ethers.getContractAt("MCV2_Bond", BOND_ADDRESS);

  console.log("Sending createToken tx...");
  const tx = await bond.createToken(
    { name: NAME, symbol: SYMBOL },
    {
      mintRoyalty,
      burnRoyalty,
      reserveToken: SDAI_ADDRESS,
      maxSupply: MAX_SUPPLY,
      stepRanges,
      stepPrices
    },
    { value: creationFee }
  );

  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === "TokenCreated");
  console.log("TokenCreated event:", event.args);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
