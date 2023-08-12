import { Contract, Wallet, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './tabs.css';
const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'CheckCreated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_hash', type: 'bytes32' },
      { internalType: 'string', name: '_url', type: 'string' },
    ],
    name: 'addContentUrlToCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_hash', type: 'bytes32' },
      { internalType: 'string', name: '_description', type: 'string' },
    ],
    name: 'addDescriptionToCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_hash', type: 'bytes32' },
      {
        internalType: 'bytes32[]',
        name: '_referenceHashes',
        type: 'bytes32[]',
      },
    ],
    name: 'addReferenceHashesToCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'checkMate',
    outputs: [
      { internalType: 'contract CheckMate', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'createCheck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_hash', type: 'bytes32' },
      { internalType: 'string', name: 'url', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'bytes32[]', name: 'referenceHashes', type: 'bytes32[]' },
    ],
    name: 'createCheckWithMetaData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'getContentUrlForCheck',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'getDescriptionForCheck',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'getMetaDataForCheck',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'contentUrl', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          {
            internalType: 'bytes32[]',
            name: 'referenceHashes',
            type: 'bytes32[]',
          },
        ],
        internalType: 'struct CheckMade.CheckMetaData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'getReferenceHashesForCheck',
    outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
    name: 'getSignerAddressForCheck',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '_content', type: 'bytes' }],
    name: 'hashBytes',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_content', type: 'string' }],
    name: 'hashString',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'hashToAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'hashToCheckMetaData',
    outputs: [
      { internalType: 'string', name: 'contentUrl', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_checkMate', type: 'address' }],
    name: 'setCheckMate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

function Tabs() {
  const [wallet, setWallet] = useState<any>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('message');

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(request);
    if (request.type === 'verify') {
      // handle the highlighted parts
      console.log('verify me with content');
      sendResponse({ status: 'received' });
    }
  });

  useEffect(() => {
    chrome.storage.local.get(['wallet'], function (result) {
      console.log('Value currently is ' + result.wallet);
      setWallet(result.wallet);
    });

    chrome.runtime.onMessageExternal.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.openUrlInEditor) console.log(request.openUrlInEditor);
    });
  }, []);

  const sendMessage = () => {
    window.alert('send message');
  };

  //sign message
  const signMessage = async () => {
    //get wallet
    //setup provider
    //sign message
    const zkEvm =
      'https://rpc.eu-north-1.gateway.fm/v4/polygon-zkevm/archival/testnet';
    //send message

    const provider = new ethers.JsonRpcProvider(zkEvm);
    const balance = await provider.getBalance('ethers.eth');
    console.log(balance);
    const signer = wallet.connect(provider);
    const contractAddress = '0x0B9AF97cdC5d51581a732B4835E7995eADc8e704';
    const contract = new Contract(contractAddress, abi, signer);
    const tx = await contract.hashString(message);
    console.log(tx);
  };

  const createWallet = () => {
    const wallet = Wallet.createRandom();
    chrome.storage.local.set({ wallet: wallet }).then(() => {
      console.log('Value is set to ' + wallet);
    });
    setWallet(wallet);
  };

  const changeColor = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      greeting: 'hello',
    });
    // do something with response here, not outside the function
    console.log(response);
  };

  return (
    <>
      <div className="w-[200px] p-8">
        <div className="flex flex-col gap-8">
          {wallet ? (
            <>
              <span>{message}</span>
              <button className="background-color:green" onClick={signMessage}>
                Sign Message
              </button>
            </>
          ) : (
            <button
              id="myButton"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={createWallet}
            >
              Create wallet
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Tabs;
