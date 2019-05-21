// Hello World => Messages
var client = new Object();
var msg_list = getId('msg-list');
var user_list = getId('user-list');
// READY
client.ready = function (data) {
  getId("status").innerHTML = data.user.username + "#" + data.user.discriminator;
}
// MESSAGE_CREATE
client.message_create = function(msg) {
  if (msg.webhook_id && msg.guild_id == 460140902103515143) return {};
  let message = document.createElement("pre");
  message.innerHTML = '[<a href="discord://open/channels/{3}/{2}/{4}">{0}</a>] {1}'.format(
    msg.author.username, msg.content, msg.channel_id, msg.guild_id || "@me", msg.id);
  if(!msg.guild_id)
    message.classList = "private";
  msg_list.prepend(message);
  if (msg_list.childElementCount > 150)
    msg_list.removeChild(msg_list.lastChild);
}
// Event Dispatch
function handler(request, sender, sendResponse) {
  let selected = client[(request.t || "").toLowerCase()];
  return selected ? selected(request.d) : {};
}; chrome.runtime.onMessage.addListener(handler);
// Load Engine
var engine = chrome.extension.getBackgroundPage(), state = engine.state;
  if (engine.state.ready) client.ready(engine.state);
// Fucking Configuration Modal
getId("config-data").onsubmit = () => {
  engine.api.register((getName("isBot").checked ? "Bot "
    : "") + getName("token").value); return false;
}; getId("config-toggle").onclick = () => {
  getId("config-modal").hidden ^= 1;
};
// Cunt off for now
var length = x => Object.keys(state.authored[x]).length;
function sort_posters(){
  user_list.innerHTML = "";
  var result = Object.keys(state.authored);
  result.sort((a,b) => length(b) - length(a));
  for(i in result) {
    let key = result[i], name = (state.users[key] || {}).username;
      if (i > 25 || length(key) < 1) break;
    let user = document.createElement("pre");
    user.innerHTML = "[{0}] #{1} <br>".format(name, length(key));
      user_list.append(user);
  } user_list.classList.add("active");
}//sort_posters();
