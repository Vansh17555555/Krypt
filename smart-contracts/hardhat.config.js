require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.10',
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};