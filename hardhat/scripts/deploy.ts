import { ethers } from 'hardhat';
// import { deploymentAddressesBuilder } from './util';
import { verify } from './verify';



async function main() {

  const CheckMade = await ethers.getContractFactory('CheckMade');
  const checkMade = await CheckMade.deploy();

  await checkMade.waitForDeployment();
  const checkMadeAddress = await checkMade.getAddress();

  console.log("----------------------------------------------------");
  console.log(`⛓️ Deploying Contract...`);

  console.log('checkMade deployed to:', checkMadeAddress);



  await verify(checkMadeAddress)

  console.log("Contract verified")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
