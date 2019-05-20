// Hello World => Messages
var client = new Object();
var msg_list = html('messages');
// MESSAGE_CREATE
client.message_create = function(msg) {
  if (msg.webhook_id && msg.guild_id == 460140902103515143) return {};
  let message = document.createElement("pre");
  message.innerHTML = '[<a href="discord://open/channels/{3}/{2}">{0}</a>] {1}'.format(
    msg.author.username, msg.content, msg.channel_id, msg.guild_id || "@me");
  if(!msg.guild_id)
    message.classList = "private";
  msg_list.prepend(message);
}
// Event Dispatch
function handler(request, sender, sendResponse) {
  let selected = client[(request.t || "").toLowerCase()];
  return selected ? selected(request.d) : {};
}; chrome.runtime.onMessage.addListener(handler);
// Load Engine
var engine = chrome.extension.getBackgroundPage();
html("status").innerHTML = engine.state.user.username + "#" + engine.state.user.discriminator;
html("status").onclick = () => chrome.tabs.create({url: chrome.runtime.getURL("pages/client.html")});
