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
        it('msg.sender should be set as check owner', async function () {
            const { checkMade, addr1 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            expect(await checkMade.getSignerAddressForCheck(hash)).to.be.equal(addr1.address);

        });

        it('hashString should return the same as the ethers keccak256', async function () {
            const { checkMade } = await loadFixture(deployTokenFixture);
            const referenceHash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            const contractHash= await checkMade.hashString("Test")
            expect(referenceHash).to.be.equal(contractHash);

        });

        
        it('hashBytes should return the same as the ethers keccak256', async function () {
            const { checkMade } = await loadFixture(deployTokenFixture);
            const referenceHash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            const contractHash= await checkMade.hashBytes(ethers.toUtf8Bytes("Test"))
            expect(referenceHash).to.be.equal(contractHash);

        });

        it('only check owner should be able to edit meta data', async function () {
            const { checkMade, addr1, addr2 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            expect(await checkMade.getSignerAddressForCheck(hash)).to.be.equal(addr1.address);

            await expect(checkMade.connect(addr2).addContentUrlToCheck(hash, "Test")).to.be.revertedWith("Only the owner of the check can add a url");
            await expect(checkMade.connect(addr2).addDescriptionToCheck(hash, "Test")).to.be.revertedWith("Only the owner of the check can add a description");
            await expect(checkMade.connect(addr2).addReferenceHashesToCheck(hash, [ethers.keccak256(ethers.toUtf8Bytes("Test"))])).to.be.revertedWith("Only the owner of the check can add reference hashes");
        });

        it('owner should be able to set url', async function () {
            const { checkMade, addr1, addr2 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            expect(await checkMade.getSignerAddressForCheck(hash)).to.be.equal(addr1.address);

            await checkMade.connect(addr1).addContentUrlToCheck(hash, "TestUrl");
            expect(await checkMade.getContentUrlForCheck(hash)).to.be.equal("TestUrl");      
        });

        it('owner should be able to set description', async function () {
            const { checkMade, addr1, addr2 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            expect(await checkMade.getSignerAddressForCheck(hash)).to.be.equal(addr1.address);

            await checkMade.connect(addr1).addDescriptionToCheck(hash, "TestDescription");
            expect(await checkMade.getDescriptionForCheck(hash)).to.be.equal("TestDescription");      
        });

        it('owner should be able to add reference hashes and not override old ones', async function () {
            const { checkMade, addr1, addr2 } = await loadFixture(deployTokenFixture);
            const hash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
            await checkMade.connect(addr1).createCheck(hash)
            expect(await checkMade.getSignerAddressForCheck(hash)).to.be.equal(addr1.address);

            const hash1= ethers.keccak256(ethers.toUtf8Bytes("Test1"));
            const hash2= ethers.keccak256(ethers.toUtf8Bytes("Test2"));
            const hash3= ethers.keccak256(ethers.toUtf8Bytes("Test3"));
            const hash4= ethers.keccak256(ethers.toUtf8Bytes("Test4"));
            await checkMade.connect(addr1).addReferenceHashesToCheck(hash, [hash1, hash2]);
            await checkMade.connect(addr1).addReferenceHashesToCheck(hash, [hash3, hash4]);

            const referenceHashes = await checkMade.getReferenceHashesForCheck(hash);
            expect(referenceHashes.length).to.be.equal(4);
            expect(referenceHashes[0]).to.be.equal(hash1);
            expect(referenceHashes[1]).to.be.equal(hash2);
            expect(referenceHashes[2]).to.be.equal(hash3);	
            expect(referenceHashes[3]).to.be.equal(hash4);      
        });

    })

    describe('CheckMade Test', async function () {
        

    })
})