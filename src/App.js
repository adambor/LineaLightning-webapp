import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import './App.css';
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import WalletTab from "./components/WalletTab";
import SwapTab from "./components/SwapTab";
import { EVMtoBTCLNRefund } from "./components/EVMtoBTCLNPanel";
import { BTCLNtoEVMClaim, BTCtoEVMClaim } from "./components/BTCLNtoEVMPanel";
import { BitcoinNetwork, BTCLNtoSolSwap, BTCtoSolNewSwap, EVMSwapper } from "evmlightning-sdk";
import * as BN from "bn.js";
function App() {
    const [signer, setSigner] = useState();
    const [swapper, setSwapper] = useState();
    const [error, setError] = useState();
    const [claimableBTCLNtoEVM, setClaimableBTCLNtoEVM] = useState();
    const [refundableEVMtoBTCLN, setRefundableEVMtoBTCLN] = useState();
    useEffect(() => {
        if (signer == null)
            return;
        console.log("New signer set: ", signer);
        (async () => {
            try {
                //const swapperOptions = EVMSwapper.createSwapperOptions("LINEA_TESTNET", new BN(5000), "https://node3.gethopa.com:34003");
                const swapperOptions = EVMSwapper.createSwapperOptions("LINEA_TESTNET", new BN(5000));
                swapperOptions.bitcoinNetwork = BitcoinNetwork.MAINNET;
                swapperOptions.addresses.btcRelayContract = "0x3653872235348098c6c681C1A4d816bDBC6d231f";
                swapperOptions.addresses.swapContract = "0x09aa4D88112E65B93195aD5c218866E4D05f2CE5";
                swapperOptions.registryUrl = "https://api.github.com/repos/adambor/LineaLightning-registry/contents/registry-mainnet.json?ref=main";
                swapperOptions.useEip1559ForBtcRelay = false;
                const swapper = new EVMSwapper(signer, swapperOptions);
                console.log("Swapper: ", swapper);
                await swapper.init();
                console.log("Swapper initialized, getting claimable swaps...");
                setClaimableBTCLNtoEVM(await swapper.getClaimableSwaps());
                setRefundableEVMtoBTCLN(await swapper.getRefundableSwaps());
                setSwapper(swapper);
                console.log("Initialized");
            }
            catch (e) {
                console.error(e);
            }
        })();
    }, [signer]);
    return (_jsx("div", Object.assign({ className: "App" }, { children: _jsx("header", Object.assign({ className: "App-header text-black" }, { children: _jsx(Card, Object.assign({ bg: "light" }, { children: _jsx(Card.Body, { children: swapper != null ? (_jsxs(_Fragment, { children: [claimableBTCLNtoEVM != null && claimableBTCLNtoEVM.length > 0 ? (_jsxs(Card, Object.assign({ className: "p-3" }, { children: [_jsxs(Card.Title, { children: ["Incomplete swaps (BTCLN-", '>', "EVM)"] }), _jsx(Card.Body, { children: claimableBTCLNtoEVM.map((e, index) => {
                                            if (e instanceof BTCLNtoSolSwap) {
                                                return (_jsx(BTCLNtoEVMClaim, { signer: signer, swap: e, onError: setError, onSuccess: () => {
                                                        setClaimableBTCLNtoEVM(prevState => {
                                                            const cpy = [...prevState];
                                                            cpy.splice(index, 1);
                                                            return cpy;
                                                        });
                                                    } }, index));
                                            }
                                            if (e instanceof BTCtoSolNewSwap) {
                                                return (_jsx(BTCtoEVMClaim, { signer: signer, swap: e, onError: setError, onSuccess: () => {
                                                        setClaimableBTCLNtoEVM(prevState => {
                                                            const cpy = [...prevState];
                                                            cpy.splice(index, 1);
                                                            return cpy;
                                                        });
                                                    } }, index));
                                            }
                                        }) })] }))) : "", refundableEVMtoBTCLN != null && refundableEVMtoBTCLN.length > 0 ? (_jsxs(Card, Object.assign({ className: "p-3" }, { children: [_jsxs(Card.Title, { children: ["Incomplete swaps (EVM-", '>', "BTCLN)"] }), _jsx(Card.Body, { children: refundableEVMtoBTCLN.map((e, index) => {
                                            return (_jsx(EVMtoBTCLNRefund, { swapper: swapper, signer: signer, swap: e, onError: setError, onSuccess: () => {
                                                    setRefundableEVMtoBTCLN(prevState => {
                                                        const cpy = [...prevState];
                                                        cpy.splice(index, 1);
                                                        return cpy;
                                                    });
                                                }, onRefunded: () => {
                                                    setRefundableEVMtoBTCLN(prevState => {
                                                        const cpy = [...prevState];
                                                        cpy.splice(index, 1);
                                                        return cpy;
                                                    });
                                                } }, index));
                                        }) })] }))) : "", _jsx(SwapTab, { signer: signer, swapper: swapper })] })) : (_jsxs("div", { children: ["Please connect your wallet!", _jsx(WalletTab, { callback: (signer) => setSigner(signer) })] })) }) })) })) })));
}
export default App;
