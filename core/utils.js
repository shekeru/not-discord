// getElementById
var getId = document.getElementById.bind(document);
var getInput = (text) => document.getElementsByName(text)[0];
// StackOverflow String Format
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number] : match;
  });
};
// Array => Dict
Array.prototype.extend = function() {
  return this.reduce((obj, x) =>
    Object.assign(obj, {[x.id]: x}),
  {});
}
Object.merge = (a, b) =>
  Object.assign(a || {}, b);
// Easy Length
Object.prototype.size = function() {
  return Object.keys(this).length;
}
// CONSTS?
var Relation = {
  None: 0,
  Friend: 1,
  Blocked: 2,
  Incoming: 3,
  Outgoing: 4,
  Implicit: 5
}
