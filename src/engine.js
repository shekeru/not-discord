// Init Client
var api = new Network(TOKEN);
var windowId = 0;
// Enable Opening
function open_panel(chromeWindow) {
  if (!chrome.runtime.lastError && chromeWindow)
    return chrome.windows.update(windowId, {focused: true});
  chrome.windows.create({
      url: chrome.runtime.getURL("pages/client.html"),
      type: "popup",
      focused: true,
      width: 820,
      height: 640
    }, (chromeWindow) => {windowId = chromeWindow.id});
}; chrome.browserAction.onClicked.addListener((tab) =>
  chrome.windows.get(windowId, open_panel));
