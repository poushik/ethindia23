require('dotenv').config();
import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  defaultNetwork: 'arbitrumOne',
  networks: {
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [process.env.BLOCKBASE_PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: [process.env.BLOCKBASE_PRIVATE_KEY],
    },
    arbitrumOne: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [process.env.BLACKBIRD_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};