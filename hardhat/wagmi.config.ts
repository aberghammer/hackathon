import { defineConfig } from '@wagmi/cli'


import checkMade from "./artifacts/contracts/CheckMade.sol/CheckMade.json"
import checkMate from "./artifacts/contracts/CheckMate.sol/CheckMate.json"

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [{
    name: "CheckMade.sol",
    abi: checkMade.abi
  },
  {
    name: "CheckMate.sol",
    abi: checkMate.abi
  },
  ],
  plugins: [],
})
