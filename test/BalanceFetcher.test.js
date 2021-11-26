const ERC677 = artifacts.require("ERC677");
const BalanceFetcher = artifacts.require("BalanceFetcher");
const assert = require("assert");

contract("Balance Fetcher", (accounts) => {
    // arrange
    beforeEach(async () => {
        this.tuki = await ERC677.new(
            accounts[0],
            web3.utils.toBN("100000000000000000000000"),
            "Tuki",
            "TUKI"
        );
        this.muchacho = await ERC677.new(
            accounts[0],
            web3.utils.toBN("100000000000000000000000"),
            "Muchacho",
            "MCHO"
        );
        this.cacatua = await ERC677.new(
            accounts[0],
            web3.utils.toBN("100000000000000000000000"),
            "Cacatua",
            "MFBC"
        );
        this.fiumba = await BalanceFetcher.new();
    })
    it("shows all balances", async () => {
        // act
        const tukiShouldBe = web3.utils.toBN(6969);
        const muchachoShouldBe = web3.utils.toBN(42000);
        const cacatuaShouldBe = web3.utils.toBN(5318008)
        await this.tuki.transfer(accounts[1], tukiShouldBe);
        await this.muchacho.transfer(accounts[1], muchachoShouldBe);
        await this.cacatua.transfer(accounts[1], cacatuaShouldBe);

        const [tukiBalance, muchachoBalance, cacatuaBalance] = await this.fiumba.fetchBalances([this.tuki.address, this.muchacho.address, this.cacatua.address], accounts[1]);
        
        // assert
        assert(tukiBalance.eq(tukiShouldBe));
        assert(muchachoBalance.eq(muchachoShouldBe));
        assert(cacatuaBalance.eq(cacatuaShouldBe));
      });
})