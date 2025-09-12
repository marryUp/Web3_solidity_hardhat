
const { task } = require("hardhat/config")

task("deploy-fundme", "task of fundme deploy!").setAction(async(taskArgs,hre) => {
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
})

// 验证
async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

module.exports ={}