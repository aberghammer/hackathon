chrome.runtime.onInstalled.addListener(() => {
  console.log('I just installed my chrome exteniosn');
});

//wawnt to read all the data send from the contentScript
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log(request);
  return true;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'getData') {
    // Do something with the request or just return data
    sendResponse({ data: "Here's the data you asked for!" });
  }

  if (request.message === 'verifyData') {
    console.log('verifyData');
    const text = request.text;
    chrome.runtime.sendMessage({ message: 'verify' }, function (response) {
      console.log('response', response);
    });
    sendResponse({
      data: `We verified the following data: ${text}  and its correct!`,
    });
  }
});
