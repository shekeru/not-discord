var elem = document.getElementById.bind(document);
if (localStorage.getItem('prev_token'))
  elem("token").defaultValue = localStorage.getItem('prev_token');
elem("status").innerHTML = "Waiting...";
function disconnect(state) {
  clearInterval(pacemaker);
  clearInterval(decrementer);
  if (state == "0") {
    elem("typing-status").innerHTML = "Disconnected.";
  }
  socket.close();
  elem("status").innerHTML = "Waiting...";
  elem("connection").classList = "";
  elem("server-list").classList = "";
  elem("user-float").classList = "rainbow";
  elem("theme").innerHTML = "";
  let j = elem("server-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    elem("server-list").removeChild(elem("server-list").childNodes[0]);
  }
  j = elem("msg-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    elem("msg-list").removeChild(elem("msg-list").childNodes[0]);
  }
}
function heartbeat() {
  socket.send(JSON.stringify({"op":1,"d":{}}));
  beating = 0;
  setTimeout(reconnect, 5000);
}
function reconnect() {
  if (beating == 0) {
    socket.send(JSON.stringify({
      "op": 6,
      "d": {
        "token": clientToken,
        "session_id": sessionId,
        "seq": s
      }
    }));
  }
}
function decrement() {
  for (var i = 0; i < Object.keys(typing_users).length; i++) {
    typing_users[Object.keys(typing_users)[i]] -= 1;
    if (typing_users[Object.keys(typing_users)[i]] == 0) {
      elem("typing-status").innerHTML = Object.keys(typing_users).length + " users are typing.";
      delete typing_users[Object.keys(typing_users)[i]];
    }
  }
}
function connect() {
  socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
  guilds = {};
  user_id = "";
  ignoredGuilds = {};
  ignoredChannels = {};
  ignoredUsers = {};
  highlighted = {};
  typing_users = {};
  beating = 1;
  s = 0;
  clientToken = elem("token").value;
  elem("connection").classList += "active";
  elem("server-list").classList += " active";
  elem("user-float").classList += " active";
  elem("status").innerHTML = "Connecting...";
  elem("typing-status").innerHTML = Object.keys(typing_users).length + " users are typing.";
  socket.onmessage = function(event) {
    let recv = JSON.parse(event.data);
    s = recv.s;
    switch (recv.op) {
      case 0:
        if (recv.t === "MESSAGE_CREATE" && recv.d.content !== "") {
          if (!ignoredGuilds["g" + recv.d.guild_id]) {
            let string = document.createElement("DIV");
            let username = document.createElement("SPAN");
            let discriminator = document.createElement("SPAN");
            let guild = document.createElement("SPAN");
            let message = document.createElement("SPAN");
            string.id = "g" + recv.d.guild_id;
            username.id = "username";
            discriminator.id = "discriminator";
            guild.id = "guild";
            message.id = "message";
            username.append(recv.d.author.username);
            discriminator.append(recv.d.author.discriminator);
            if (recv.d.guild_id) {
              for (var i = 0; i < Object.keys(guilds).length; i++) {
                if (Object.keys(guilds)[i] == recv.d.guild_id) {
                  guild.append(guilds[recv.d.guild_id]);
                  i = guilds.length;
                }
              }
            } else {
              guild.append("PM");
              message.classList = "private";
            }
            for (var i = 0; i < Object.keys(recv.d.mentions).length; i++) {
              if (recv.d.mentions[i].id == user_id) {
                message.classList = "highlight";
                i = Object.keys(recv.d.mentions).length;
              }
            }
            message.append(recv.d.content);
            string.append(username);
            string.append("#");
            string.append(discriminator);
            string.append("elem");
            string.append(guild);
            string.append(": ");
            string.append(message);
            if (elem("msg-list").childNodes.length == 100) {
              elem("msg-list").removeChild(elem("msg-list").childNodes[0]);
            }
            elem("msg-list").appendChild(string);
            window.scrollTo(0, document.body.scrollHeight);
          }
        } else if (recv.t === "READY") {
          localStorage.setItem("prev_token", clientToken);
          user_id = recv.d.user.id; console.log(recv.d);
          if (recv.d.user_settings.theme === "light") {
            elem("theme").innerHTML = "body{background:#fff}#message{color:#737f8d}";
          }
          sessionId = recv.d.session_id;
          decrementer = setInterval(decrement, 1000);
          elem("status").innerHTML = recv.d.user.username + "#" + recv.d.user.discriminator;
          if (recv.d.user.bot !== true) {
            for (var i = 0; i < recv.d.guilds.length; i++) {
              guilds[recv.d.guilds[i].id] = recv.d.guilds[i].name;
              let guildId = "g" + recv.d.guilds[i].id;
              let card = document.createElement("DIV");
              card.classList = "card bg-dark";
              let header = document.createElement("BUTTON");
              header.classList = "card-header mb-0 btn d-flex justify-content-between collapsed";
              header.setAttribute("data-toggle", "collapse");
              header.setAttribute("data-target", "#" + guildId);
              let guild = document.createElement("SPAN");
              let members = document.createElement("SPAN");
              let body = document.createElement("DIV");
              body.id = guildId;
              body.classList = "collapse";
              body.setAttribute("data-parent", "#server-list");
              members.classList = "badge badge-light";
              guild.id = "guild";
              members.id = "members";
              for (var j = 0; j < recv.d.guilds[i].channels.length; j++) {
                if (recv.d.guilds[i].channels[j].type === 0) {
                  let channel = document.createElement("DIV");
                  channel.id = "c" + recv.d.guilds[i].channels[j].id;
                  channel.append("#" + recv.d.guilds[i].channels[j].name);
                  body.append(channel);
                }
              }
              guild.append(recv.d.guilds[i].name);
              members.append(recv.d.guilds[i].member_count);
              header.append(guild);
              header.append(members);
              card.append(header);
              card.append(body);
              elem("server-list").appendChild(card);
            }
            $(document).ready(function(){$("[data-toggle='collapse']").collapse();});
          } else {
            let bot = document.createElement("SPAN");
            bot.id = "bot";
            bot.append("BOT");
            elem("status").appendChild(bot);
          }
        } else if (recv.t === "TYPING_START") {
          typing_users[recv.d.user_id] = 5;
        } else if (recv.t === "GUILD_CREATE") {
          guilds[recv.d.id] = recv.d.name;
          let string = document.createElement("DIV");
          let guild = document.createElement("SPAN");
          let members = document.createElement("SPAN");
          string.id = recv.d.id;
          guild.id = "guild";
          members.id = "members";
          guild.append(recv.d.name);
          members.append(": " + recv.d.member_count);
          string.append(guild);
          string.append(members);
          elem("server-list").appendChild(string);
        } else if (recv.t !== "MESSAGE_CREATE") {
          console.log("Unhandled " + recv.t + " event.");
        }
        break;
      case 1:
        heartbeat();
        break;
      case 7:
        disconnect(1);
        elem("typing-status").innerHTML = "Error: Gateway Reconnection";
        break;
      case 9:
        disconnect(1);
        elem("typing-status").innerHTML = "Error: Invalid Session";
        break;
      case 10:
        pacemaker = setInterval(heartbeat, recv.d.heartbeat_interval);
        socket.send(JSON.stringify({
          "op": 2,"d": {
            token: clientToken,
            properties: {
              $os: "windows",
              $browser: "disco",
              $device: "disco"
            },
            compress: false,
            large_threshold: 250
          }
        }));
        break;
      case 11:
        beating = 1;
        break;
      default:
        disconnect(1);
        elem("typing-status").innerHTML = "Error: Invalid State, view console";
        console.log(recv);
    }
  }
}
