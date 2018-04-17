document.getElementById("status").innerHTML = "Waiting...";
function connect() {
  function heartbeat() {
    console.log("Lub...");
    socket.send(JSON.stringify({"op":1,"d":{}}));
  }
  async function decrement() {
    for (var i = 0; i < Object.keys(typing_users).length; i++) {
      typing_users[Object.keys(typing_users)[i]] -= 1;
      if (typing_users[Object.keys(typing_users)[i]] == 0) {
        delete typing_users[Object.keys(typing_users)[i]];
        typing -= 1;
      }
    }
  }
  const guilds = {};
  var typing = 0;
  var typing_users = {};
  const client_token = document.getElementById("token").value;
  const socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
  document.getElementById("connection").classList += " vanish";
  document.getElementById("status").innerHTML = "Connecting...";
  document.getElementById("server-list").classList += " appear";
  document.getElementById("user-float").classList += " move";
  document.getElementById("typing-status").innerHTML = typing + " users are typing."
  socket.onmessage = function(event) {
    let recv = JSON.parse(event.data);
    switch (recv.op) {
      case 0:
        if (recv.t === "MESSAGE_CREATE" && recv.d.content !== "") {
          let string = document.createElement("DIV");
          let username = document.createElement("SPAN");
          let hash = document.createElement("SPAN");
          let discriminator = document.createElement("SPAN");
          let at = document.createElement("SPAN");
          let guild = document.createElement("SPAN");
          let message = document.createElement("SPAN");
          username.id = "username";
          hash.id = "hash";
          discriminator.id = "discriminator";
          at.id = "at";
          guild.id = "guild";
          message.id = "message";
          username.append(recv.d.author.username);
          hash.append("#");
          discriminator.append(recv.d.author.discriminator);
          at.append("@");
          for (var i = 0; i < Object.keys(guilds).length; i++) {
            if (Object.keys(guilds)[i] == recv.d.guild_id) {
              guild.append(guilds[recv.d.guild_id]);
              i = guilds.length;
            }
          }
          message.append(": " + recv.d.content);
          string.append(username);
          string.append(hash);
          string.append(discriminator);
          string.append(at);
          string.append(guild);
          string.append(message);
          if (document.getElementById("msg-list").childNodes.length == 100) {
            document.getElementById("msg-list").removeChild(document.getElementById("msg-list").childNodes[0]);
          }
          document.getElementById("msg-list").appendChild(string);
          window.scrollTo(0, document.body.scrollHeight);
        } else if (recv.t === "READY") {
          setInterval(decrement, 1000);
          document.getElementById("status").innerHTML = recv.d.user.username + "#" + recv.d.user.discriminator;
          for (var i = 0; i < recv.d.guilds.length; i++) {
            guilds[recv.d.guilds[i].id] = recv.d.guilds[i].name;
            let string = document.createElement("DIV");
            let guild = document.createElement("SPAN");
            let members = document.createElement("SPAN");
            string.id = recv.d.guilds[i].id;
            guild.id = "guild";
            members.id = "members";
            guild.append(recv.d.guilds[i].name);
            members.append(": " + recv.d.guilds[i].member_count);
            string.append(guild);
            string.append(members);
            document.getElementById("server-list").appendChild(string);
          }
        } else if (recv.t === "TYPING_START") {
          typing_users[recv.d.user_id] = 5;
          typing += 1;
          document.getElementById("typing-status").innerHTML = typing + " users are typing."
        }
        break;
      case 1:
        heartbeat();
        break;
      case 7:
        console.log("gateway reconnection");
        break;
      case 9:
        console.log("invalid session");
        break;
      case 10:
        setInterval(heartbeat, recv.d.heartbeat_interval);
        socket.send(JSON.stringify({"op":2,"d":{
          token: client_token,
          properties: {
            $os: "windows",
            $browser: "disco",
            $device: "disco"
          },
          compress: false,
          large_threshold: 250
        }}));
        break;
      case 11:
        console.log("...dub");
        break;
      default:
        console.log("uh oh: " + recv);
    }
  }
}
