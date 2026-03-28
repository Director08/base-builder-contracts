import { configVariable, defineConfig } from "hardhat/config";
import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";

export default defineConfig({
  plugins: [hardhatKeystore, hardhatViem, hardhatMocha],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    base: {
      type: "http",
      chainType: "l1",
      chainId: 8453,
      url: "https://mainnet.base.org",
      accounts: [configVariable("PRIVATE_KEY")],
    },
    baseSepolia: {
      type: "http",
      chainType: "l1",
      chainId: 84532,
      url: configVariable("BASE_SEPOLIA_RPC_URL"),
      accounts: [configVariable("PRIVATE_KEY")],
    },
  },
});
