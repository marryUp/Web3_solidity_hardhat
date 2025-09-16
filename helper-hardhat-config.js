const DECIMAL = 8
const INITIAL_ANSWER =300000000000
const LOCK_TIME = 180
const WAITCONFIRMATIONS = 5

const developmentChains = ["hardhat", "local"]
const networkConfig = {
    //eth
    11155111:{
        ethUsdDataFeed: "0x38c8b98A2Cb36a55234323D7eCCD36ad3bFC5954"
    },
    //bnb
    97:{
        ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }
}

module.exports = {
    DECIMAL,
    INITIAL_ANSWER,
    LOCK_TIME,
    developmentChains,
    networkConfig,
    WAITCONFIRMATIONS
}