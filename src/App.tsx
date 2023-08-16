import './App.css';
import * as React from "react";
import {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import WalletTab from "./components/WalletTab";
import SwapTab from "./components/SwapTab";
import {ethers} from 'ethers';
import {EVMtoBTCLNRefund} from "./components/EVMtoBTCLNPanel";
import {BTCLNtoEVMClaim, BTCtoEVMClaim} from "./components/BTCLNtoEVMPanel";
import {
    BitcoinNetwork,
    BTCLNtoSolSwap,
    BTCtoSolNewSwap,
    EVMSwapper,
    IBTCxtoSolSwap,
    ISolToBTCxSwap
} from "evmlightning-sdk";
import * as BN from "bn.js";

function App() {

    const [signer, setSigner] = useState<ethers.Signer>();
    const [swapper, setSwapper] = useState<EVMSwapper>();

    const [error, setError] = useState<string>();

    const [claimableBTCLNtoEVM, setClaimableBTCLNtoEVM] = useState<IBTCxtoSolSwap<any>[]>();
    const [refundableEVMtoBTCLN, setRefundableEVMtoBTCLN] = useState<ISolToBTCxSwap<any>[]>();

    useEffect(() => {

        if(signer==null) return;

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
            } catch (e) {
                console.error(e)
            }

        })();

    }, [signer]);

    return (
        <div className="App">
            <header className="App-header text-black">
                <Card bg="light">
                    <Card.Body>
                        {swapper!=null ? (
                            <>
                                {claimableBTCLNtoEVM!=null && claimableBTCLNtoEVM.length>0 ? (
                                    <Card className="p-3">
                                        <Card.Title>Incomplete swaps (BTCLN-{'>'}EVM)</Card.Title>
                                        <Card.Body>
                                            {claimableBTCLNtoEVM.map((e,index) => {
                                                if(e instanceof BTCLNtoSolSwap) {
                                                    return (
                                                        <BTCLNtoEVMClaim key={index} signer={signer} swap={e} onError={setError} onSuccess={() => {
                                                            setClaimableBTCLNtoEVM(prevState => {
                                                                const cpy = [...prevState];
                                                                cpy.splice(index, 1);
                                                                return cpy;
                                                            });
                                                        }}/>
                                                    );
                                                }
                                                if(e instanceof BTCtoSolNewSwap) {
                                                    return (
                                                        <BTCtoEVMClaim key={index} signer={signer} swap={e} onError={setError} onSuccess={() => {
                                                            setClaimableBTCLNtoEVM(prevState => {
                                                                const cpy = [...prevState];
                                                                cpy.splice(index, 1);
                                                                return cpy;
                                                            });
                                                        }}/>
                                                    );
                                                }
                                            })}
                                        </Card.Body>
                                    </Card>
                                ) : ""}
                                {refundableEVMtoBTCLN!=null && refundableEVMtoBTCLN.length>0 ? (
                                    <Card className="p-3">
                                        <Card.Title>Incomplete swaps (EVM-{'>'}BTCLN)</Card.Title>
                                        <Card.Body>
                                            {refundableEVMtoBTCLN.map((e,index) => {
                                                return (
                                                    <EVMtoBTCLNRefund swapper={swapper} key={index} signer={signer} swap={e} onError={setError} onSuccess={() => {
                                                        setRefundableEVMtoBTCLN(prevState => {
                                                            const cpy = [...prevState];
                                                            cpy.splice(index, 1);
                                                            return cpy;
                                                        });
                                                    }} onRefunded={() => {
                                                        setRefundableEVMtoBTCLN(prevState => {
                                                            const cpy = [...prevState];
                                                            cpy.splice(index, 1);
                                                            return cpy;
                                                        });
                                                    }}/>
                                                )
                                            })}
                                        </Card.Body>
                                    </Card>
                                ) : ""}
                                <SwapTab signer={signer} swapper={swapper}/>
                            </>
                        ) : (
                            <div>
                                Please connect your wallet!
                                <WalletTab callback={(signer) => setSigner(signer)}/>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </header>
        </div>
    );
}

export default App;
