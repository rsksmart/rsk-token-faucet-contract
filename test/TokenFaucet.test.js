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
    await this.tuki.transfer(
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

  it("dispense second time after period done", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const period = (await this.faucet.period()) * 1 + 1;
    const balanceShouldHave = web3.utils.toBN(
      2 * (await this.faucet.dispenseValue())
    );
    // act
    await timeMachine.advanceTimeAndBlock(period);
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const balance = await this.tuki.balanceOf(accounts[1]);
    //console.log("balance", balance);
    //console.log("balanceShouldHAve", balanceShouldHave);
    // assert
    assert(balance.eq(balanceShouldHave));
  });

  it("owner changes period value", async () => {
    const newPeriod = web3.utils.toBN(10);
    //act
    await this.faucet.setPeriod(newPeriod, {
      from: accounts[0],
    });
    const period = await this.faucet.period();
    // assert
    assert(period.eq(newPeriod));
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

  it("owner withdraws", async () => {
    const previousFaucetBalance = await this.tuki.balanceOf(this.faucet.address);
    //act
    await this.faucet.withdraw(this.tuki.address, accounts[1], previousFaucetBalance, { from: accounts[0] })
    //assert
    const afterFaucetBalance = await this.tuki.balanceOf(this.faucet.address);
    const balanceAfterWithdraw = await this.tuki.balanceOf(accounts[1]);
    assert(balanceAfterWithdraw.eq(previousFaucetBalance));
    assert(afterFaucetBalance.eq(web3.utils.toBN("0")));
  });

  it("does not allow withdraw by not owner", async () => {
    const msgErrorOwner = await this.faucet.msgErrorOwner();
    const previousFaucetBalance = await this.tuki.balanceOf(this.faucet.address);
    // act, assert
    await assert.rejects(
      () => 
        this.faucet.withdraw(this.tuki.address, accounts[1], previousFaucetBalance, { from: accounts[1] })
      ),
      msgErrorOwner;
  });

  it("does not allow double dispense", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], {
      from: accounts[1],
    });
    const msgErrorTime = await this.faucet.msgErrorTime();
    // act, assert
    await assert.rejects(
      () =>
        this.faucet.dispense(this.tuki.address, accounts[1], {
          from: accounts[1],
        }),
        msgErrorTime
    );
  });

  it("does not allow to change period value by not owner", async () => {
    const newPeriod = web3.utils.toBN(10);
    const msgErrorOwner = await this.faucet.msgErrorOwner();
    //act, assert
    await assert.rejects(
      () =>
        this.faucet.setPeriod(newPeriod, {
          from: accounts[1],
        }),
      msgErrorOwner
    );
  });

  it("does not allow to change dispenseValue by not owner", async () => {
    const newDispenseValue = web3.utils.toBN(10);
    const msgErrorOwner = await this.faucet.msgErrorOwner();
    //act, assert
    await assert.rejects(
      () =>
        this.faucet.setDispenseValue(newDispenseValue, {
          from: accounts[1],
        }),
        msgErrorOwner
    );
  });

  it("does not allow to change owner by not owner", async () => {
    const newOwner = accounts[1];
    const msgErrorOwner = await this.faucet.msgErrorOwner();
    //act, assert
    await assert.rejects(
      () =>
        this.faucet.setOwner(newOwner, {
          from: accounts[1],
        }),
        msgErrorOwner
    );
  });
});
