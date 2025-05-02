require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("hardhat-interface-generator");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          // NOTE: PUSH0 opcode is not supported on some L2s
          // - Reference: https://hardhat.org/hardhat-runner/docs/config#default-evm-version
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 50000,
          },
        },
      },
      {
        version: "0.4.18", // For WETH mock contract
      },
      {
        version: "0.5.17", // For WDEGEN mock contract
        evmVersion: "istanbul",
        optimizer: {
          enabled: true,
          runs: 50000,
        },
      },
    ],
  },
  mocha: {
    timeout: 12000 * 1000, // test timeout: 2 minutes
  },
  networks: {
    hardhat: {},
    gnosis: {
      url: process.env.RPC_GNOSIS,
      chainId: 100,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 15,
    coinmarketcap: null, // process.env.COIN_MARKET_CAP_API
  },
  sourcify: {
    enabled: false,
  },
  etherscan: {
    // network list: npx hardhat verify --list-networks
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY,
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      blast: process.env.BLASTSCAN_API_KEY,
      avalanche: "unnecessary",
      degen: "TODO:",
      zora: "TODO:",
      klaytn: "unnecessary",
      cyber: "unnecessary",
      ham: "unnecessary",
      apechain: process.env.APESCAN_API_KEY,
      gnosis: process.env.GNOSISSCAN_API_KEY,
      shibarium: "TODO:",
      hashkey: "unnecessary",
      unichain: process.env.UNICHAINSCAN_API_KEY,

      sepolia: process.env.ETHERSCAN_API_KEY,
      baseSepolia: process.env.BASESCAN_API_KEY,
      blastSepolia: "unnecessary",
      avalancheFujiTestnet: "unnecessary",
      cyberTestnet: "unnecessary",
      overTestnet: "unnecessary",
      shibarium: "unnecessary",
      puppynet: "unnecessary",
    },
    customChains: [
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/81457/etherscan",
          browserURL: "https://blastexplorer.io",
        },
      },
      {
        network: "degen",
        chainId: 666666666,
        urls: {
          apiURL: "https://explorer.degen.tips/api/v2/TODO:", // TODO: API verification?
          browserURL: "https://explorer.degen.tips",
        },
      },
      {
        network: "zora",
        chainId: 7777777,
        urls: {
          apiURL: "https://explorer.zora.energy/api/v2/TODO:", // TODO: API verification?
          browserURL: "https://explorer.zora.energy",
        },
      },
      {
        network: "klaytn",
        chainId: 8217,
        urls: {
          apiURL: "https://api-cypress.klaytnscope.com/api",
          browserURL: "https://klaytnscope.com",
        },
      },
      {
        network: "cyber",
        chainId: 7560,
        urls: {
          apiURL: "https://cyberscan.co/api",
          browserURL: "https://cyberscan.co/",
        },
      },
      {
        network: "ham",
        chainId: 5112,
        urls: {
          apiURL: "https://ham.calderaexplorer.xyz/api/v2/TODO:", // TODO: API verification?
          browserURL: "https://ham.calderaexplorer.xyz",
        },
      },
      {
        network: "apechain",
        chainId: 33139,
        urls: {
          apiURL: "https://api.apescan.io/api",
          browserURL: "https://apescan.io/",
        },
      },
      {
        network: "shibarium",
        chainId: 109,
        urls: {
          apiURL: "https://www.shibariumscan.io/api", // TODO: API verification?
          browserURL: "https://www.shibariumscan.io/",
        },
      },
      {
        network: "hashkey",
        chainId: 177,
        urls: {
          apiURL: "https://explorer.hsk.xyz/api",
          browserURL: "https://explorer.hsk.xyz",
        },
      },
      {
        network: "unichain",
        chainId: 130,
        urls: {
          apiURL: "https://api.uniscan.xyz/api",
          browserURL: "https://uniscan.xyz",
        },
      },
      {
        network: "over",
        chainId: 54176,
        urls: {
          apiURL: "https://scan.over.network",
          browserURL: "https://scan.over.network",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "blastSepolia",
        chainId: 168587773,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io",
        },
      },
      {
        network: "movementDevnet",
        chainId: 336,
        urls: {
          apiURL: "TODO: Block explorer is not available yet.",
          browserURL: "https://explorer.devnet.m1.movementlabs.xyz/",
        },
      },
      {
        network: "cyberTestnet",
        chainId: 111557560,
        urls: {
          apiURL: "https://testnet.cyberscan.co/api",
          browserURL: "https://testnet.cyberscan.co/",
        },
      },
      {
        network: "overTestnet",
        chainId: 541762,
        urls: {
          apiURL: "https://dolphin.view.over.network/TODO:", // TODO: API verification?
          browserURL: "https://dolphin.view.over.network/",
        },
      },
      {
        network: "puppynet",
        chainId: 157,
        urls: {
          apiURL: "https://puppyscan.shib.io/TODO:", // TODO: API verification?
          browserURL: "https://puppyscan.shib.io/",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/"
        }
      },
    ],
  },
};
