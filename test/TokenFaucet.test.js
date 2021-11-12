const ERC677 = artifacts.require("ERC677");
const TokenFaucet = artifacts.require("TokenFaucet");
const assert = require("assert");
const timeMachine = require('ganache-time-traveler');

contract("Token Faucet", (accounts) => {
  // arrange
  beforeEach(async () => {
    this.tuki = await ERC677.new(
      accounts[0],
      web3.utils.toBN("100000000000000000000"),
      "Tuki",
      "TUKI"
    );
    this.faucet = await TokenFaucet.new();
    this.tuki.transfer(this.faucet.address, web3.utils.toBN("10000000000000000000"));

    
    let snapshot = await timeMachine.takeSnapshot();
    this.snapshotId = snapshot['result'];
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(this.snapshotId);
  })

  it("deploys contract", () => {
    console.log(this.token);
  });

  it("dispenses", async () => {
    // act
    await this.faucet.dispense(this.tuki.address, accounts[1], { from: accounts[1] });
    // assert

    const balance = await this.tuki.balanceOf(accounts[1])
    const dispenseValue = await this.faucet.dispenseValue()

    assert(balance.eq(dispenseValue));
  });
 
  it("does not allow double dispense", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], { from: accounts[1] });
    const msgError = await this.faucet.msgError()
    // act, assert
    assert.rejects(() => this.faucet.dispense(this.tuki.address, accounts[1], { from: accounts[1] }), msgError)
    
  });

  it.only("dispense second time after timers done", async () => {
    await this.faucet.dispense(this.tuki.address, accounts[1], { from: accounts[1] });
    const balance = await this.tuki.balanceOf(accounts[1]);
    const timer = await this.faucet.timer()
    const balanceShouldHave = (await this.faucet.dispenseValue() * 2)
    // act
    await timeMachine.advanceTimeAndBlock(timer);
    await this.faucet.dispense(this.tuki.address, accounts[1], { from: accounts[1] });
    
    //assert
    assert(balance.eq(balanceShouldHave));
  });
});
