require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("./tasks")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");


const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVSTE_KEY_1 = process.env.PRIVSTE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24", 
  defaultNetwork: "hardhat",
  mocha:{
    timeout: 400000
  },
  networks:{
    sepolia:{
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVSTE_KEY_1],
      chainId: 11155111
    }
  },
  etherscan:{
    apiKey: {
      sepolia: ETHERSCAN_API_KEY //"ZMVJYJ6NSI3TEZF1V6NCF2B45DAYR6GFJI"
    }
  },
  namedAccounts:{
    firstAccount:{
      default:0
    },
    secondAccount:{
      default:1
    }
  },

  gasReporter:{
    enabled : true
  }
}
