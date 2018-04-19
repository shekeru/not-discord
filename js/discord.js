document.getElementById("status").innerHTML = "Waiting...";
function disconnect(state) {
  if (state == 0) {
    document.getElementById("typing-status").innerHTML = "Disconnected.";
  }
  socket.close();
  clearInterval(pacemaker);
  document.getElementById("status").innerHTML = "Waiting...";
  document.getElementById("connection").classList = "";
  document.getElementById("server-list").classList = "";
  document.getElementById("disconnect").classList = "btn btn-danger";
  document.getElementById("user-float").classList = "rainbow";
  document.getElementById("disconnect").disabled = true;
  let j = document.getElementById("server-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    document.getElementById("server-list").removeChild(document.getElementById("server-list").childNodes[0]);
  }
  j = document.getElementById("msg-list").childNodes.length;
  for (var i = 0; i < j; i++) {
    document.getElementById("msg-list").removeChild(document.getElementById("msg-list").childNodes[0]);
  }
}
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
  socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
  guilds = {};
  typing_users = {};
  typing = 0;
  client_token = document.getElementById("token").value;
  document.getElementById("connection").classList += "active";
  document.getElementById("server-list").classList += "active";
  document.getElementById("disconnect").classList += " active";
  document.getElementById("user-float").classList += " active";
  document.getElementById("disconnect").disabled = false;
  document.getElementById("status").innerHTML = "Connecting...";
  document.getElementById("typing-status").innerHTML = typing + " users are typing.";
  socket.onmessage = function(event) {
    let recv = JSON.parse(event.data);
    switch (recv.op) {
      case 0:
        if (recv.t === "MESSAGE_CREATE" && recv.d.content !== "") {
          let string = document.createElement("DIV");
          let username = document.createElement("SPAN");
          let discriminator = document.createElement("SPAN");
          let guild = document.createElement("SPAN");
          let message = document.createElement("SPAN");
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
        } else if (recv.t === "READY") {
          console.log("...DUB");
          setInterval(decrement, 1000);
          document.getElementById("status").innerHTML = recv.d.user.username + "#" + recv.d.user.discriminator;
          function loadJSON(callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
            };
            xobj.send(null);
          }
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
          document.getElementById("typing-status").innerHTML = typing + " users are typing.";
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
        console.log("LUB...");
        pacemaker = setInterval(heartbeat, recv.d.heartbeat_interval);
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
        disconnect(1);
        document.getElementById("typing-status").innerHTML = "Error: Invalid State, view console";
        console.log(recv);
    }
  }
}
