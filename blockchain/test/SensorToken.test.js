const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SensorToken", function () {
  let sensorToken;
  let owner;
  let sensor1Wallet;
  let sensor2Wallet;

  beforeEach(async function () {
    [owner, sensor1Wallet, sensor2Wallet] = await ethers.getSigners();
    
    const SensorToken = await ethers.getContractFactory("SensorToken");
    sensorToken = await SensorToken.deploy();
    await sensorToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sensorToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await sensorToken.name()).to.equal("SensorToken");
      expect(await sensorToken.symbol()).to.equal("SENS");
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await sensorToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("1000000"));
    });
  });

  describe("Sensor Registration", function () {
    it("Should register a sensor", async function () {
      await sensorToken.registerSensor(1, sensor1Wallet.address);
      expect(await sensorToken.getSensorWallet(1)).to.equal(sensor1Wallet.address);
    });

    it("Should emit SensorRegistered event", async function () {
      await expect(sensorToken.registerSensor(1, sensor1Wallet.address))
        .to.emit(sensorToken, "SensorRegistered")
        .withArgs(1, sensor1Wallet.address);
    });

    it("Should fail if non-owner tries to register", async function () {
      await expect(
        sensorToken.connect(sensor1Wallet).registerSensor(1, sensor2Wallet.address)
      ).to.be.reverted;
    });

    it("Should fail if wallet address is zero", async function () {
      await expect(
        sensorToken.registerSensor(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid wallet address");
    });
  });

  describe("Sensor Rewards", function () {
    beforeEach(async function () {
      await sensorToken.registerSensor(1, sensor1Wallet.address);
    });

    it("Should reward a sensor", async function () {
      await sensorToken.rewardSensor(1);
      const balance = await sensorToken.balanceOf(sensor1Wallet.address);
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("Should emit SensorRewarded event", async function () {
      await expect(sensorToken.rewardSensor(1))
        .to.emit(sensorToken, "SensorRewarded")
        .withArgs(1, sensor1Wallet.address, ethers.parseEther("1"));
    });

    it("Should fail if sensor is not registered", async function () {
      await expect(sensorToken.rewardSensor(999))
        .to.be.revertedWith("Sensor not registered");
    });

    it("Should reward with custom amount", async function () {
      await sensorToken.rewardSensorCustomAmount(1, ethers.parseEther("5"));
      const balance = await sensorToken.balanceOf(sensor1Wallet.address);
      expect(balance).to.equal(ethers.parseEther("5"));
    });
  });

  describe("Reward Or Register", function () {
    it("Should register and reward unregistered sensor in one call", async function () {
      await sensorToken.rewardOrRegisterSensor(1, sensor1Wallet.address);
      
      // Check sensor is registered
      expect(await sensorToken.getSensorWallet(1)).to.equal(sensor1Wallet.address);
      
      // Check sensor received tokens
      const balance = await sensorToken.balanceOf(sensor1Wallet.address);
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("Should emit both SensorRegistered and SensorRewarded events for new sensor", async function () {
      await expect(sensorToken.rewardOrRegisterSensor(1, sensor1Wallet.address))
        .to.emit(sensorToken, "SensorRegistered")
        .withArgs(1, sensor1Wallet.address)
        .and.to.emit(sensorToken, "SensorRewarded")
        .withArgs(1, sensor1Wallet.address, ethers.parseEther("1"));
    });

    it("Should only reward already registered sensor", async function () {
      // First register sensor
      await sensorToken.registerSensor(1, sensor1Wallet.address);
      
      // Then call rewardOrRegisterSensor - should just reward
      await sensorToken.rewardOrRegisterSensor(1, sensor2Wallet.address);
      
      // Wallet should still be sensor1Wallet (not changed to sensor2Wallet)
      expect(await sensorToken.getSensorWallet(1)).to.equal(sensor1Wallet.address);
      
      // Should have received reward
      const balance = await sensorToken.balanceOf(sensor1Wallet.address);
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("Should fail if wallet address is zero", async function () {
      await expect(
        sensorToken.rewardOrRegisterSensor(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid wallet address");
    });

    it("Should accumulate rewards on multiple calls", async function () {
      await sensorToken.rewardOrRegisterSensor(1, sensor1Wallet.address);
      await sensorToken.rewardOrRegisterSensor(1, sensor1Wallet.address);
      await sensorToken.rewardOrRegisterSensor(1, sensor1Wallet.address);
      
      const balance = await sensorToken.balanceOf(sensor1Wallet.address);
      expect(balance).to.equal(ethers.parseEther("3"));
    });
  });

  describe("Batch Operations", function () {
    it("Should batch register sensors", async function () {
      await sensorToken.batchRegisterSensors(
        [1, 2],
        [sensor1Wallet.address, sensor2Wallet.address]
      );
      expect(await sensorToken.getSensorWallet(1)).to.equal(sensor1Wallet.address);
      expect(await sensorToken.getSensorWallet(2)).to.equal(sensor2Wallet.address);
    });

    it("Should batch reward sensors", async function () {
      await sensorToken.batchRegisterSensors(
        [1, 2],
        [sensor1Wallet.address, sensor2Wallet.address]
      );
      await sensorToken.batchRewardSensors([1, 2]);
      
      expect(await sensorToken.balanceOf(sensor1Wallet.address)).to.equal(ethers.parseEther("1"));
      expect(await sensorToken.balanceOf(sensor2Wallet.address)).to.equal(ethers.parseEther("1"));
    });
  });

  describe("View Functions", function () {
    it("Should get sensor balance", async function () {
      await sensorToken.registerSensor(1, sensor1Wallet.address);
      await sensorToken.rewardSensor(1);
      expect(await sensorToken.getSensorBalance(1)).to.equal(ethers.parseEther("1"));
    });

    it("Should return 0 for unregistered sensor balance", async function () {
      expect(await sensorToken.getSensorBalance(999)).to.equal(0);
    });
  });
});
