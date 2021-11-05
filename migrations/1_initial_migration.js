const TokenFaucet = artifacts.require("TokenFaucet");
const ERC677 = artifacts.require("ERC677");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(TokenFaucet);
    deployer.deploy(
        ERC677,
        accounts[0],
        "1000000000000000000000",
        "Tuki",
        "TUKI"
    );
    console.log("tuki");
};
