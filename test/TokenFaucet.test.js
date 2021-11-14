const ERC677 = artifacts.require("ERC677");
const TokenFaucet = artifacts.require("TokenFaucet");
const assert = require("assert");
const timeMachine = require("ganache-time-traveler");

contract("Token Faucet", (accounts) => {
  // arrange
  beforeEach(async () => {
    this.tuki = await ERC677.new(
      accounts[0],
      web3.utils.toBN("100000000000000000000000"),
      "Tuki",
      "TUKI"
    );
    this.faucet = await TokenFaucet.new();
    this.tuki.transfer(
      this.faucet.address,
      web3.utils.toBN("10000000000000000000000")
    );

    let snapshot = await timeMachine.takeSnapshot();
    this.snapshotId = snapshot["result"];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(this.snapshotId);
  });

  it("deploys contract", () => {
    console.log(this.token);
  });

  it("dispenses", async () => {
    // act
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const balance = await this.tuki.balanceOf(accounts[1]);
    const dispenseValue = await this.faucet.dispenseValue();
    // assert
    assert(balance.eq(dispenseValue));
  });

  it("dispense second time after timers done", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const timer = (await this.faucet.timer()) * 1 + 1;
    const balanceShouldHave = web3.utils.toBN(
      2 * (await this.faucet.dispenseValue())
    );
    // act
    await timeMachine.advanceTimeAndBlock(timer);
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const balance = await this.tuki.balanceOf(accounts[1]);
    //console.log("balance", balance);
    //console.log("balanceShouldHAve", balanceShouldHave);
    // assert
    assert(balance.eq(balanceShouldHave));
  });

  it("owner changes timers value", async () => {
    const newTimer = web3.utils.toBN(10);
    //act
    await this.faucet.setTimer(newTimer, {
      from: accounts[0],
    });
    const timer = await this.faucet.timer();
    // assert
    assert(timer.eq(newTimer));
  });

  it("owner changes dispenseValue", async () => {
    const newDispenseValue = web3.utils.toBN(10);
    //act
    await this.faucet.setDispenseValue(newDispenseValue, {
      from: accounts[0],
    });
    const dispenseValue = await this.faucet.dispenseValue();
    // assert
    assert(dispenseValue.eq(newDispenseValue));
  });

  it("owner changes owner", async () => {
    const newOwner = accounts[1];
    //act
    await this.faucet.setOwner(newOwner, {
      from: accounts[0],
    });
    const owner = await this.faucet.owner();
    // assert
    assert.equal(owner, newOwner);
  });

  it("does not allow double dispense", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const msgError = await this.faucet.msgError();
    // act, assert
    assert.rejects(
      () =>
        this.faucet.dispense(this.tuki.address, accounts[1], {
          from: accounts[1],
        }),
      msgError
    );
  });

  it("does not allow to change timers value by not owner", async () => {
    const newTimer = web3.utils.toBN(10);
    const msgOwner = await this.faucet.msgOwner();
    //atc, assert
    await assert.rejects(
      () =>
        this.faucet.setTimer(newTimer, {
          from: accounts[1],
        }),
      msgOwner
    );
  });

  it("does not allow to change dispenseValue by not owner", async () => {
    const newDispenseValue = web3.utils.toBN(10);
    const msgOwner = await this.faucet.msgOwner();
    //atc, assert
    await assert.rejects(
      () =>
        this.faucet.setDispenseValue(newDispenseValue, {
          from: accounts[1],
        }),
      msgOwner
    );
  });

  it("does not allow to change owner by not owner", async () => {
    const newOwner = accounts[1];
    const msgOwner = await this.faucet.msgOwner();
    //atc, assert
    await assert.rejects(
      () =>
        this.faucet.setOwner(newOwner, {
          from: accounts[1],
        }),
      msgOwner
    );
  });
});
