// Init Client
var api = {}, windowId = 0;
// Enable Opening
function open_panel(chromeWindow) {
  if (!chrome.runtime.lastError && chromeWindow)
    return chrome.windows.update(windowId, {focused: true});
  chrome.windows.create({
      url: chrome.runtime.getURL("tabs/chat.html"),
      type: "popup",
      focused: true,
      width: 820,
      height: 640
    }, (chromeWindow) => {windowId = chromeWindow.id});
}; chrome.browserAction.onClicked.addListener((tab) =>
  chrome.windows.get(windowId, open_panel));
// Get token?
chrome.storage.sync.get(['api_key'], function(result) {
    if(result.api_key) api = new Network(result.api_key);
});
// Install Token
function register(new_token) {
  if(new_token != api.token)
    chrome.storage.sync.set({api_key: new_token});
  if(!api) api = new Network(new_token); else {
    api.token = new_token; api.socket.close();
  }
}
