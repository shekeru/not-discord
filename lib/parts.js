export function messageHeader(msg) {
  let text = newElement(`<div></div>`);
  text.innerHTML += '[';
  text.appendChild(messageLink(msg));
  text.innerHTML += ' - ';
  text.appendChild(user(msg.author));
  text.innerHTML += ']';
  return text;
}
export function messageLink(msg) {
  let text = newElement(`<a class="external" href="discord://open/channels/${msg.guild_id
    || "@me"}/${msg.channel_id}/${msg.id}">${msg.guild_id ? state.guilds[msg.guild_id].name
    : "Direct Message"}</a>`);
  return text;
}
export function user(data){
  let text = newElement(`<a>${data.username}</a>`);
  text.addEventListener('click', () => console.log('fuck'));
  return text;
}
function newElement(string) {
  return new DOMParser().parseFromString(string, 'text/html').body.firstChild;
}; var engine = chrome.extension.getBackgroundPage(), state = engine.state;
