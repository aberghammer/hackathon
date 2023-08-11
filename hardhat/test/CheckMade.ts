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
            const { owner, checkMade } = await loadFixture(deployTokenFixture);
            expect(await checkMade.isIdAvailable("Test")).to.be.true;

        });

        it('an id containing a | should be rejected', async function () {
            const { owner, checkMade } = await loadFixture(deployTokenFixture);
            expect(await checkMade.isIdAvailable("Test|")).to.be.false;

        });

    })

    describe('CheckMade Test', async function () {
        

    })
})