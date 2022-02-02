# BuildSpace Project: WavePortal

This project demonstrates a basic Hardhat use case and simple interactions with a smart contract running on a TestNet. 

It is based on BuildSpace's **Build a Web3 App with Solidity + Ethereum Smart Contracts** tutorial.

Once a user's wallet is connected, they can submit a name and message. Once submitted, they have a chance to win some Rinkeby ETH.

## Structure

The root directory contains the smart contract, dependencies and tests.

The client directory contains the React app users will interact with.

This has been deployed here: https://waveportal-project.herokuapp.com

## Getting Started

> **npm install** will take care of any of the required dependencies.

Rename __hardhat.config.sample.js__ to __hardhat.config.js__ and add the appropriate details to deploy to the Rinkeby TestNet. Once completed, do not commit this file. Its already been added to
.gitignore, but make sure it does not get uploaded to a public place. Bots will steal your private key!

## Commands

### Compile

Compile smart contract as outlined in scripts/run.js

```shell
npm run compile
```

### Hardhat

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat node
npx hardhat help
```

### Testing

Run through some basic tests outlined in the test directory.

Using Mocha and Chai.

```shell
npx hardhat test
```

**Solidity Coverage** will display how much of the project is being covered by the tests.

```shell
npx hardhat coverage
```

### Deployment

Deploy smart contract to the local test network

```shell
npm run localhost
```

Deploy smart contract to Rinkeby TestNet

```shell
npm run rinkeby
```
