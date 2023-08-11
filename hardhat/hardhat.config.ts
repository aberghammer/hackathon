import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-network-helpers";
import "typechain";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-contract-sizer';
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const ETHERSCAN = process.env.ES_API || "please provide etherscan key...";
const POLYGONSCAN = process.env.PS_API || "please provide etherscan key...";

const GOERLI = `https://goerli.infura.io/v3/${process.env.INFURA}`;
const MAINNET = `https://mainnet.infura.io/v3/${process.env.INFURA}`;
const SEPOLIA = `https://sepolia.infura.io/v3/${process.env.INFURA}`;

const MUMBAI = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA}`;



const PRIVATE_KEY = process.env.DEPLOY;


const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 5,
    },
    mainnet: {
      url: MAINNET,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 1,
    },
    sepolia: {
      url: SEPOLIA,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    mumbai: {
      url: MUMBAI,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001,
    }
  },

  typechain: {
    outDir: "typechain-types",
  },

  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
    enabled: true,
  },

  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN,
      goerli: ETHERSCAN,
      sepolia: ETHERSCAN,
      polygon: POLYGONSCAN,
      polygonMumbai: POLYGONSCAN
    }
  },

  solidity: {
    compilers: [{
      version: "0.8.18",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    }]
  },
};
export default config;