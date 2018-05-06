document.getElementById("status").innerHTML = "Waiting...";
function disconnect(state) {
  clearInterval(pacemaker);
  clearInterval(decrementer);
  if (state == "0") {
    document.getElementById("typing-status").innerHTML = "Disconnected.";
  }
  socket.close();
  document.getElementById("status").innerHTML = "Waiting...";
  document.getElementById("connection").classList = "";
  document.getElementById("server-list").classList = "";
  document.getElementById("disconnect").classList = "btn btn-danger";
  document.getElementById("user-float").classList = "rainbow";
  document.getElementById("disconnect").disabled = true;
  document.getElementById("theme").innerHTML = "";
  let j = document.getElementById("server-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    document.getElementById("server-list").removeChild(document.getElementById("server-list").childNodes[0]);
  }
  j = document.getElementById("msg-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    document.getElementById("msg-list").removeChild(document.getElementById("msg-list").childNodes[0]);
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
        "token": client_token,
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
      delete typing_users[Object.keys(typing_users)[i]];
    }
  }
  document.getElementById("typing-status").innerHTML = Object.keys(typing_users).length + " users are typing.";
}
function updateFilter() {
  document.getElementById("filter").innerHTML = "";
  for (var i = 0; i < Object.keys(ignored).length; i++) {
    document.getElementById("filter").innerHTML += "#msg-list #" + Object.keys(ignored)[i] + "{display:none}";
  }
}
function hide(id) {
  document.cookie = JSON.stringify({user_id, ignored});
  if (document.getElementById(id).firstChild.checked) {
    ignored[id] = "1";
    updateFilter();
  } else {
    delete ignored[id];
    updateFilter();
  }
}
function resetCookie() {
  document.cookie = "";
  location.reload();
}
function connect() {
  socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
  guilds = {};
  user_id = "";
  ignored = {};
  highlighted = {};
  typing_users = {};
  beating = 1;
  s = 0;
  client_token = document.getElementById("token").value;
  document.getElementById("connection").classList += "active";
  document.getElementById("server-list").classList += "active";
  document.getElementById("disconnect").classList += " active";
  document.getElementById("user-float").classList += " active";
  document.getElementById("disconnect").disabled = false;
  document.getElementById("status").innerHTML = "Connecting...";
  document.getElementById("typing-status").innerHTML = Object.keys(typing_users).length + " users are typing.";
  socket.onmessage = function(event) {
    let recv = JSON.parse(event.data);
    s = recv.s;
    switch (recv.op) {
      case 0:
        if (recv.t === "MESSAGE_CREATE" && recv.d.content !== "") {
          if (!ignored["g" + recv.d.guild_id]) {
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
            string.append("@");
            string.append(guild);
            string.append(": ");
            string.append(message);
            if (document.getElementById("msg-list").childNodes.length == 100) {
              document.getElementById("msg-list").removeChild(document.getElementById("msg-list").childNodes[0]);
            }
            document.getElementById("msg-list").appendChild(string);
            window.scrollTo(0, document.body.scrollHeight);
          }
        } else if (recv.t === "READY") {
          user_id = recv.d.user.id;
          if (recv.d.user_settings.theme === "light") {
            document.getElementById("theme").innerHTML = "body{background:#fff}#message{color:#737f8d}";
          }
          if (document.cookie) {
            let cookieData = JSON.parse(document.cookie);
            if (cookieData.user_id == user_id) {
              ignored = cookieData.ignored;
              updateFilter();
            }
          }
          sessionId = recv.d.session_id;
          decrementer = setInterval(decrement, 1000);
          document.getElementById("status").innerHTML = recv.d.user.username + "#" + recv.d.user.discriminator;
          if (recv.d.user.bot !== true) {
            for (var i = 0; i < recv.d.guilds.length; i++) {
              guilds[recv.d.guilds[i].id] = recv.d.guilds[i].name;
              let string = document.createElement("DIV");
              let box = document.createElement("INPUT");
              let guild = document.createElement("SPAN");
              let members = document.createElement("SPAN");
              string.id = "g" + recv.d.guilds[i].id;
              box.type = "checkbox";
              box.value = recv.d.guilds[i].id;
              let id = recv.d.guilds[i].id;
              box.addEventListener("click", function(){hide("g" + id);});
              guild.id = "guild";
              members.id = "members";
              guild.append(" " + recv.d.guilds[i].name);
              members.append(": " + recv.d.guilds[i].member_count);
              string.append(box);
              string.append(guild);
              string.append(members);
              document.getElementById("server-list").appendChild(string);
            }
          } else {
            let bot = document.createElement("SPAN");
            bot.id = "bot";
            bot.append("BOT");
            document.getElementById("status").appendChild(bot);
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
          document.getElementById("server-list").appendChild(string);
        }
        break;
      case 1:
        heartbeat();
        break;
      case 7:
        disconnect(1);
        document.getElementById("typing-status").innerHTML = "Error: Gateway Reconnection";
        break;
      case 9:
        disconnect(1);
        document.getElementById("typing-status").innerHTML = "Error: Invalid Session";
        break;
      case 10:
        pacemaker = setInterval(heartbeat, recv.d.heartbeat_interval);
        socket.send(JSON.stringify({
          "op": 2,"d": {
            token: client_token,
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
        document.getElementById("typing-status").innerHTML = "Error: Invalid State, view console";
        console.log(recv);
    }
  }
}
