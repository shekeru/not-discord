// getElementById
var html = document.getElementById.bind(document);
// StackOverflow String Format
if (!String.prototype.format) {
  String.prototype.format = function() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number] : match;
    });
  };
}
