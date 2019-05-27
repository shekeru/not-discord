export function messageHeader(msg) {
  let text = createElement('DIV');
  text.appendChild(newText('['));
  text.appendChild(messageLink(msg));
  text.appendChild(newText(" - "));
  text.appendChild(user(msg.author));
  text.appendChild(newText(']'));
  return text;
}
export function messageBody(msg) {
  let node = createElement('DIV');
  if (msg.content)
    node.appendChild(newText('&nbsp;'+msg.content));
  return node;
}
export function messageLink(msg) {
  let text = newElement(`<a class="external" href="discord://open/channels/${msg.guild_id
    || "@me"}/${msg.channel_id}/${msg.id}">${msg.guild_id ? state.guilds[msg.guild_id].name
    : "Direct Message"}</a>`);
  return text;
}
export function user(data){
  let text = newElement(`<a>${data.username}</a>`);
  text.onclick = () => console.log('fuck');
  return text;
}
function newElement(string){
  return new DOMParser().parseFromString(string, 'text/html').body.firstChild;
}
function newText(string){
  return newElement(`<span>${string}</span>`);
}
