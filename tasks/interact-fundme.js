   
const {task} =require("hardhat/config")

task("interact-fundme","contract fundme init")
.addParam("addr","contract address")
.setAction(async(taskArgs, hre) =>{ 

    const fundMeFactory = await ethers.getContractFactory("FundMe")
    const fundMe = fundMeFactory.attach(taskArgs.addr)

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
})

module.exports = {}