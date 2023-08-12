import { defineConfig } from '@wagmi/cli'


import checkMade from "./artifacts/contracts/CheckMade.sol/CheckMade.json"


export default defineConfig({
  out: 'src/generated.ts',
  contracts: [{
    name: "CheckMade.sol",
    abi: checkMade.abi
  },
  ],
  plugins: [],
})
