const hre = require("hardhat");

async function main() {
  console.log("Deploying SensorToken contract...");

  const SensorToken = await hre.ethers.getContractFactory("SensorToken");
  const sensorToken = await SensorToken.deploy();

  await sensorToken.waitForDeployment();

  const address = await sensorToken.getAddress();
  console.log(`SensorToken deployed to: ${address}`);

  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  // Get initial balance
  const balance = await sensorToken.balanceOf(deployer.address);
  console.log(`Initial deployer balance: ${hre.ethers.formatEther(balance)} SENS`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
