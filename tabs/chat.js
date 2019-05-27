import * as html from '/lib/parts.js';
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
  if (msg.webhook_id && msg.guild_id == 460140902103515143) return;
  let message = document.createElement("pre");
  if(!msg.guild_id) message.classList = "private";
  message.appendChild(html.messageHeader(msg));
  message.appendChild(html.messageBody(msg));
  // for(let i = 0; i<msg.attachments.length; i++)
  //   message.innerHTML += '<div>'+i+' : '+msg.attachments[i].filename+'</div>';
  if(msg_list.childElementCount > 450)
    msg_list.removeChild(msg_list.lastChild);
  msg_list.prepend(message);
}
// Event Dispatch
function handler(request, sender, sendResponse) {
  let selected = client[(request.t || "").toLowerCase()];
  return selected ? selected(request.d) : {};
}; chrome.runtime.onMessage.addListener(handler);
// Load Engine
if (engine.state.ready) client.ready(engine.state);
// Fucking Configuration Modal
getId("config-data").onsubmit = () => {
  engine.register((getInput("isBot").checked ? "Bot "
    : "") + getInput("token").value); return false;
}; getId("config-toggle").onclick = () => {
  getInput("token").defaultValue = engine.api.token;
  getId("config-modal").hidden ^= 1;
};
// Cunt off for now
//var length_a = x => Object.keys(state.authored[x]).length;
function sort_posters(){
  user_list.innerHTML = "";
  var result = Object.keys(state.authored);
  result.sort((a,b) => length_a(b) - length_a(a));
  for(i in result) {
    let key = result[i], name = (info.users[key] || {}).username;
      if (i > 30 || length_a(key) < 1) break;
    let user = document.createElement("pre");
    user.innerHTML = "[{0}] #{1} <br>".format(name, length_a(key));
      user_list.append(user);
  }
}; getId("stats-toggle").onclick = () => {
  if(!(getId("user-list").hidden ^= 1))
    sort_posters();
};
// Kinda Bored
getId("open-friends").onclick = () => {
  chrome.windows.create({
      url: chrome.runtime.getURL("tabs/friends.html"),
      type: "popup",
      width: 240,
      height: 480
  })
};
//Resolve User
function resolve_user(match, capture){
  let user = info.accounts[capture];
  return "<i>{0}</i>".format(user.username);
}
engine.info.messages.emit(25).forEach((msg_id) =>
  client.message_create(engine.info.messages[msg_id])
);
