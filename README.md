# ⛓ Ethereum Supply Chain Traceability DApp

![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat&logo=solidity)
![Ethereum](https://img.shields.io/badge/Network-Sepolia-3C3C3D?style=flat&logo=ethereum)
![Truffle](https://img.shields.io/badge/Framework-Truffle-5E464D?style=flat)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=node.js)

A decentralized supply chain traceability system built on Ethereum. Smart contracts enforce immutable, auditable product lifecycle tracking — from manufacturer to end consumer — eliminating counterfeit goods and opaque logistics with on-chain transparency.

---

## Architecture

| Layer | Stack |
|---|---|
| Smart contracts | Solidity · Truffle · Deployed on Sepolia |
| Backend | Node.js · Express · Web3.js |
| Frontend | HTML · CSS · JavaScript |

---

## Product lifecycle flow

```
Manufacturer → Distributor → Retailer → Consumer → On-chain verified ✓
```

Each transition is recorded as an immutable on-chain event, creating a tamper-proof audit trail for every product.

---

## Key features

- **Immutable product registration** — every product gets a unique on-chain identity at manufacture
- **Role-based access control** — manufacturer, distributor, retailer, and consumer roles enforced in contract logic
- **Real-time state tracking** — product ownership and status tracked via Solidity events
- **Full-stack DApp** — Node.js API layer + HTML/JS frontend connected via Web3.js
- **Sepolia testnet deployment** — live and verifiable on-chain

---

## Quick start

```bash
git clone https://github.com/monickark/eth_supplychain
cd eth_supplychain
npm install
npm install -g truffle
npm install @truffle/hdwallet-provider

# Deploy contracts
truffle migrate --network sepolia

# Start frontend
cd client && npm start
```

---

## Project structure

```
eth_supplychain/
├── contracts/       # Solidity smart contracts
├── migrations/      # Truffle deployment scripts
├── test/            # Contract test suite
├── client/          # Frontend DApp
├── server/          # Node.js backend API
└── build/contracts/ # Compiled ABIs
```

---

## Built by

[Monicka Akilan](https://github.com/monickark) — Blockchain Architect · Smart Contract Engineer
[![LinkedIn](https://img.shields.io/badge/LinkedIn-monickark-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/monickark/)
