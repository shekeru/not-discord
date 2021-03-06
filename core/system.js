// Dumb from State to Storage
function cache_info() {
  chrome.storage.local.set({['info']: info});
}; //setInterval(cache_info, 30*1000);
// Load from Storage to State
function decache_info() {
  chrome.storage.local.get(['info'], cache => {
    info = Object.assign(cache.info || {}, info)
  });
}; var info = {
  msg_by_user: dict(),
  messages: dict(),
  // Social Triad
  accounts: dict(),
  relations: dict(),
  notes: dict()
}; //decache_info();
//Base Library Logic, todo: cache system
var system = new Object(),
  state = new Object();
// Login Shit
system.sessions_replace = () => {};
system.resumed = () => {};
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
system.user_update = () => {};
//Messages
system.message_create = function(msg) {
  if(msg.author.bot) return;
  //state.authored[msg.author.id] = Object.merge(state.authored[msg.author.id], {[msg.id]: msg});
  //state.users[msg.author.id] = Object.merge(state.users[msg.author.id], msg.author);

  // New Message System
  info.msg_by_user[msg.author.id][msg.id] = info.messages[msg.id] = msg;
  info.messages.limit(750); info.msg_by_user[msg.author.id].limit(35);
  msg.mentions.forEach(user => info.accounts[user.id] = user);
  info.accounts[msg.author.id] = msg.author;
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
system.guild_create = () => {};
system.guild_update = () => {};
system.guild_delete = () => {};
system.guild_integrations_update = () => {};
system.guild_emojis_update = () => {};
system.guild_ban_add = () => {};
system.guild_ban_remove = () => {};
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
system.channel_pins_ack = () => {};
system.channel_pins_update = () => {};
// Voice Calls
system.call_create = () => {};
system.call_update = () => {};
system.call_delete = () => {};
//Misc
system.gift_code_update = () => {};
system.user_guild_settings_update = () => {};
system.webhooks_update = () => {};
