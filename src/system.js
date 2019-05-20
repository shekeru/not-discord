//Base Library Logic
var system = new Object(),
  state = new Object();
system.ready = function(data){
  api.session = data.session_id;
  state.messages = state.messages || {};
  state.guilds = data.guilds.extend();
  state.user = data.user;
  state.ready = data;
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
system.user_settings_update = () => {};
system.typing_start = () => {};
system.message_ack = () => {};
system.system.message_reaction_remove_all = () => {};
