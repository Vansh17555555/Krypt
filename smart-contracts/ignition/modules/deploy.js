const hre = require("hardhat");

const main = async () => {
  // Get the contract factory
  const Transactions = await hre.ethers.getContractFactory("Transactions");

  // Deploy the contract
  const transactions = await Transactions.deploy();

  // Wait for the contract to be deployed
  await transactions.deployed();

  // Log the address of the deployed contract
  console.log("Transactions deployed to:", transactions.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
