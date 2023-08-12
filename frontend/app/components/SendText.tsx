"use client"
import Image from 'next/image'
import TextBoxComponent from './TextBox'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { checkMadeSolABI } from "@/app/config/generated"
import { useEffect, useState } from 'react'
import { EnterDescription } from './EnterDescription'

import { useContractRead } from 'wagmi'
import EnterUrl from './EnterUrl'
import { readContract } from '@wagmi/core'



export default function SendText() {

    type PrefixedHexString = `0x${string}`;
    const [content, setContent] = useState("")
    const [hashedContent, setHashedContent] = useState<PrefixedHexString>("0x0")
    const [hashedData, setHashedData] = useState(false)
    const [myUrl, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [referenceHash, setReferenceHash] = useState<PrefixedHexString[]>([])


    const network: PrefixedHexString | "" = process.env.NEXT_PUBLIC_ZKSYNC
        ? process.env.NEXT_PUBLIC_ZKSYNC as PrefixedHexString
        : "0x0";


    const { config, error, isError } = usePrepareContractWrite({
        address: network,
        abi: checkMadeSolABI,
        functionName: 'createCheckWithMetaData',
        args: [hashedContent, myUrl, description, referenceHash],
        onError(error) {
            console.log('Error', error)
        },
    })


    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    const writeContract = () => {
        write?.()

    }

    useEffect(() => {
        setHashedData(false);
    }, [isSuccess])





    // const { data, isError: isReadingError, isLoading: isLoadingError } = useContractRead({
    //     address: network,
    //     abi: checkMadeSolABI,
    //     functionName: 'hashString',
    //     args: [content]

    // })


    const hashContent = async () => {
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


    // useEffect(() => {
    //     if (data) {
    //         setHashedContent(data)
    //     }
    // }, [data])

    let submitButton;
    if (hashedData) {
        submitButton = <button className="bg-[#318DFF] text-white whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer  transition:ease-in-out" onClick={() => { write?.() }}>Submit</button>;
    } else {
        submitButton = <button className="bg-[#318DFF] text-white whitespace-nowrap py-[12px] px-[13px] rounded-md text-center text-base cursor-pointer  transition:ease-in-out" onClick={() => hashContent()}>Hash Content</button>;
    }

    return (
        <main className="min-h-screen  flex items-center justify-center px-4 py-12">
            <div className='flex flex-col justify-center bg-white p-12 rounded-xl shadow-lg'>
                <h1 className="text-2xl font-bold mb-8 text-center text-blue-900">Welcome to Our Platform</h1>
                <div className='flex flex-col space-y-4'>
                    <div className="space-y-2">
                        <label className='block text-gray-600 font-medium'>Enter your text here:</label>
                        <div className='h-96 text-black'>
                            <TextBoxComponent value={content} onChange={updateContent} />
                        </div>
                    </div>
                    <div className='h-24 space-y-2'>
                        <label className='block text-gray-600 font-medium'>Description:</label>
                        <EnterDescription value={description} onChange={setDescription} />
                    </div>
                    <div className="space-y-2">
                        <label className='block text-gray-600 font-medium'>URL:</label>
                        <EnterUrl value={myUrl} onChange={setUrl} />
                    </div>
                    {submitButton}
                </div>

            </div>

            <div>
                <Image src="/my-icon.svg" alt="My Icon" width={100} height={100} />
            </div>
        </main>
    )

}

