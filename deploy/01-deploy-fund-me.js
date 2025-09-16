// function deployFunction(){
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat")
const { developmentChains, networkConfig, LOCK_TIME, WAITCONFIRMATIONS} = require("../helper-hardhat-config")

// module.exports.default = deployFunction

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { secondAccount } = await getNamedAccounts()

    console.log("firstAccount" + firstAccount)
    console.log("secondAccount" + secondAccount)

    let dataFeedAddr
    let confirmations

    if (developmentChains.includes(network.name)) {
        const mockDataFeed = await deployments.get("MockV3Aggregator")
        dataFeedAddr = mockDataFeed.address
        confirmations = 0 
    } else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations = WAITCONFIRMATIONS
    }



    const { deploy } = deployments
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations:confirmations
    })
    console.log("this is a deploy function")

    // 判断部署网络是否为sepolia
    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        await hre.run("verify:verify", {
            address:fundMe.address,
            constructorArguments:[LOCK_TIME, dataFeedAddr],
        });
    }else{
        console.log("Network is not sepolia verification skipped...")
    }

}

module.exports.tags = ["all", "fundme"]