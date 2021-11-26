pragma solidity ^0.8.0;

import "./IERC20Extended.sol";

contract BalanceFetcher {

    function fetchBalances(IERC20Extended [] memory token, address acc) public view returns (uint256 [] memory balances ) {
         
         balances = new uint256[](token.length);

        for (uint i = 0; i < token.length; i++) {
            balances[i] = token[i].balanceOf(acc);
        }
        return balances;
    }
}
