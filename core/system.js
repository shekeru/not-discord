// Dumb from State to Storage
function cache_info() {
  chrome.storage.local.set({['info']: info});
}; setInterval(cache_info, 30*1000);
// Load from Storage to State
function decache_info() {
  chrome.storage.local.get(['info'], cache => {
    info = Object.assign(cache.info || {}, info)
  });
}; var info = {
  messages: {},
  // Social Triad
  accounts: {},
  relations: {},
  notes: {}
}; decache_info();
//Base Library Logic, todo: cache system
var system = new Object(),
  state = new Object();
// Login Shit
system.sessions_replace = () => {};
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
//Messages
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
system.message_delete_bulk = () => {};
// Reactions
system.message_reaction_add = () => {};
system.message_reaction_remove = () => {};
system.message_reaction_remove_all = () => {};
// States
system.user_settings_update = () => {};
system.voice_state_update = () => {};
system.presence_update = () => {};
system.typing_start = () => {};
system.message_ack = () => {};
// Guilds
system.guild_create = function(msg) {
  for(let i = 0; i < state.guilds.length; i++)
    if(state.guilds[i].id == msg.id) {
      state.guilds[i] = msg; break;
    }
};
system.guild_update = () => {};
system.guild_integrations_update = () => {};
system.guild_emojis_update = () => {};
system.guild_ban_add = () => {};
// Guild Roles
system.guild_role_create = () => {};
system.guild_role_update = () => {};
system.guild_role_delete = () => {};
// Guild Memebers
system.guild_member_update = () => {};
system.guild_member_remove = () => {};
// Channels
system.channel_update = () => {};
system.channel_create = () => {};
system.channel_delete =() => {};
// Channel Pins
system.channel_pins_update = () => {};
// Voice Calls
system.call_create = () => {};
system.call_update = () => {};
system.call_delete = () => {};
