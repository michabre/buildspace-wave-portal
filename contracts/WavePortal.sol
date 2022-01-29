// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WavePortal is Ownable {
    using Counters for Counters.Counter;

    // Global state variables of contract
    Counters.Counter totalWaves;
    Counters.Counter numberOfWinners;

    // used for generating a random number
    uint256 private seed;

    // checks the last time a user waved
    mapping(address => uint256) public lastWavedAt;

    // Enum Types

    // Struct Types
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    // Function modifier definitions

    // Events definitions
    event NewWave(address indexed from, uint256 timestamp, string message);
    event PrizeAwarded(address _user, uint256 _time, bytes32 _note);

    // Functions
    constructor() payable {
        console.log("We have been constructed!");
        seed = (block.timestamp + block.difficulty) % 100;
        numberOfWinners.reset();
    }

    function wave(string memory _message) public {
        // require(
        //     lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
        //     "Wait 15m"
        // );
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp, 
            "Must wait 30 seconds before waving again."
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves.increment();
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            numberOfWinners.increment();
            emit PrizeAwarded(msg.sender, block.timestamp, "Huzzah!");
            
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves.current();
    }

    function getNumberOfWinners() public view returns (uint256) {
        return numberOfWinners.current();
    }
}