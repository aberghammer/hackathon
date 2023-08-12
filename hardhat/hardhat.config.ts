import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-network-helpers";
import "typechain";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-contract-sizer';
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const ETHERSCAN = process.env.ETHERSCAN_API_KEY || "please provide etherscan api key...";
const POLYGONSCAN = process.env.POLYGONSCAN_API_KEY || "please provide polygonscan api key...";
const PLOyGONSCAN_ZKEVM = process.env.POLYGONSCAN_ZKEVM_API_KEY || "please provide polygonscan zkevm api key...";

const GOERLI = `https://goerli.infura.io/v3/${process.env.INFURA}`;
const MAINNET = `https://mainnet.infura.io/v3/${process.env.INFURA}`;
const SEPOLIA = `https://sepolia.infura.io/v3/${process.env.INFURA}`;
const MUMBAI = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA}`;
const POLYGON_ZK_TEST = "";
//const MAINNET = process.env.RPC_URL_MAINNET || "please provide rpc url mainnet...";
//const SEPOLIA = process.env.RPC_URL_SEPOLIA || "please provide rpc url sepolia...";
//const MUMBAI = process.env.RPC_URL_MUMBAI || "please provide rpc url mumbai...";
// const POLYGON_ZK_TEST = process.env.RPC_URL_POLYGON_ZK_TEST || "please provide rpc url mumbai...";



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
    },
    polygonZKEVMTestnet: {
      url: POLYGON_ZK_TEST,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 1442,
    }
  },


  typechain: {
    outDir: "typechain-types",
  },

  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
    enabled: false,
  },

  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN,
      goerli: ETHERSCAN,
      sepolia: ETHERSCAN,
      polygon: POLYGONSCAN,
      polygonMumbai: POLYGONSCAN,
      polygonZKEVMTestnet: PLOyGONSCAN_ZKEVM,
      popolygonZKEVMMainnet: PLOyGONSCAN_ZKEVM
    },
    customChains: [
      {
        network: "polygonZKEVMTestnet",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com/"
        }
      }
    ],
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
  mocha: {
    timeout: 2000000
  },
};
export default config;