const client_token = "token";
const socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
function heartbeat() {
  console.log("Lub...");
  socket.send(JSON.stringify({"op":1,"d":{}}));
}
socket.onmessage = function(event) {
  let recv = JSON.parse(event.data);
  switch (recv.op) {
    case 0:
      if (recv.t === "MESSAGE_CREATE" && recv.d.content !== "") {
        let user = recv.d.author.username + "#" + recv.d.author.discriminator;
        let msg = document.createElement("DIV");
        let contents = document.createTextNode(user + ": " + recv.d.content);
        msg.append(contents);
        document.getElementById("msg-list").appendChild(msg);
        window.scrollTo(0, document.body.scrollHeight);
      }
      console.log(recv);
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
        compress: true,
        large_threshold: 250
      }}));
      break;
    case 11:
      console.log("...dub.");
      break;
    default:
      console.log("error;");
      console.log(recv);
  }
}
