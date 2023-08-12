let previousContent = '';

console.log('version 2.0.0');

// Add the highlight style once
const style = document.createElement('style');
style.textContent = `
.highlight {
    background-color: yellow;
    /* any other styles you want to apply */
}`;
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

function checkForContent() {
  observer.disconnect(); // Pause observing

  const fullContent = getTextFromNode(document.body);
  if (fullContent !== previousContent) {
    console.log('v1');

    previousContent = fullContent;
    const regex = /«[^»]+»/g;

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
          }
        );
      });
    } else {
      console.log('no match found');
    }
  }

  observer.observe(document.body, { childList: true, subtree: true }); // Resume observing
}

const observer = new MutationObserver(checkForContent);
observer.observe(document.body, { childList: true, subtree: true });

// Using setTimeout instead of setInterval
function checkAgain() {
  checkForContent();
  setTimeout(checkAgain, 5000);
}
checkAgain();

(() => {
  let url = '';
  chrome.runtime.sendMessage({ message: 'getData' }, function (response) {
    console.log('response', response);
    url = response.data;
  });
})();
