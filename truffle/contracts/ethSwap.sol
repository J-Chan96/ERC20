// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


//ChanToken Tx CA
//EthSwap Tx (ingToken CA)
    // CA.balanceOf()
    // CA.transfer()
contract EthSwap {
    ERC20 public token;
    uint public rate = 100;

    // ERC20을 배포한 CA를 인자값으로 받는다 --> _token -> CA값임
    constructor(ERC20 _token){
        token = _token;
    }

    function getToken() public view returns (address) {
        return address(token);
    }

    function getMsgSender() public view returns (address) {
        return msg.sender;
    }

    function getThisAddress() public view returns (address) {
        return address(this);
    }

    function getTokenOwner() public view returns (address) {
        return token._owner();
    }

    // 1ETH에 몇개의 토큰을 줄까? 1ETH - 100Token
    // ETH -> TOKEN 이더를 가지고 토큰을 산다(buy)
    function buyToken() public payable {
        // buyToken
        // send({from:'0x12312', value:1ETH * (10**18)})
        // 1ETH * (10**18) * 100(rate)
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "error [1]");
        token.transfer(msg.sender, tokenAmount);
    }


    // TOKEN -> ETH TOKEN을 팔아서 ETH를 가져옴 (sell)
    function sellToken() public payable {

    }
}
