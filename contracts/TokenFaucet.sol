pragma solidity ^0.8.0;

import "./IERC20Extended.sol";

// Multi-Token Faucet
contract TokenFaucet {
    address public owner; // owner of the faucet
    uint256 public timer = 1 days; // timer of dispense time
    uint256 public  dispenseValue = 10000000000000000000; // value for every dispense
    string public constant msgError = "Not enough time between dispenses"; // message error for timePassed() modifier
    string public constant msgOwner = "Owner-only function"; // message error for onlyOwner() modifier

    mapping(address => mapping(address => uint256)) public cannotDispenseUntil; // time until user can dispense for every token

    // verification account already asked for a dispense before enough time has passed
    modifier timePassed(IERC20Extended token, address to) {
        require(cannotDispenseUntil[address(token)][msg.sender] < block.timestamp, msgError);
        _;
        cannotDispenseUntil[address(token)][msg.sender] = block.timestamp + timer;
    }  

    // modifier for owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, msgOwner);
        _;
    } 

    // ask for dispense
    function dispense(IERC20Extended token, address to) public timePassed(token, to) {
        token.transfer(to, dispenseValue);
    }

    // ADMIN FUNCTIONS:

    // arbitrary withdrawal of any token (owner-only)
    function withdraw(
        IERC20Extended token,
        address to,
        uint256 value
    ) public onlyOwner {
        token.transfer(to, value);
    }

    // select timer reset time (owner-only)
    function selectTime(uint256 _timer) public onlyOwner {        
        timer = _timer;
    }

    // select dispense value (owner-only)
    function selectDispenseValue(uint256 _dispenseValue) public onlyOwner {        
        dispenseValue = _dispenseValue;
    }

    // constructor
    constructor() public {
        owner = msg.sender;
    }
}