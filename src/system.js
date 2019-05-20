//Base Library Logic
var system = new Object(),
  state = new Object();
system.ready = function(data){
  state.messages = state.message || {};
  state.guilds = data.guilds;
  state.user = data.user;
};
system.guild_create = function(msg) {
  for(let i = 0; i < state.guilds.length; i++)
    if(state.guilds[i].id == msg.id) {
      state.guilds[i] = msg; break;
    }
};
system.message_create = function(msg) {
  let keys = Object.keys(state.messages);
  if (keys.length > 350) {
    delete state.messages[keys[0]];
  } state.messages[msg.id] = msg;
};
system.message_update = () => {};
system.message_delete = () => {};
system.presence_update = () => {};
system.voice_state_update = () => {};
system.message_reaction_remove = () => {};
system.message_reaction_add = () => {};
system.guild_integrations_update = () => {};
system.sessions_replace = () => {};
system.guild_role_update = () => {};
system.guild_emojis_update = () => {};
