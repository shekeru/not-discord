// Init Logic Structure
var engine = chrome.extension.getBackgroundPage(),
  info = engine.info, client = new Object();
// Init Panel Structure

// Main
for(uId in info.relations)
  document.body.innerHTML += info.accounts[uId].username + '<br>';
