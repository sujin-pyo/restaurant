// ----- 요리사 객체화 --------------------------------
export function Chef() {
  this.status = "ready"; //cooking
}
Chef.prototype.isAvailable = function () {
  return this.status == "ready";
};
//.then 붙일거면 Async 해주는 관례가 있다.
Chef.prototype.cookAsync = function (menu) {
  var chef = this;
  this.status = "cooking";
  return new Promise(function (resolve) {
    setTimeout(function () {
      chef.status = "ready";
      resolve();
    }, menu.time);
  });
};
