// // Dumb from State to Storage
// function local_cache(key) =>
//   chrome.storage.local.set({[key]: info[key]});
// // Load from Storage to State
// function decache(key) =>
//   chrome.storage.local.get([key], cache => {
//     info[key] = Object.assign(cache.key || {}, info[key])
//   });
function new_info(key) {
  info[key] = info[key] || {}
}; var info = {};
// The Social Triad
new_info('relations');
new_info('accounts');
new_info('notes');
// Private Channels
new_info('directs');
new_info('groups');
new_info('guilds');
//Base Library Logic, todo: cache system
var system = new Object(),
  state = new Object();
system.ready = function(data){
  api.session = data.session_id;
  state.messages = state.messages || {};
  state.guilds = data.guilds.extend();
  state.authored = state.authored || {};
  state.users = state.users || {};
  state.user = data.user;
  state.ready = data;
  // Add Friends & Blocked, then Notes
  data.relationships.forEach(each => {
    info['relations'][each.id] = each.type
    info['accounts'][each.user.id] = each.user;
  }); Object.assign(info.notes, data.notes);
};
system.guild_create = function(msg) {
  for(let i = 0; i < state.guilds.length; i++)
    if(state.guilds[i].id == msg.id) {
      state.guilds[i] = msg; break;
    }
};
system.message_create = function(msg) {
  let keys = Object.keys(state.messages);
  if (keys.length > 3500) {
    delete state.messages[keys[0]];
  } state.messages[msg.id] = msg;
    if(msg.author.bot) return;
  state.authored[msg.author.id] = Object.merge(state.authored[msg.author.id], {[msg.id]: msg});
  state.users[msg.author.id] = Object.merge(state.users[msg.author.id], msg.author);
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
system.message_reaction_remove_all = () => {};
system.message_delete_bulk = () => {};
system.channel_pins_update = () => {};
system.channel_update = () => {};
system.channel_create = () => {};
