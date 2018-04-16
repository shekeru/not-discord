document.getElementById("status").innerHTML = "Waiting...";
function connect() {
  document.getElementById("status").innerHTML = "Connecting...";
  function heartbeat() {
    console.log("Lub...");
    socket.send(JSON.stringify({"op":1,"d":{}}));
  }
  client_token = document.getElementById("token").value;
  socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
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
          guild.append(recv.d.guild_id);
          message.append(": " + recv.d.content);
          string.append(username);
          string.append(hash);
          string.append(discriminator);
          string.append(at);
          string.append(guild);
          string.append(message);
          document.getElementById("msg-list").appendChild(string);
          window.scrollTo(0, document.body.scrollHeight);
        } else if (recv.t === "READY") {
          document.getElementById("status").innerHTML = recv.d.user.username + "#" + recv.d.user.discriminator;
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
