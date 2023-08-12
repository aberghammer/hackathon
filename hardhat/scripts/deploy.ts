import { ethers } from 'hardhat';
// import { deploymentAddressesBuilder } from './util';
import { verify } from './verify';



async function main() {

  const CheckMade = await ethers.getContractFactory('CheckMade');
  const checkMade = await CheckMade.deploy();
  await checkMade.waitForDeployment();
  const checkMadeAddress = await checkMade.getAddress();
  
  const CheckMate = await ethers.getContractFactory('CheckMate');
  const checkMate = await CheckMate.deploy(checkMadeAddress);
  await checkMade.waitForDeployment();
  const checkMateAddress = await checkMate.getAddress();
  await checkMade.setCheckMate(checkMateAddress);


  console.log("----------------------------------------------------");
  console.log(`⛓️ Deploying Contract...`);

  console.log('checkMade deployed to:', checkMadeAddress);
  console.log('checkMate deployed to:', checkMateAddress);



  await verify(checkMadeAddress)
  await verify(checkMateAddress, [checkMadeAddress])

  console.log("Contract verified")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
