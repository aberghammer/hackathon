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



export default function SendText() {

    type PrefixedHexString = `0x${string}`;
    const [content, setContent] = useState("")
    const [hashedContent, setHashedContent] = useState<PrefixedHexString>("0x0")
    const [hashedData, setHashedData] = useState(false)
    const [myUrl, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [referenceHash, setReferenceHash] = useState<PrefixedHexString[]>([])
    const [imageData, setImageData] = useState(imageSVG)
    const { address } = useAccount();
    const [isDeploying, setIsDeploying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


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

    return (
        <main className="flex flex-col lg:flex-row items-center justify-center px-4 space-x-4 space-y-4 sm:space-y-0">
            <DeployingModal isOpen={isOpen} />
            <div className='flex flex-col justify-center bg-white lg:p-12 rounded-xl shadow-lg w-full p-8 md:1/2 lg:w-1/3'>
                <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Welcome to Our Platform</h1>
                <div className='flex flex-col'>
                    <div className="mb-8">
                        <label className='block text-gray-600 font-medium'>Enter your text here:</label>
                        <div className='h-96 text-black mb-16'>
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

            <div className='flex flex-col justify-center items-center w-full lg:w-1/3'>
                <Image src={imageData} alt="My NFT" width={800} height={800} />

            </div>
        </main>
    )

}

