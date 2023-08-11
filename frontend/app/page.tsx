import Image from 'next/image'
import ConnectWallet from './components/ConnectWallet'

export default function Home() {
  return (
    <main className="">
      <div className='flex justify-end items-center mt-[19px] font-semibold mr-[58px]'>
        <ConnectWallet />
      </div>
    </main>
  )
}
