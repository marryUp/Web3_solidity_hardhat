const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect} = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {developmentChains} = require("../../helper-hardhat-config")


!developmentChains.includes(network.name)
?describe.skip
:describe("test fundme contract", async function(){
    let fundMe
    let fundMeSecondAccount
    let firstAccount
    let secondAccount
    let mockV3Aggregator
    beforeEach(async function(){
        // deploy all 
        await deployments.fixture(["all"])
        // get the first account
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        // get the FundMe contract address
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        //  get the FundMe contract by address
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)

    })

    it("test if the owner is msg.sender", async function() {
        // 等待部署完成
        await fundMe.waitForDeployment()
        // 校验合约创建者和发送者地址是否一致
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the datafeed is assigned", async function(){

        // 等待部署完成
        await fundMe.waitForDeployment()
        // 校验合约创建者和发送者地址是否一致
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    })

    //fund, 

    //unit test for fund

    // window open value greater thenn minimum value, funder blance

    it("window closed, value grater than minimum, fund failed",
        async function(){
            // 让时间流失，保证窗口关闭
            await helpers.time.increase(200)
            // 模拟挖矿
            await helpers.mine()
            //让值大于最小设定值100usdc
            expect(fundMe.fund({value: ethers.parseEther("0.1")}))
            .to.be.revertedWith("window is closed...")
        }
    )
    // 在锁定期内，充值额度小于设定值看是否失败
    it("window open, value is less than minimum, fund failed", 
        async function(){
             expect(fundMe.fund({value: ethers.parseEther("0.01")}))
            .to.be.revertedWith("Send more ETH")
        }
    )

    // 在时间内，充值钱后检查余额是否和充值的相等
    it("window open, value is greater than minimum, fund success",
        async function(){
            await fundMe.fund({value: ethers.parseEther("0.1")})
            const balance = await fundMe.fundersToAmount(firstAccount)
            expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )



    //getFund
    // onlyOwner, windowClosed, target reched
    it("not onwer, window closed, target reached, getFund failed", 
        async function() {
            // make sure the target is reached 
            await fundMe.fund({value: ethers.parseEther("1")})

            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()

            await expect(fundMeSecondAccount.getFund())
                .to.be.revertedWith("this function can only be called by owner")
        }
    )

    it("window open, target reached, getFund failed", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            await expect(fundMe.getFund())
                .to.be.revertedWith("window is not closed")
        }
    )

    it("window closed, target not reached, getFund failed",
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()            
            await expect(fundMe.getFund())
                .to.be.revertedWith("Target is not reached")
        }
    )

    it("window closed, target reached, getFund success", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()   
            await expect(fundMe.getFund())
                .to.emit(fundMe, "FundWithdrawByOwner")
                .withArgs(ethers.parseEther("1"))
        }
    )

    // refund
    // windowClosed, target not reached, funder has balance
    it("window open, target not reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            await expect(fundMe.refund())
                .to.be.revertedWith("window is not closed");
        }
    )

    it("window closed, target reach, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundMe.refund())
                .to.be.revertedWith("Target is reached");
        }
    )

    it("window closed, target not reach, funder does not has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundMeSecondAccount.refund())
                .to.be.revertedWith("there is no fund for you");
        }
    )

    it("window closed, target not reached, funder has balance", 
        async function() {
            await fundMe.fund({value: ethers.parseEther("0.1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()  
            await expect(fundMe.refund())
                .to.emit(fundMe, "RefundByFunder")
                .withArgs(firstAccount, ethers.parseEther("0.1"))
        }
    )



})