import { ethers } from 'hardhat';
// import { deploymentAddressesBuilder } from './util';
import { verify } from './verify';



async function main() {

  const DevContract = await ethers.getContractFactory('DevContract');
  const devContract = await DevContract.deploy();

  await devContract.waitForDeployment();
  const devContractAddress = await devContract.getAddress();

  console.log("----------------------------------------------------");
  console.log(`⛓️ Deploying Contract...`);

  console.log('devContract deployed to:', devContractAddress);



  await verify(devContractAddress)

  console.log("Contract verified")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
