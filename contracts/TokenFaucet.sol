pragma solidity ^0.8.0;

import "./IERC20Extended.sol";

contract TokenFaucet {
    address public owner;

    uint256 public constant dispenseValue = 1;

    mapping(address => mapping(address => uint256)) public cannotDispenseUntil;

    modifier onceADay(IERC20Extended token, address to) {
        require(cannotDispenseUntil[address(token)][msg.sender] < block.timestamp, "You must wait a day between dispenses");
        _;
        cannotDispenseUntil[address(token)][msg.sender] = block.timestamp + 1 days;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner-only function");
        _;
    }

    function dispense(IERC20Extended token, address to) public onceADay(token, to) {
        token.transfer(to, dispenseValue);
    }

    function withdraw(
        IERC20Extended token,
        address to,
        uint256 value
    ) public onlyOwner {
        token.transfer(to, value);
    }

    constructor() public {
        owner = msg.sender;
    }
}
