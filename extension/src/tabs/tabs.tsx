import React from 'react';
import './tabs.css';

function Tabs() {
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

  const sendMessage = () => {
    console.log('sending message');
  };

  return (
    <>
      <div className="w-[200px] p-8">
        <div className="flex flex-col gap-8">
          <span>Reference</span>
          <button
            id="myButton"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendMessage}
          >
            Get Data
          </button>
        </div>
      </div>
    </>
  );
}

export default Tabs;
