// import { ethers } from "hardhat";
//创建一个函数，通过ethers获取到合约，再进行一个部署。


const { ethers } = require("hardhat")
const lockTime = process.env.FUNDME_LOCK_TIME

//异步方法中才能使用await
async function main() {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("deploying...")
    //开始部署合约
    const fundMe = await fundMeFactory.deploy(300)
    //进行等待
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)

    
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations....")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target, [300])
    }else{
        console.log("verification skipped...")
    }

    // 部署合约并往账户中充值
    //1 init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners()

    //2 fund contract with first account
    const fundTx = await fundMe.fund({value:ethers.parseEther("0.1")}) 
    await fundTx.wait()
    //3 check balance of contract
    const balanceAfterFirst = await ethers.provider.getBalance(fundMe.target)
    console.log(`balance of contract after first is ${balanceAfterFirst}`)

    //4 fund contract with second account
    const fundTxWithSecond = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.1")}) 
    await fundTxWithSecond.wait()

    //5 check balance of contract
    const balanceAfterSecond = await ethers.provider.getBalance(fundMe.target)
    console.log(`balance of contract  after second is ${balanceAfterSecond}`)

    //6 check contract mapping
    const balanceOfFirst = await fundMe.fundersToAmount(firstAccount.address)
    const balanceOfSecond = await fundMe.fundersToAmount(secondAccount.address)

    console.log(`Balance of first account ${firstAccount.address} is ${balanceAfterFirst}`)
    console.log(`Balance of first account ${secondAccount.address} is ${balanceOfSecond}`)

}

// 验证
async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}


//执行main方法，如果报错则处理错误
main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})


