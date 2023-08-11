import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";

import { CheckMade__factory, CheckMade } from "../typechain-types";

describe("CheckMade Tests", () => {
    let checkMade: CheckMade;



    async function deployTokenFixture() {

        let [owner, addr1, addr2, addr3, addr4, team1, team2, ...addrs] = await ethers.getSigners();
        // Handle Merkle Tree Whitelist

        const checkMade = await new CheckMade__factory(owner).deploy();
        await checkMade.waitForDeployment();

        /**
         * fixture Variables used for the tests
         */
        return {
            owner,
            addr1,
            addr2,
            addr3,
            addr4,

            team1,
            team2,
            checkMade: checkMade,
        };
    }



    describe('CheckMade Test', async function () {
        it('should be true that an id without a | is accepted', async function () {
            const { owner, checkMade, addr1 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            console.log(checkMade.getAddressForHash(hash))
            expect(await checkMade.getAddressForHash(hash)).to.be.equal(addr1.address);

        });

        it('should be true that an id without a | is accepted', async function () {
            const { owner, checkMade, addr1 } = await loadFixture(deployTokenFixture);
            const referenceHash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            const contractHash= await checkMade.hashString("Test")
            expect(referenceHash).to.be.equal(contractHash);

        });

        
        it('should be true that an id without a | is accepted', async function () {
            const { owner, checkMade, addr1 } = await loadFixture(deployTokenFixture);
            const referenceHash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            const contractHash= await checkMade.hashBytes(ethers.toUtf8Bytes("Test"))
            expect(referenceHash).to.be.equal(contractHash);

        });


    })

    describe('CheckMade Test', async function () {
        

    })
})