"use client"
import Image from 'next/image'
import TextBoxComponent from './TextBox'
import { useAccount, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { checkMadeSolABI } from "@/app/config/generated"
import { checkMateSolABI } from "@/app/config/generated"
import { useEffect, useState } from 'react'
import { EnterDescription } from './EnterDescription'

import { useContractRead } from 'wagmi'
import EnterUrl from './EnterUrl'
import { readContract } from '@wagmi/core'
import { imageSVG } from '../config/defaultImage'
import DeployingModal from './Modal'
import useIsSSR from '../Hooks/SSRHook'



export default function SendText() {

    type PrefixedHexString = `0x${string}`;
    const [content, setContent] = useState("")
    const [hashedContent, setHashedContent] = useState<PrefixedHexString>("0x0")
    const [hashedData, setHashedData] = useState(false)
    const [myUrl, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [referenceHash, setReferenceHash] = useState<PrefixedHexString[]>([])
    const [imageData, setImageData] = useState(imageSVG)
    const { address, isConnected } = useAccount();
    const [isDeploying, setIsDeploying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isSSR = useIsSSR()


    const network: PrefixedHexString | "" = process.env.NEXT_PUBLIC_ZKSYNC_MAIN
        ? process.env.NEXT_PUBLIC_ZKSYNC_MAIN as PrefixedHexString
        : "0x0";

    const networkNFT: PrefixedHexString | "" = process.env.NEXT_PUBLIC_ZKSYNC_NFT
        ? process.env.NEXT_PUBLIC_ZKSYNC_NFT as PrefixedHexString
        : "0x0";




    const { config, error, isError } = usePrepareContractWrite({
        address: network,
        abi: checkMadeSolABI,
        functionName: 'createCheckWithMetaData',
        args: [hashedContent, myUrl, description, referenceHash],
        onError(error) {
            // console.log('Error', error)
        },
    })


    const contractWrite = useContractWrite(config)
    const { data: loadingData, isSuccess: successLoading, isError: loadingError, isLoading: loadingLoading } = useWaitForTransaction({
        hash: contractWrite.data?.hash,
        onSuccess(data) {
            console.log('Success', data)
            setIsOpen(false);
            getImageData()
        },
    })




    useEffect(() => {
        if (loadingLoading) {
            setIsOpen(true)
        }
        else {
            setIsOpen(false)
        }
    }, [loadingLoading])







    const getImageData = async () => {
        try {

            console.log("address", address)

            if (!address)
                return;
            const nftData = await readContract({
                address: networkNFT,
                abi: checkMateSolABI,
                functionName: "getOwnedTokenId",
                args: [address]
            })

            console.log("nftData", nftData)
            if (!nftData)
                return

            const tokenImage = await readContract({

                address: networkNFT,
                abi: checkMateSolABI,
                functionName: "generateCharacter",
                args: [nftData]
            })

            console.log("tokenImage", tokenImage)
            if (!tokenImage)
                return

            console.log(tokenImage)
            setImageData(tokenImage)
        }
        catch (error) {
            console.log("error")
            console.log(error)
        }
    }

    useEffect(() => {

        getImageData();


    }, [])






    const hashContent = async () => {
        if (content == "") { return }
        console.log("read contract")
        const data = await readContract({
            address: network,
            abi: checkMadeSolABI,
            functionName: 'hashString',
            args: [content]
        })
        if (data) {
            setHashedContent(data)
            setHashedData(true)
        }
    }

    const updateContent = (value: string) => {
        setHashedData(false);
        setContent(value);
    };





    let submitButton;
    if (hashedData) {
        submitButton = <button className="bg-[#318DFF] text-white whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer  transition:ease-in-out" onClick={() => {
            //@ts-ignore
            contractWrite?.write()
        }}>Submit</button>;
    } else {
        submitButton = <button className="bg-[#318DFF] text-white whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer  transition:ease-in-out" onClick={() => hashContent()}>Hash Content</button>;
    }


    if (isSSR) {
        return (<div></div>)
    }

    return (
        <main className="flex flex-row items-center justify-center px-4 space-x-4  sm:space-y-0 ">
            < DeployingModal isOpen={isOpen} />
            {isConnected ? (

                <div className='flex flex-row  flex-wrap items-center justify-center  space-x-5 space-y-5'>

                    <div className='flex justify-center bg-white  rounded-xl shadow-lg p-8  '>

                        {/* Form Component */}
                        <div className='flex flex-col '>
                            <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Welcome to Our Platform</h1>
                            <div className="mb-8">
                                <label className='block text-gray-600 font-medium'>Enter your text here:</label>
                                <div className='h-72 text-black mb-16'>
                                    <TextBoxComponent value={content} onChange={updateContent} />
                                </div>
                            </div>
                            <div className='h-16 mb-8'>
                                <label className='block text-gray-600 font-medium'>Description:</label>
                                <EnterDescription value={description} onChange={setDescription} />
                            </div>
                            <div className="mb-16">
                                <label className='block text-gray-600 font-medium'>URL:</label>
                                <EnterUrl value={myUrl} onChange={setUrl} />
                            </div>
                            {submitButton}
                        </div>


                    </div>

                    {/* Image Part */}
                    <div className='flex flex-col justify-center items-center'>
                        <Image src={imageData} alt="My NFT" width={600} height={600} />
                    </div>
                </div>




            ) : (<div className='h-96 flex justify-center items-center text-4xl'>Please connect your wallet first.</div>)

            }
        </main >
    )

}

