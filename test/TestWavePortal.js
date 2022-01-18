const assert = require('chai').assert;

describe("WavePortal", function () {
  let contract;

  beforeEach(async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    contract = await WavePortal.deploy();
  });

  describe("Test WavePortal Contract", () => {
    it("contract has been deployed", async () => {
      await contract.deployed();
      testWavePortalContract = contract.address; 
      return assert.isTrue(true);
    });

    it("increase wave by 1 when called", async () => {
      let waveCount = await contract.getTotalWaves();
      assert.equal(waveCount, 0);

      let waveTxn = await contract.wave('Hello');
      await waveTxn.wait();

      waveCount = await contract.getTotalWaves();
      assert.equal(waveCount, 1);
    })
  });
});
