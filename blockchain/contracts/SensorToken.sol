// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SensorToken
 * @dev ERC-20 token for rewarding sensors that send data to the system.
 * Sensors receive tokens for each message they transmit.
 */
contract SensorToken is ERC20, Ownable {
    uint256 public constant REWARD_AMOUNT = 1 * 10**18; // 1 token per message

    // Mapping of sensor ID to wallet address
    mapping(uint256 => address) public sensorWallets;

    // Event emitted when a sensor is registered
    event SensorRegistered(uint256 indexed sensorId, address indexed walletAddress);

    // Event emitted when a sensor is rewarded
    event SensorRewarded(uint256 indexed sensorId, address indexed walletAddress, uint256 amount);

    constructor() ERC20("SensorToken", "SENS") Ownable(msg.sender) {
        // Mint initial supply to owner for distribution
        _mint(msg.sender, 1000000 * 10**18); // 1 million tokens
    }

    /**
     * @dev Register a wallet address for a sensor
     * @param sensorId The unique identifier of the sensor
     * @param walletAddress The wallet address to associate with the sensor
     */
    function registerSensor(uint256 sensorId, address walletAddress) external onlyOwner {
        require(walletAddress != address(0), "Invalid wallet address");
        sensorWallets[sensorId] = walletAddress;
        emit SensorRegistered(sensorId, walletAddress);
    }

    /**
     * @dev Reward a sensor with tokens for sending a message
     * @param sensorId The unique identifier of the sensor
     */
    function rewardSensor(uint256 sensorId) external onlyOwner {
        address walletAddress = sensorWallets[sensorId];
        require(walletAddress != address(0), "Sensor not registered");
        
        _mint(walletAddress, REWARD_AMOUNT);
        emit SensorRewarded(sensorId, walletAddress, REWARD_AMOUNT);
    }

    /**
     * @dev Register and reward a sensor in one transaction. If the sensor is already
     * registered, it will just reward. This saves gas and simplifies the backend.
     * @param sensorId The unique identifier of the sensor
     * @param walletAddress The wallet address to associate with the sensor (used if not already registered)
     */
    function rewardOrRegisterSensor(uint256 sensorId, address walletAddress) external onlyOwner {
        require(walletAddress != address(0), "Invalid wallet address");
        
        // Register if not already registered
        if (sensorWallets[sensorId] == address(0)) {
            sensorWallets[sensorId] = walletAddress;
            emit SensorRegistered(sensorId, walletAddress);
        }
        
        // Reward the sensor
        address rewardAddress = sensorWallets[sensorId];
        _mint(rewardAddress, REWARD_AMOUNT);
        emit SensorRewarded(sensorId, rewardAddress, REWARD_AMOUNT);
    }

    /**
     * @dev Reward a sensor with a custom amount of tokens
     * @param sensorId The unique identifier of the sensor
     * @param amount The amount of tokens to reward
     */
    function rewardSensorCustomAmount(uint256 sensorId, uint256 amount) external onlyOwner {
        address walletAddress = sensorWallets[sensorId];
        require(walletAddress != address(0), "Sensor not registered");
        
        _mint(walletAddress, amount);
        emit SensorRewarded(sensorId, walletAddress, amount);
    }

    /**
     * @dev Get the wallet address for a sensor
     * @param sensorId The unique identifier of the sensor
     * @return The wallet address associated with the sensor
     */
    function getSensorWallet(uint256 sensorId) external view returns (address) {
        return sensorWallets[sensorId];
    }

    /**
     * @dev Get the token balance for a sensor
     * @param sensorId The unique identifier of the sensor
     * @return The token balance of the sensor's wallet
     */
    function getSensorBalance(uint256 sensorId) external view returns (uint256) {
        address walletAddress = sensorWallets[sensorId];
        if (walletAddress == address(0)) {
            return 0;
        }
        return balanceOf(walletAddress);
    }

    /**
     * @dev Batch register multiple sensors
     * @param sensorIds Array of sensor identifiers
     * @param walletAddresses Array of wallet addresses
     */
    function batchRegisterSensors(uint256[] calldata sensorIds, address[] calldata walletAddresses) external onlyOwner {
        require(sensorIds.length == walletAddresses.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < sensorIds.length; i++) {
            require(walletAddresses[i] != address(0), "Invalid wallet address");
            sensorWallets[sensorIds[i]] = walletAddresses[i];
            emit SensorRegistered(sensorIds[i], walletAddresses[i]);
        }
    }

    /**
     * @dev Batch reward multiple sensors
     * @param sensorIds Array of sensor identifiers to reward
     */
    function batchRewardSensors(uint256[] calldata sensorIds) external onlyOwner {
        for (uint256 i = 0; i < sensorIds.length; i++) {
            address walletAddress = sensorWallets[sensorIds[i]];
            if (walletAddress != address(0)) {
                _mint(walletAddress, REWARD_AMOUNT);
                emit SensorRewarded(sensorIds[i], walletAddress, REWARD_AMOUNT);
            }
        }
    }
}
