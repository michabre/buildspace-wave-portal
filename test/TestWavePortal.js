const assert = require('chai').assert;

describe("WavePortal", function () {
  let contract;

  beforeEach(async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    contract = await WavePortal.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
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
    });

    it("users wins and gets prize", async () => {
      let waveTxn = await contract.wave('Hello');
      await waveTxn.wait();
      let winners = await contract.getNumberOfWinners();

      if (winners > 1) {
        assert.equal(winners, 1);
      }
    });

    it("check number of waves", async () => {
      let waves = await contract.getTotalWaves();
      assert.equal(waves, 0);
    });

    it("should be 3 waves", async () => {
      const [owner, addr1, addr2] = await ethers.getSigners();
      let waveTxn = await contract.connect(owner).wave('Have not a clue');
      await waveTxn.wait();
      let waveTxn2 = await contract.connect(addr1).wave('Lets play a game');
      await waveTxn2.wait();
      let waveTxn3 = await contract.connect(addr2).wave('Just me and you');
      await waveTxn3.wait();
      let waves = await contract.getTotalWaves();

      assert.equal(waves, 3);
    });

    it("return a wave tuple", async () => {
      const [owner] = await ethers.getSigners();
      let waveTxn = await contract.connect(owner).wave('Hello');
      await waveTxn.wait();

      let getWave = await contract.getAllWaves();

      assert.equal(getWave[0].waver, owner.address);
      assert.equal(getWave[0].message, 'Hello');

    });
  });
});
