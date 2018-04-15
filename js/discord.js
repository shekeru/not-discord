const client_token = "token";
const socket = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
function heartbeat() {
  console.log("heartbeat!");
  socket.send(JSON.stringify({"op":1,"d":{}}));
}
socket.onmessage = function(event) {
  let recv = JSON.parse(event.data);
  switch (recv.op) {
    case 0:
      //dispatch
      console.log(recv);
      break;
    case 1:
      //Gateway requesting heartbeat
      heartbeat();
      break;
    case 7:
      //gateway reconnection
      console.log("gateway reconnection");
      break;
    case 9:
      //invalid session
      console.log("invalid session");
      break;
    case 10:
      //hello
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
      //heartbeat ack
      console.log("heartbeat received!");
      break;
    default:
      //fallback
      console.log("error;");
      console.log(recv);
  }
}
