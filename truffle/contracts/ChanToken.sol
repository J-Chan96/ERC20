// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ChanToken is ERC20 {
    string public _name = "ChanToken";
    string public _symbol = "CTK";
    uint256 public _totalSupply = 10000 * ( 10 ** decimals() );

    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply);
    }
}