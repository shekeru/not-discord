//Base Library Logic
var system = new Object(),
  state = new Object();
system.ready = function(data){
  state.messages = state.message || {};
  state.guilds = data.guilds;
  state.user = data.user;
};
system.guild_create = function(msg){
  for(let i = 0; i < state.guilds.length; i++)
    if(state.guilds[i].id == msg.id) {
      state.guilds[i] = msg; break;
    }
};
var msg_list = html('messages');
system.message_create = function(msg){
  if (msg.webhook_id && msg.guild_id == 460140902103515143)
    return 0;
  let keys = Object.keys(state.messages);
  if (keys.length > 35) {
    msg_list.removeChild(msg_list.lastChild);
    delete state.messages[keys[0]];
  } state.messages[msg.id] = msg;
  let message = document.createElement("pre");
  message.innerHTML = '[<a href="discord://open/channels/{3}/{2}">{0}</a>] {1}'.format(
    msg.author.username, msg.content, msg.channel_id, msg.guild_id || "@me");
  if(!msg.guild_id)
    message.classList = "private";
  msg_list.prepend(message);
};
system.message_update = () => {};
system.message_delete = () => {};
system.presence_update = () => {};
system.voice_state_update = () => {};
system.message_reaction_remove = () => {};
system.message_reaction_add = () => {};
system.guild_integrations_update = () => {};
system.sessions_replace = () => {};
