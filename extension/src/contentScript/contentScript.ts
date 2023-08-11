let previousContent = '';

function getTextFromNode(node) {
  let text = '';

  // If node has shadow root, dive into it
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
  const fullContent = getTextFromNode(document.body);
  if (fullContent !== previousContent) {
    console.log(fullContent); // Log the content if it's different from before
    previousContent = fullContent;

    const regex = /\|checkmade\|\d+\|[a-zA-Z]+/g;
    let matches = fullContent.match(regex);
    if (matches) {
      matches.forEach((match) => {
        console.log(match); // Log the matched string

        replacePatternWithCheckmark(match);

        console.log('replaced...');
      });
    } else {
      console.log('no match found');
    }
  }
}

// if it is a match we replace
function replacePatternWithCheckmark(text: string) {
  // Use innerHTML to perform a global replace operation
  document.body.innerHTML = document.body.innerHTML.replace(text, '$1 ✓');
}

// Use MutationObserver to observe changes
const observer = new MutationObserver(checkForContent);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Additionally, check every 5 seconds
setInterval(checkForContent, 5000);
