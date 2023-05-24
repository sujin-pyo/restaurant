import { Menu } from "./menu.js";
import { Chef } from "./chef.js";
import { Server } from "./server.js";

var orders = [];
var cooking = [];
var serving = [];

document.getElementById("sundae").onclick = function () {
  run(new Menu("순댓국", 2000));
};
document.getElementById("haejang").onclick = function () {
  run(new Menu("해장국", 5000));
};
var chefs = [new Chef(), new Chef()];
var servers = [new Server(2000), new Server(5000)];

// ----- 렌더링 --------------------------------

function render(id, array) {
  var ulEl = document.getElementById(id);
  ulEl.innerHTML = "";
  array.forEach(function (item) {
    var liEl = document.createElement("li");
    liEl.textContent = item.name;
    ulEl.append(liEl);
  });
}

function findChefAsync() {
  return new Promise(function (resolve) {
    var interval = setInterval(function () {
      var chef = chefs.find(function (chef) {
        return chef.isAvailable();
      });

      if (chef) {
        clearInterval(interval);
        resolve(chef);
      }
    }, 500);
  });
}
function findServerAsync() {
  return new Promise(function (resolve) {
    var interval = setInterval(function () {
      var server = servers.find(function (server) {
        return server.isAvailable();
      });

      if (server) {
        clearInterval(interval);
        resolve(server);
      }
    }, 500);
  });
}

// ----- 주문, 요리, 서빙 등 메인프로세스(동기-비동기, promise) --------------------------------
function run(menu) {
  //주문목록에 추가, 출력
  orders.push(menu);
  render("orders", orders);
  //대기중인 요리사 찾기.
  // -- 화면이 반응할 수 있도록 여유시간을 줘야함.
  //※ loadscript로 비동기작업을 어떻게 하는지. 이대로면 콜백지옥과 다를 바가 없다.
  findChefAsync()
    .then(function (chef) {
      //요리 시킴.
      //주문 목록에서 제거
      orders.splice(orders.indexOf(menu), 1);
      render("orders", orders);
      //요리 목록으로 넘어가야함
      cooking.push(menu);
      render("cooking", cooking);

      return chef.cookAsync(menu); //"cooking"
    })
    .then(function () {
      //요리중.
      cooking.splice(cooking.indexOf(menu), 1);
      render("cooking", cooking);
      return findServerAsync();
    })
    .then(function (server) {
      //서빙 시킴.
      //서빙 목록으로 넘어가야함
      serving.push(menu);
      render("serving", serving);
      return server.serverAsync(server); //"serving"
    })
    .then(function () {
      // 서빙 완료
      serving.splice(serving.indexOf(menu), 1);
      render("serving", serving);

      console.log("맛점~~");
    });
}
