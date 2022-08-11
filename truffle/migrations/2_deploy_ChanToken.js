const ChanToken = artifacts.require("ChanToken");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function (deployer) {
  try {
    await deployer.deploy(ChanToken); // ChanToken 배포
    const token = await ChanToken.deployed(); // Tx 내용가져오기 - Instance 가져오기
    token.address; // ChanToken의 CA가 나올 것

    await deployer.deploy(EthSwap, token.address); // ChanToken의 CA값을 가져오고 EthSwap 배포 진행
    const ethSwap = await EthSwap.deployed();
  } catch (e) {
    console.log(e.message);
  }
};

// EthSwap CA : 0x5875DAC6578a26ae8f409d58aE0c9A1ec99c75b3
// ChanToken CA : 0x370851B63CF3dF90dCDFB59F70De88a67b6C2A3a
