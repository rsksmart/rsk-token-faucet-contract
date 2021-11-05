const ERC677 = artifacts.require("ERC677");

contract('Token Faucet', (accounts) => {
    beforeEach(async () => {
        this.token = await ERC677.new(accounts[0],
            web3.utils.toBN("1000000000000000000000"),
            "Tuki",
            "TUKI")
    })

    it("deploys contract", () => {
        console.log(this.token)
    })
})
