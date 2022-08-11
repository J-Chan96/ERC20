const ChanToken = artifacts.require("ChanToken");
const EthSwap = artifacts.require("EthSwap");

function toEther(n) {
  return web3.utils.toWei(n, "ether");
}

// web3.eth.getAccount()의 결과물이 아래의 배열에 들어간다. 0,1,2
contract("eth swap", ([deployer, account1, account2]) => {
  let token, ethSwap;

  describe("EthSwap deployment", () => {
    it("deployed", async () => {
      token = await ChanToken.deployed();
      ethSwap = await EthSwap.deployed();
      console.log(ethSwap.address);
    });

    it("토큰 배포자의 기본 초기값 확인", async () => {
      const balance = await token.balanceOf(deployer);
      console.log(balance.toString());
      //   assert.equal(balance.toString(), "10000000000000000000000");
    });

    it("ethSwap-getToken()", async () => {
      const address = await ethSwap.getToken();
      //   console.log(address); // 0x06AB5d11C9699AC61F3Fe771c9f6819E4Ba59C37
      assert.equal(address, token.address);
    });

    it("ethSwap-getMsgSender, getThisAddress", async () => {
      const msgsender = await ethSwap.getMsgSender(); // msgsender : 컨트랙트 발생시켰을때 from에 들어가있는 친구, deployer랑 같은값
      const thisaddress = await ethSwap.getThis(); // ethSwap의 address

      assert.equal(msgsender, deployer);
      assert.equal(thisaddress, ethSwap.address);
    });

    // ERC20 배포한 사람의 EOA 계정을 알고싶다.
    // it("token - owner 확인", async () => {
    //   const owner = await token._owner();
    //   console.log(owner);
    // });

    // it("ethSwap - getTokenOwner()", async () => {
    //   const owner = await ethSwap.getTokenOwner();
    //   console.log(owner);
    //   assert.equal(owner, deployer);
    // });

    it("token - balanceOf()", async () => {
      await token.transfer(ethSwap.address, toEther("1000"));
      const balance = await token.balanceOf(ethSwap.address);
      //   console.log(balance.toString());
    });

    it("ethSwap - buyToken()", async () => {
      let balance = await token.balanceOf(account1);
      assert.equal(balance.toString(), "0");

      await ethSwap.buyToken({
        from: account1, // meg.sender
        value: toEther("1"), // msg.value // ETH , acccount1 : 99ETH, ethSwap : 1ETH
      });

      balance = await token.balanceOf(account1); // 토큰량 100Token
      console.log(balance.toString());

      const ethAccount = await web3.eth.getBalance(account1); // ETH량
      console.log(ethAccount); // 98.8989878

      const ethSwapBalance = await web3.eth.getBalance(ethSwap.address); // 1ETH 1 -> 1ETH
      console.log(web3.utils.fromWei(ethSwapBalance)); // ethSwap에 있는 ETH 갯수가 나타남
    });

    it("EthSwap-sellToken Check", async () => {
      // Account1 : 100Token 98ETH, 50 Token -> ethSwap    0.5ETH -> Account1
      let swapETH = await web3.eth.getBalance(ethSwap.address); // ethSwap ETH값
      let swapToken = await token.balanceOf(ethSwap.address); // ethSwap Token값
      let accountETH = await web3.eth.getBalance(account1); // account1 ETH값
      let accountToken = await token.balanceOf(account1); // account1 Token값

      // SwanToken을 ETH로 스왑하기 전
      console.log(
        `swapETH : ${web3.utils.fromWei(swapETH, "ether")}`,
        `swapToken : ${web3.utils.fromWei(swapToken, "ether")}`,
        `accountETH : ${web3.utils.fromWei(accountETH, "ether")}`,
        `accountToken : ${web3.utils.fromWei(accountToken, "ether")}`
      );

      // approve ( 위임받는 사람, 보낼양 )
      // ethSwap CA값의 50만큼의 SwanToken을 위임해둠
      await token.approve(ethSwap.address, toEther("50"), { from: account1 });
      // 위임을 해줄건데, 이더스왑한테 50token위임을 해줌. 근데 이 50토큰은 account1에서 오는거?
      // 내가 이해한거는 수환이가 말한것처럼 Chan컨트랙트에서 이더스왑한테 위임을 해줌 50token 이용할 수 있도록
      // 그럼 저 뒤에있는 from은 무슨 용도인가?

      // 실제로 SwanToken을 ETH로 스왑함
      await ethSwap.sellToken(toEther("50"), {
        from: account1,
      });

      swapETH = await web3.eth.getBalance(ethSwap.address);
      swapToken = await token.balanceOf(ethSwap.address);
      accountETH = await web3.eth.getBalance(account1);
      accountToken = await token.balanceOf(account1);

      // SwanToken을 ETH로 스왑한 후
      console.log(
        `swapETH : ${web3.utils.fromWei(swapETH, "ether")}`,
        `swapToken : ${web3.utils.fromWei(swapToken, "ether")}`,
        `accountETH : ${web3.utils.fromWei(accountETH, "ether")}`,
        `accountToken : ${web3.utils.fromWei(accountToken, "ether")}`
      );
    });
    it("getthis", async () => {
      const asdf = await ethSwap.getThis();
      console.log(asdf);
    });
  });
});
