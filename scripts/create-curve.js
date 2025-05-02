require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  // Configuration
  const BOND_ADDRESS = '0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2';
  const SDAI_ADDRESS = '0xaf204776c7245bF4147c2612BF6e5972Ee483701';
  const NAME = 'ProposalToken';
  const SYMBOL = 'P001';

  // Simple linear curve: price = k * supply
  const MAX_SUPPLY = 1000n;       // total tokens (BigInt)
  const STEPS = 10n;             // number of steps (BigInt)
  const K_WEI = ethers.utils.parseEther('0.001');        // slope (0.001 xDAI)
  
  const rangeSize = MAX_SUPPLY / STEPS;
  const stepRanges = [];
  const stepPrices = [];
  const ONE_ETHER = ethers.constants.WeiPerEther;

  for (let i = 1n; i <= STEPS; i += 1n) {
    const range = rangeSize * i;
    stepRanges.push(range);
    // price = k * supply
    stepPrices.push((K_WEI * range) / ONE_ETHER);
  }

  const mintRoyalty = 0;     // 0%
  const burnRoyalty = 0;     // 0%
  const creationFee = ethers.utils.parseEther('0.0007');

  // Attach to deployed bond
  const bond = await ethers.getContractAt('MCV2_Bond', BOND_ADDRESS);

  // Create the curve clone
  console.log('Creating bond token...');
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

  console.log('Transaction hash:', tx.hash);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === 'TokenCreated');
  console.log('New token address:', event.args.token);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
