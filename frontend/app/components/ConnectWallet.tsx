"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";

function ConnectWallet() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                return (
                    <div className={classNames({ hidden: !mounted })}>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <div className={"flex items-center justify-center bg-[#318DFF] text-blue-950 whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer hover:text-white  transition:ease-in-out"} onClick={openConnectModal}>Connect Wallet</div>
                                );
                            }

                            return (

                                <div className={`flex items-center justify-center bg-[#318DFF] text-white whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer  transition:ease-in-out`} onClick={openAccountModal}>
                                    {account.displayName}
                                </div>

                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    )
}

export default ConnectWallet