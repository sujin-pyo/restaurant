// ----- 서버 객체화 --------------------------------
export function Server(time) {
  this.time = time;
  this.status = "ready";
}
Server.prototype.isAvailable = function () {
  return this.status === "ready";
};
Server.prototype.serverAsync = function (menu) {
  var server = this;
  this.status = "serving";
  return new Promise(function (resolve) {
    setTimeout(function () {
      server.status = "ready";
      resolve();
    }, menu.time);
  });
};
