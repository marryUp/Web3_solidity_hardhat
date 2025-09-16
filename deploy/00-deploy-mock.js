const {DECIMAL, INITIAL_ANSWER, developmentChains} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts, deployments}) => {


    if (developmentChains.includes(network.name)) {
        const {firstAccount} = await getNamedAccounts()
        const {secondAccount} = await getNamedAccounts()

        console.log("firstAccount"+firstAccount)
        console.log("secondAccount"+secondAccount)
        

        const {deploy} = deployments
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
        console.log("this is a deploy mock contract...success")
    }else{
        console.log("env is not local, mock constract is skipped....")
    }
    
    
}

module.exports.tags = ["all", "mock"]