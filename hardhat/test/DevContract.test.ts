import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";

import { DevContract, DevContract__factory } from "../typechain-types";

describe("DevContract Tests", () => {
    let devContract: DevContract;



    async function deployTokenFixture() {

        let [owner, addr1, addr2, addr3, addr4, team1, team2, ...addrs] = await ethers.getSigners();
        // Handle Merkle Tree Whitelist

        const devContract = await new DevContract__factory(owner).deploy();
        await devContract.waitForDeployment();

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
            devContract,
        };
    }



    describe('First demo test', async function () {
        it('should be true: demo test', async function () {
            const { owner, devContract } = await loadFixture(deployTokenFixture);
            expect(await devContract.owner()).to.be.equal(owner.address);

        });

    })
})