import BigNumber from "bignumber.js";
export const FEConstants = {
    ethereum: {
        chainId: 59140,
        chainName: "Linea Testnet",
        nativeCurrency: {
            name: "LineaETH",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://explorer.goerli.linea.build"],
        rpcUrls: ["https://rpc.goerli.linea.build"]
    },
    wbtcToken: "0xDbcd5BafBAA8c1B326f14EC0c8B125DB57A5cC4c",
    usdcToken: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
    usdtToken: "0x1990BC6dfe2ef605Bfc08f5A23564dB75642Ad73",
    ethToken: "0x0000000000000000000000000000000000000000",
    tokenData: {
        "0xDbcd5BafBAA8c1B326f14EC0c8B125DB57A5cC4c": {
            decimals: 8,
            symbol: "WBTC",
            coinId: "wrapped-bitcoin",
            displayDecimals: 8
        },
        "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068": {
            decimals: 6,
            symbol: "USDC",
            coinId: "usd-coin",
            displayDecimals: 6
        },
        "0x1990BC6dfe2ef605Bfc08f5A23564dB75642Ad73": {
            decimals: 6,
            symbol: "USDT",
            coinId: "tether",
            displayDecimals: 6
        },
        "0x0000000000000000000000000000000000000000": {
            decimals: 18,
            symbol: "ETH",
            coinId: "ethereum",
            displayDecimals: 8
        }
    },
    url: null,
    satsPerBitcoin: new BigNumber(100000000)
};
