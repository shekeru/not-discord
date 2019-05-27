// getElementById
var getId = document.getElementById.bind(document);
var getInput = (text) => document.getElementsByName(text)[0];
var createElement = document.createElement.bind(document);
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
// CONSTS?
var Relation = {
  None: 0,
  Friend: 1,
  Blocked: 2,
  Incoming: 3,
  Outgoing: 4,
  Implicit: 5
}
//Proxy System
class default_dict {
  get(target, key){
    if (!target[key])
      target[key] = dict();
    return target[key];
  }
  size() {
    return Object.keys(this).length;
  }
  limit(n) {
    let keys = Object.keys(this);
    if(keys.length > n)
      delete this[keys[0]];
  }
  emit(n) {
    return Object.keys(this).slice(-n);
  }
}; var dict = () => new Proxy(
  new default_dict, new default_dict
);
