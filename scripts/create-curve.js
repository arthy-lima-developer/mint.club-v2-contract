require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
  // Configuration
  const BOND_ADDRESS = '0x9E0f711867Be35EfBE3B2f76ad617e88F32948e2';
  const SDAI_ADDRESS = '0xaf204776c7245bF4147c2612BF6e5972Ee483701';
  const WXDAI_ADDRESS = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'; // WXDAI on Gnosis
  const NAME = 'TEST3';
  const SYMBOL = 'TEST3';

  // Provider & Wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_GNOSIS);
  const wallet = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY, provider);

  // Check xDAI (native token) balance
  const xDaiBalance = await provider.getBalance(wallet.address);
  console.log('xDAI (native) balance:', ethers.formatUnits(xDaiBalance, 18));
  // Optional: Add a check if xDaiBalance is sufficient for gas
  // if (xDaiBalance < ethers.parseUnits('0.01', 18)) { // Example threshold
  //   throw new Error('Insufficient xDAI balance for gas.');
  // }

  // ERC20 ABI - Only needed if interacting with sDAI later, keep for reference
  // const erc20Abi = [
  //   "function balanceOf(address) view returns (uint256)",
  //   "function allowance(address,address) view returns (uint256)",
  //   "function approve(address,uint256) returns (bool)"
  // ];
  // const sDai = new ethers.Contract(SDAI_ADDRESS, erc20Abi, wallet);

  // Simple linear curve: price = k * supply
  const MAX_SUPPLY = ethers.parseUnits('1000', 18); // 1000 tokens
  const stepRanges = [MAX_SUPPLY];
  const stepPrices = [ethers.parseUnits('0.001', 18)]; // 0.001 sDAI per token
  const mintRoyalty = 0; // 0%
  const burnRoyalty = 0; // 0%

  // --- Use Full Contract ABI --- 
  const fullBondAbi = [{"inputs":[{"internalType":"address","name":"tokenImplementation","type":"address"},{"internalType":"address","name":"multiTokenImplementation","type":"address"},{"internalType":"address","name":"protocolBeneficiary_","type":"address"},{"internalType":"uint256","name":"creationFee_","type":"uint256"},{"internalType":"uint256","name":"maxSteps","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[],"name":"ERC1167FailedCreateClone","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[],"name":"MCV2_BOND__InvalidPaginationParameters","type":"error"},{"inputs":[],"name":"MCV2_Bond__CreationFeeTransactionFailed","type":"error"},{"inputs":[],"name":"MCV2_Bond__ExceedMaxSupply","type":"error"},{"inputs":[],"name":"MCV2_Bond__ExceedTotalSupply","type":"error"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"MCV2_Bond__InvalidConstructorParams","type":"error"},{"inputs":[],"name":"MCV2_Bond__InvalidCreationFee","type":"error"},{"inputs":[],"name":"MCV2_Bond__InvalidCreatorAddress","type":"error"},{"inputs":[],"name":"MCV2_Bond__InvalidCurrentSupply","type":"error"},{"inputs":[],"name":"MCV2_Bond__InvalidReceiver","type":"error"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"MCV2_Bond__InvalidReserveToken","type":"error"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"MCV2_Bond__InvalidStepParams","type":"error"},{"inputs":[],"name":"MCV2_Bond__InvalidTokenAmount","type":"error"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"MCV2_Bond__InvalidTokenCreationParams","type":"error"},{"inputs":[],"name":"MCV2_Bond__PermissionDenied","type":"error"},{"inputs":[],"name":"MCV2_Bond__SlippageLimitExceeded","type":"error"},{"inputs":[],"name":"MCV2_Bond__TokenNotFound","type":"error"},{"inputs":[],"name":"MCV2_Bond__TokenSymbolAlreadyExists","type":"error"},{"inputs":[],"name":"MCV2_Royalty__InvalidParams","type":"error"},{"inputs":[],"name":"MCV2_Royalty__NothingToClaim","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"uint8","name":"bits","type":"uint8"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeCastOverflowedUintDowncast","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"creator","type":"address"}],"name":"BondCreatorUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountBurned","type":"uint256"},{"indexed":true,"internalType":"address","name":"reserveToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"refundAmount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CreationFeeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountMinted","type":"uint256"},{"indexed":true,"internalType":"address","name":"reserveToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"reserveAmount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":false,"internalType":"string","name":"uri","type":"string"},{"indexed":true,"internalType":"address","name":"reserveToken","type":"address"}],"name":"MultiTokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"protocolBeneficiary","type":"address"}],"name":"ProtocolBeneficiaryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"reserveToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RoyaltyClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"ratio","type":"uint256"}],"name":"RoyaltyRangeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"symbol","type":"string"},{"indexed":true,"internalType":"address","name":"reserveToken","type":"address"}],"name":"TokenCreated","type":"event"},{"inputs":[],"name":"BURN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokensToBurn","type":"uint256"},{"internalType":"uint256","name":"minRefund","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reserveToken","type":"address"}],"name":"burnRoyalties","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"reserveToken","type":"address"}],"name":"claimRoyalties","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"uri","type":"string"}],"internalType":"struct MCV2_Bond.MultiTokenParams","name":"tp","type":"tuple"},{"components":[{"internalType":"uint16","name":"mintRoyalty","type":"uint16"},{"internalType":"uint16","name":"burnRoyalty","type":"uint16"},{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint128","name":"maxSupply","type":"uint128"},{"internalType":"uint128[]","name":"stepRanges","type":"uint128[]"},{"internalType":"uint128[]","name":"stepPrices","type":"uint128[]"}],"internalType":"struct MCV2_Bond.BondParams","name":"bp","type":"tuple"}],"name":"createMultiToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"internalType":"struct MCV2_Bond.TokenParams","name":"tp","type":"tuple"},{"components":[{"internalType":"uint16","name":"mintRoyalty","type":"uint16"},{"internalType":"uint16","name":"burnRoyalty","type":"uint16"},{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint128","name":"maxSupply","type":"uint128"},{"internalType":"uint128[]","name":"stepRanges","type":"uint128[]"},{"internalType":"uint128[]","name":"stepPrices","type":"uint128[]"}],"internalType":"struct MCV2_Bond.BondParams","name":"bp","type":"tuple"}],"name":"createToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"creationFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getDetail","outputs":[{"components":[{"internalType":"uint16","name":"mintRoyalty","type":"uint16"},{"internalType":"uint16","name":"burnRoyalty","type":"uint16"},{"components":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint40","name":"createdAt","type":"uint40"},{"internalType":"uint128","name":"currentSupply","type":"uint128"},{"internalType":"uint128","name":"maxSupply","type":"uint128"},{"internalType":"uint128","name":"priceForNextMint","type":"uint128"},{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint8","name":"reserveDecimals","type":"uint8"},{"internalType":"string","name":"reserveSymbol","type":"string"},{"internalType":"string","name":"reserveName","type":"string"},{"internalType":"uint256","name":"reserveBalance","type":"uint256"}],"internalType":"struct MCV2_Bond.BondInfo","name":"info","type":"tuple"},{"components":[{"internalType":"uint128","name":"rangeTo","type":"uint128"},{"internalType":"uint128","name":"price","type":"uint128"}],"internalType":"struct MCV2_Bond.BondStep[]","name":"steps","type":"tuple[]"}],"internalType":"struct MCV2_Bond.BondDetail","name":"detail","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"stop","type":"uint256"}],"name":"getList","outputs":[{"components":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint40","name":"createdAt","type":"uint40"},{"internalType":"uint128","name":"currentSupply","type":"uint128"},{"internalType":"uint128","name":"maxSupply","type":"uint128"},{"internalType":"uint128","name":"priceForNextMint","type":"uint128"},{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint8","name":"reserveDecimals","type":"uint8"},{"internalType":"string","name":"reserveSymbol","type":"string"},{"internalType":"string","name":"reserveName","type":"string"},{"internalType":"uint256","name":"reserveBalance","type":"uint256"}],"internalType":"struct MCV2_Bond.BondInfo[]","name":"info","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokensToBurn","type":"uint256"}],"name":"getRefundForTokens","outputs":[{"internalType":"uint256","name":"refundAmount","type":"uint256"},{"internalType":"uint256","name":"royalty","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokensToMint","type":"uint256"}],"name":"getReserveForToken","outputs":[{"internalType":"uint256","name":"reserveAmount","type":"uint256"},{"internalType":"uint256","name":"royalty","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"reserveToken","type":"address"}],"name":"getRoyaltyInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"getSteps","outputs":[{"components":[{"internalType":"uint128","name":"rangeTo","type":"uint128"},{"internalType":"uint128","name":"price","type":"uint128"}],"internalType":"struct MCV2_Bond.BondStep[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"stop","type":"uint256"}],"name":"getTokensByCreator","outputs":[{"internalType":"address[]","name":"addresses","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"stop","type":"uint256"}],"name":"getTokensByReserveToken","outputs":[{"internalType":"address[]","name":"addresses","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxRoyaltyRange","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"maxSupply","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokensToMint","type":"uint256"},{"internalType":"uint256","name":"maxReserveAmount","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"priceForNextMint","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolBeneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenBond","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint16","name":"mintRoyalty","type":"uint16"},{"internalType":"uint16","name":"burnRoyalty","type":"uint16"},{"internalType":"uint40","name":"createdAt","type":"uint40"},{"internalType":"address","name":"reserveToken","type":"address"},{"internalType":"uint256","name":"reserveBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"creator","type":"address"}],"name":"updateBondCreator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"updateCreationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ratio","type":"uint256"}],"name":"updateMaxRoyaltyRange","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"protocolBeneficiary_","type":"address"}],"name":"updateProtocolBeneficiary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"userTokenRoyaltyBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"userTokenRoyaltyClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];
  
  const bond = new ethers.Contract(BOND_ADDRESS, fullBondAbi, wallet);

  // Restore tp and bp objects for tuple call
  const tp = { name: NAME, symbol: SYMBOL }; // NOTE: uri is NOT part of TokenParams in the ABI
  const bp = {
    mintRoyalty,
    burnRoyalty,
    reserveToken: WXDAI_ADDRESS, // Use WXDAI
    maxSupply: MAX_SUPPLY,
    stepRanges,
    stepPrices
  };

  console.log('--- Parameters for createToken ---');
  console.log('Token Params (tp):', JSON.stringify(tp, null, 2));
  console.log('Bond Params (bp):', JSON.stringify({
    ...bp,
    maxSupply: bp.maxSupply.toString(), // Convert BigInts for logging
    stepRanges: bp.stepRanges.map(r => r.toString()),
    stepPrices: bp.stepPrices.map(p => p.toString())
  }, null, 2));
  console.log('---------------------------------');

  console.log('Creating bond token (only creation)...');
  try {
    // Fetch the required creation fee
    const requiredFee = await bond.creationFee();
    console.log(`Required creation fee (xDAI): ${ethers.formatEther(requiredFee)}`);

    // Call createToken with tuple arguments AND the required fee
    const tx = await bond.createToken(tp, bp, {
      value: requiredFee, // Send the creation fee
      gasLimit: 1000000 // Keep manual gas limit for now
    });
    console.log('Tx sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Tx mined:', receipt.hash);

    // Extract the created token address from the TokenCreated event log
    let createdTokenAddress = null;
    const eventSignature = 'TokenCreated(address,address,string,string,address)';
    const eventTopic = bond.interface.getEvent('TokenCreated').topicHash;

    for (const log of receipt.logs) {
      // Check if the log topic matches the TokenCreated event topic
      if (log.topics[0] === eventTopic && log.address === BOND_ADDRESS) {
        try {
          const parsedLog = bond.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'TokenCreated') {
            createdTokenAddress = parsedLog.args.token; // First indexed arg
            break; // Found the event, exit loop
          }
        } catch (parseError) {
          console.warn('Could not parse log:', parseError);
        }
      }
    }

    if (createdTokenAddress) {
      console.log(' Token created successfully!');
      console.log('   Token Address:', createdTokenAddress);
      console.log(`   GnosisScan: https://gnosisscan.io/token/${createdTokenAddress}`);
    } else {
      console.log(' Transaction succeeded, but could not find TokenCreated event log in the receipt.');
    }

  } catch (err) {
    console.error('Error in createToken:', err);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
