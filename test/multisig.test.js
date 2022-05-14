const multiSig = artifacts.require("MultiSigWallet");

let instance;
contract("contract deploys successfully", function (accounts) {
  beforeEach(async function () {
    instance = await multiSig.deployed();
  });

  it("should deploy successfully", async function () {
    const owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });
});

contract("board of directors", function (accounts) {
  it("adds a new board member", async function () {
    await instance.addBOD(accounts[1]);
    const isBOD = await instance.isBOD(accounts[1]);
    assert.equal(isBOD, true);
  });

  it("removes a board member", async function () {
    await instance.removeBOD(accounts[1]);
    const isBOD = await instance.isBOD(accounts[1]);
    assert.equal(isBOD, false);
  });
});

contract("adding new charity", function (accounts) {
  it("should add a new charity", async function () {
    await instance.addCharity(
      0,
      accounts[1],
      "global warming",
      web3.utils.toWei("2", "ether"),
      { from: accounts[0] }
    );
    const getCharity = await instance.charities(0);
    assert.equal(getCharity.charityName, "global warming");
  });

  it("should only let the owner add a new charity", async function () {
    try {
      await instance.addCharity(
        0,
        accounts[1],
        "global warming",
        web3.utils.toWei("2", "ether"),
        { from: accounts[1] }
      );
    } catch (error) {
      return true;
    }
    assert.fail();
  });

  it("do not let the owner add a charity with same id twice", async function () {
    try {
      await instance.addCharity(
        0,
        accounts[1],
        "global warming",
        web3.utils.toWei("2", "ether"),
        { from: accounts[0] }
      );
      await instance.addCharity(
        0,
        accounts[1],
        "global warming",
        web3.utils.toWei("2", "ether"),
        { from: accounts[0] }
      );
    } catch (error) {
      return true;
    }
    assert.fail();
  });
});

contract("donating to charity", function (accounts) {
  it("should donate to charity", async function () {
    await instance.addCharity(
      0,
      accounts[1],
      "global warming",
      web3.utils.toWei("2", "ether"),
      { from: accounts[0] }
    );
    await instance.donateToCharity(0, {
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    const getCharity = await instance.charities(0);
    assert.equal(
      getCharity.currentDonationAmount.toString(),
      web3.utils.toWei("1", "ether")
    );
  });
});
