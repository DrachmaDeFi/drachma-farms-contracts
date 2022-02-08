import hre from "hardhat";
import { numToWei } from "../utils/ethUnitParser";

const CTOKEN_DECIMALS = 8;

// CToken Params
const params = {
  underlying: "0xB5BC84024BC3D4Cae2D441C6a6093aE54636BBC7",
  comptroller: "0xB6ef08Ffbbb0691a3D9E6c41db4b1d2F97D8D49a",
  irModel: "0x18933A4695a87Df89EAABa3AB762A94d99B320F3",
  name: "kCONFIG Token",
  symbol: "kCONFIG",
  decimals: CTOKEN_DECIMALS,
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const erc20Underlying = await hre.ethers.getContractAt("EIP20Interface", params.underlying);
  const underlyingDecimals = await erc20Underlying.decimals();
  const totalDecimals = underlyingDecimals + params.decimals;
  const initialExcRateMantissaStr = numToWei("2", totalDecimals);

  const CErc20Immutable = await hre.ethers.getContractFactory("CErc20Immutable");
  const cErc20Immutable = await CErc20Immutable.deploy(
    params.underlying,
    params.comptroller,
    params.irModel,
    initialExcRateMantissaStr,
    params.name,
    params.symbol,
    params.decimals,
    deployer.address
  );
  await cErc20Immutable.deployed();
  console.log("CErc20Immutable deployed to:", cErc20Immutable.address);

  const unitrollerProxy = await hre.ethers.getContractAt("Comptroller", params.comptroller);

  console.log("calling unitrollerProxy._supportMarket()");
  await unitrollerProxy._supportMarket(cErc20Immutable.address);

  // await cErc20Immutable.deployTransaction.wait(15);
  // await verifyContract(
  //   cErc20Immutable.address,
  //   [
  //     params.underlying,
  //     params.comptroller,
  //     params.irModel,
  //     initialExcRateMantissaStr,
  //     params.name,
  //     params.symbol,
  //     params.decimals,
  //     deployer.address
  //   ]
  // );
}

// const verifyContract = async (contractAddress: string, constructorArgs: any) => {
//   await hre.run("verify:verify", {
//     contract: "contracts/CErc20Immutable.sol:CErc20Immutable",
//     address: contractAddress,
//     constructorArguments: constructorArgs,
//   });
// };

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
