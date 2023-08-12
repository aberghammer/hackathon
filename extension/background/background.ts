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

    fetchData(text).then((result) => {
      console.log(result);
      let data = JSON.parse(result);
      if (data.data == '0x0000000000000000000000000000000000000000') {
        data.data = 'No signed data found';
        data.metadata[0] = 'not';
        data.metadata[1] = 'signed';
      }
      sendResponse({
        data: `We verified the following data: ${text} and got back ${result}!`,
        result: data,
      });
    });
    return true; // Keeps the message channel open for asynchronous response
  }
});

async function fetchData(text) {
  const response = await fetch(
    `http://localhost:4000/verify/verifyString/${text}`
  );
  console.log(response);
  const data = await response.text(); // Parse the result as JSON
  return data;
}

chrome.contextMenus.onClicked.addListener(genericOnClick);

//@ts-ignore
function genericOnClick(info) {
  switch (info.menuItemId) {
    case 'radio':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked);
      break;
    case 'checkbox':
      // Checkbox item function
      console.log('Checkbox item clicked. Status:', info.checked);
      break;
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }
}

chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    'page',
    'selection',
    'link',
    'editable',
    'image',
    'video',
    'audio',
  ];
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    let title = 'Interact with the verification';
    chrome.contextMenus.create({
      title: title,
      //@ts-ignore
      contexts: [context],
      id: context,
    });
  }

  // Create a parent item and two children.
  let parent = chrome.contextMenus.create({
    title: 'Test parent item',
    id: 'parent',
  });

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  chrome.contextMenus.create(
    { title: 'Oops', parentId: 999, id: 'errorItem' },
    function () {
      if (chrome.runtime.lastError) {
        console.log('Got expected error: ' + chrome.runtime.lastError.message);
      }
    }
  );
});
