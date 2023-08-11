chrome.runtime.onInstalled.addListener(() => {
  console.log('I just installed my chrome exteniosn');
});

//wawnt to read all the data send from the contentScript
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log(request);
  getImagesFromPage(request);
  return true;
});

function getImagesFromPage(data) {
  // Open a connection to the database
  const request = indexedDB.open('myFacebookStore', 1);

  // Set up the database schema
  request.onupgradeneeded = function (event: any) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('myFacebookStore', {
      keyPath: 'id',
    });
    console.log(objectStore);
  };

  // Save the data to the database
  request.onsuccess = function (event: any) {
    const db = event.target.result;
    const transaction = db.transaction(['myFacebookStore'], 'readwrite');
    const objectStore = transaction.objectStore('myFacebookStore');

    objectStore.add(data);
  };
}
