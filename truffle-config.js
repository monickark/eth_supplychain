const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
module.exports = {
  networks: {
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    sepolia:{
      provider: () => new HDWalletProvider(process.env.MNEMONIC,process.env.PROVIDER),
      network_id: 11155111
    }
  },

  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
    }
  }
}
