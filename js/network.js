const GATEWAY_URL = "wss://gateway.discord.gg/?v=6&encoding=json";
// Implement Weak Socket API
class Network {
  constructor(token) {
    // Client State
    this.token = token;
    this.current = 0;
    // Attach Handlers
    this.start_socket();
  }
  on_open = (e) => this.session ?
    this.code_6() : this.code_2();
  on_message(event) {
    let recv = JSON.parse(event.data);
    this.current = recv.s || this.current;
    eval('api.code_{0}(recv.d,recv.t)'.format(recv.op));
      // console.log("OPCODE:", recv.op, recv.t);
  }
  on_error(event) {
    console.log('yep', event);
  }
  on_close(event) {
    this.start_socket();
  }
  // Heartbeat ACK
  code_11() {};
  // Hello
  code_10(data, type) {
    if (this.responder)
      clearInterval(this.responder);
    this.responder = setInterval(this.code_1(),
      data.heartbeat_interval);
  }
  // 	Invalid Session
  code_9() {

  }
  // Request Guild Members
  code_8() {

  }
  // Reconnect
  code_7(data, type) {
    this.socket.close();
  }
  // Resume
  code_6 = () => this.attempt(6, {
    "session_id": this.session,
    "seq": this.current,
    "token": this.token
  });
  code_5() {

  }
  code_4(data, type) {

  }
  code_3(data, type) {

  }
  code_2 = (d, t) => this.attempt(2, {
    "large_threshold": 135,
    "token": this.token,
    "compress": false,
    "properties": {}
  });
  code_1(data, type) {
    return () => this.attempt(1, this.current);
  }
  // Dispatch
  code_0(data, type) {
    eval('system.{0}(data)'.format(
      type.toLowerCase()));
  }
  start_socket () {
    this.socket = new WebSocket(GATEWAY_URL);
    this.socket.onmessage = this.on_message;
    this.socket.onerror = this.on_error;
    this.socket.onclose = this.on_close;
    this.socket.onopen = this.on_open;
  }
  attempt(op, data) {
    this.socket.send(JSON.stringify({
      op: op, d: data
    }));
  }
}
