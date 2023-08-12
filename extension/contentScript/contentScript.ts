let previousContent = '';

console.log('version 2.0.0');

// Add the highlight style once
const style = document.createElement('style');
style.textContent = `
.highlight {
    background-color: yellow;
    cursor: pointer;

}
.pop {
  display: none;
  position: absolute;
  top: 100%;
  left: 5; /* Center the popup relative to the highlight element */
  color: white;
  background-color: rgba(0,0,0,0.85); /* Semi-transparent black for a modal-like feel */
  border: none;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* Add a subtle shadow for depth */
  border-radius: 8px;
  max-width: 400px; /* Set a maximum width for the popup */
  text-align: center; /* Center the text */
  z-index: 1000;
  margin-top: -1px;
  flex-direction: column;
  white-space: nowrap; /* Prevents the text from wrapping */
  overflow: hidden; /* In conjunction with white-space, this ensures the popup does not overflow */
  text-overflow: ellipsis; /* Adds ellipsis if the text is too long */
}

.highlight:hover .pop {
  display: flex;
  animation: fadeIn 0.3s; 

}
.pop .main-entry {
  font-weight: bold; /* Make the main entry bold */
  margin-bottom: 10px; /* Add some space below the main entry */
  display: flex; /* Makes the span behave like a block, so the details div will be on the next line */
  flex: column;
}

.pop .details {
  margin-top: 8px; /* Add some space above the details for separation */
}

.pop .description {
  color: #FFD700; /* Change the color for description, maybe a gold color */
}

.pop .metadata {
  color: #ADFF2F; /* Change the color for metadata, maybe a green-yellow color */
}
.pop .url {
  margin: 5px;
  color: #ADFF2F; /* Change the color for metadata, maybe a green-yellow color */
  text-decoration: none;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  background-color: #333;
}

`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function () {
  let bodyContent = document.body.innerText;
  console.log(bodyContent);
});

function getTextFromNode(node) {
  let text = '';

  if (node.shadowRoot) {
    text += getTextFromNode(node.shadowRoot);
  }

  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      text += getTextFromNode(child);
    }
  }

  return text;
}
let loaded = false;
function checkForContent() {
  observer.disconnect(); // Pause observing

  const fullContent = getTextFromNode(document.body);
  if (fullContent !== previousContent) {
    if (loaded) {
      return;
    }

    previousContent = fullContent;

    const regex = /¸([^¸]+)¸/g;

    let matches = fullContent.match(regex);
    console.log(matches);
    if (matches) {
      matches.forEach((match) => {
        console.log(match);

        chrome.runtime.sendMessage(
          { message: 'verifyData', text: match },
          function (response) {
            console.log('response', response);
            console.log(response.data);

            document.body.innerHTML = document.body.innerHTML.replace(
              match,
              '<span class="highlight">' +
                match.trim() +
                '<a href="https://google.com" target="_blank"><img src="https://bafkreigvd3kbgras4ctky2agxeqtxbpa54hgkisw5tpmxv4kvazhfbvl3u.ipfs.nftstorage.link/" class="margin-left:2px" width="14" height="14" /> </a>' +
                '<span class="pop"><span class="main-entry">' +
                response.result?.data +
                '</span><div class="details"><span class="description">' +
                response.result?.metadata[0] +
                '' +
                response.result?.metadata[1] +
                '</span></div></span>'
            );
          }
        );
      });
      loaded = true;
    } else {
      console.log('no match found');
    }
  }

  if (!loaded) {
    observer.observe(document.body, { childList: true, subtree: true }); // Resume observing
  }
}

const observer = new MutationObserver(checkForContent);
observer.observe(document.body, { childList: true, subtree: true });

// Using setTimeout instead of setInterval
function checkAgain() {
  if (loaded) {
    console.log('Content already processed. Stopping further checks.');
    return; // If content is already processed, stop further checks
  }
  checkForContent();
  setTimeout(checkAgain, 5000);
}

if (!loaded) {
  checkAgain();
}

(() => {
  let url = '';
  chrome.runtime.sendMessage({ message: 'getData' }, function (response) {
    console.log('response', response);
    url = response.data;
  });
})();

//enable window.ethereum

// Make a simple request:

// Make a simple request:
