# FundChain: Decentralized Funding DApp

Revolutionize the way projects and ideas are funded with our blockchain crowdfunding DApp. This innovative platform leverages the power of blockchain technology to create a decentralized, transparent, and secure environment for raising capital.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
FundChain enables project creators to raise capital directly from a global pool of investors without the need for intermediaries. By utilizing smart contracts, the DApp automates the funding process, ensuring transparency and security.

## Features
- Decentralized platform for crowdfunding
- Secure and transparent transactions
- Automated funding process through smart contracts
- Global pool of investors

## Installation
### Node.js & NPM
Ensure you have Node.js and NPM installed. Recommended versions:
- Node.js: v18.12.1
- NPM: 8.19.2

Download Node.js and NPM from [Node.js Official Site](https://nodejs.org/en/download).

### Clone the Repository
```bash
git clone https://github.com/shubhamkr790/FundChain.git
cd FundChain
```

### Install Dependencies
```bash
npm install
```

### Setup Video
Watch the setup and demo of the project:
[Setup & Demo Video](https://code.visualstudio.com/download)

### VS Code Editor
Download and install VS Code Editor:
[VS Code Editor](https://code.visualstudio.com/download)

### Test Faucets
Get free test faucets from Alchemy to transfer to your wallet address for deploying the contract:
[Alchemy Faucets](https://www.alchemy.com/faucets)

### RemixID
We use RemixID for deploying the contract and generating the ABI, but you can use other tools like Hardhat:
[RemixID](https://remix-project.org)

### Polygon Mumbai
Deploy the contract on Polygon Mumbai:
[Polygon Mumbai](https://mumbai.polygonscan.com/)

## Usage
To run the DApp locally, follow these instructions:
1. Start the local blockchain:
    ```bash
    npx hardhat node
    ```
2. Deploy contracts:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
3. Start the frontend:
    ```bash
    npm start
    ```

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.
