// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract EthSwap {
    ERC20 public token; // import 해온 ERC20.sol 파일에서 작성한 ERC20 컨트랙트의 public 부분을 모두 interface로 사용 
    uint public rate = 100; // 1 Ether당 Token 비율 1:100

    // ERC20 토큰에 대한 CA 값이 인자값으로 들어갑니다.
    constructor(ERC20 _token) {
        token = _token;
    }

    function getToken()public view returns(address) {
        return address(token); // address(token) = swanToke의 CA 계정을 가져옴
    }
    
    function getThis() public view returns(address) {
        return address(this); // address(this) = ethSwap의 CA계정을 가져옴
    }

    function getMsgSender() public view returns(address) {
        return msg.sender; // 해당 컨트랙트를 실행시킨 EOA계정을 가져옴
    }

    function getTokenOwner() public view returns(address) {
        return token._owner(); // ChanToken의 owner ( ChanToken 배포자 ) EOA계정을 가져옴  == coinbase , accounts[0] owner === deployer
    }

    // ETH -> Token 구매
    function buyToken() public payable {
        uint256 tokenAmount = msg.value * rate; // 보내줄 토큰양 구하기 tokenAmount = 300 Token

        require(token.balanceOf(address(this)) >= tokenAmount,"Not enough Tokens "); // EthSwap의 CA계정이 Token을 보내줄양이 충분한지 검증

        token.transfer(msg.sender,tokenAmount); // Contract 실행한 EOA계정에게 토큰 보내주기
    }

    // Token -> ETH 구매
    function sellToken(uint256 _amount) public payable {
        require(token.balanceOf(msg.sender) >= _amount); // Contract를 실행시킨 EOA계정의 스왑하려는 swanToken만큼의 양이 있는지 검증
        // Account1에 50Token이 있는지 체크

        uint256 etherAmount = _amount/rate; // 받은 SwanToken만큼 줘야할 ETH의 양
        // 50/100 ==  0.5ETH

        // ethSwap이 가지고있는 ETH가 etherAmount보다 같거나 많을경우 실행
        require(address(this).balance >= etherAmount); //ethSwap CA계정이 가지고 있는 eth가 보내줘야하는 eth만큼 있는가 검증
        token.transferFrom(msg.sender, address(this),_amount); // Contract를 실행시킨 EOA 계정이 ethSwap CA계정에게 _amount 만큼 SwanToken을 보냅니다.
        payable(msg.sender).transfer(etherAmount); // ethSwap CA계정에서 Contract를 실행시킨 EOA 계정에게 etherAmount만큼의 ETH를 보내줍니다.
    }
}