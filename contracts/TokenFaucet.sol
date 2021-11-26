pragma solidity ^0.8.0;

import "./IERC20Extended.sol";

// Multi-Token Faucet
contract TokenFaucet {
    address public owner; // owner of the faucet
    uint256 public period = 1 days; // period of dispense time
    uint256 public dispenseValue = 10000000000000000000; // value for every dispense
    string public constant msgErrorTime = "Not enough time between dispenses"; // message error for onlyOnceInPeriod() modifier
    string public constant msgErrorOwner = "Owner-only function"; // message error for onlyOwner() modifier

    mapping(address => mapping(address => uint256)) public cannotDispenseUntil; // time until user can dispense for every token

    // verification account already asked for a dispense before enough time has passed
    modifier onlyOnceInPeriod(IERC20Extended token, address to) {
        require(
            cannotDispenseUntil[address(token)][msg.sender] < block.timestamp,
            msgErrorTime
        );
        _;
        cannotDispenseUntil[address(token)][msg.sender] =
            block.timestamp +
            period;
    }

    // modifier for owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, msgErrorOwner);
        _;
    }

    // ask for dispense
    function dispense(IERC20Extended token, address to)
        public
        onlyOnceInPeriod(token, to)
    {
        token.transfer(to, dispenseValue);
    }

    // OWNER FUNCTIONS:

    // arbitrary withdrawal of any token (owner-only)
    function withdraw(
        IERC20Extended token,
        address to,
        uint256 value
    ) public onlyOwner {
        token.transfer(to, value);
    }

    // set period reset time (owner-only)
    function setPeriod(uint256 _period) public onlyOwner {
        period = _period;
    }

    // set dispense value (owner-only)
    function setDispenseValue(uint256 _dispenseValue) public onlyOwner {
        dispenseValue = _dispenseValue;
    }

    // set owner (owner-only)
    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    // constructor
    constructor() public {
        owner = msg.sender;
    }
}
