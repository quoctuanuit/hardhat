const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = await fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = await fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  const transactionReceipt = await contract.deployTransaction.wait(1);
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number is ${currentFavoriteNumber}`);

  const trans = await contract.store(10);
  const receipt = trans.wait(1);

  const newNumber = await contract.retrieve();
  console.log(`New number is ${newNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
