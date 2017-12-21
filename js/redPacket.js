//从指定数组中产生指定长度的数组
Array.prototype.random_numbers = function (num, repeat, s) {
  var length = this.length;
  if (num > length) {
    return false;
  }
  var hash = [];
  //号码可以重复？
  repeat = (repeat) ? true : false;
  //是否要排序
  var issort = s ? true : false;
  do {
    var key = Math.floor(Math.random() * (length));
    var number = this[key];
    // 如果可以重复
    if (repeat) {
      hash.push(number);
    } else {
      if ($.inArray(number, hash) == -1) {
        hash.push(number);
      }
    }
  } while (hash.length < num);
  if (issort) hash.sort();
  return hash;
};

//抽奖机会有效期
function validity(h, m, s) {
  //获取当前时间时间戳
  var nowunix = Math.round(new Date().getTime());
  var date = new Date();
  date.setHours(h);
  date.setMinutes(m);
  date.setSeconds(s);
  //获取指定时间时间戳
  var secunix = Math.round(date.getTime());
  shengunix = secunix - nowunix;
  shengunix = parseFloat(shengunix) / 1000;
  var date1 = new Date();
  date1.setTime(date1.getTime() + (shengunix * 1000));
  return date1;
}

//进度条加载
function progressfn(cent) {
  var progressbar = document.getElementById("progressbar");
  progressbar = progressbar.getElementsByTagName("p");
  progressbar[0].innerHTML = cent + "%";
  var progress = document.getElementById("progress");
  progress.style.width = cent + "%";
}


!function ($) {

  var defaults = {
    speed: 0,
    interaction: true,
    size: 2,
    count: 200,
    opacity: 0,
    color: "#ffffff",
    windPower: 0,
    delay: 6,
    image: false
  };


  $.fn.redPacket = function (options) {

    var settings = $.extend({}, defaults, options),
      el = $(this),
      flakes = [],
      canvas = el.get(0),
      ctx = canvas.getContext("2d"),
      flakeCount = settings.count,
      mX = -100,
      mY = -100;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    (function () {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      window.requestAnimationFrame = requestAnimationFrame;
    })();

    function snow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < flakeCount; i++) {
        var flake = flakes[i],
          x = mX,
          y = mY,
          minDist = 100,
          x2 = flake.x,
          y2 = flake.y;

        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
          dx = x2 - x,
          dy = y2 - y;

        if (dist < minDist) {
          var force = minDist / (dist * dist),
            xcomp = (x - x2) / dist,
            ycomp = (y - y2) / dist,
            deltaV = force / 2;

          flake.velX -= deltaV * xcomp;
          flake.velY -= deltaV * ycomp;

        } else {
          flake.velX *= .98;
          if (flake.velY <= flake.speed) {
            flake.velY = flake.speed
          }

          switch (settings.windPower) {
            case false:
              flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
              break;

            case 0:
              flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
              break;

            default:
              flake.velX += 0.01 + (settings.windPower / 100);
          }
        }

        var s = settings.color;
        var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
        var matches = patt.exec(s);
        var rgb = parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16);


        flake.y += flake.velY;
        flake.x += flake.velX;
        if (flake.y >= canvas.height || flake.y <= 0) {
          reset(flake);
        }
        if (flake.x >= canvas.width || flake.x <= -flake.size * 2) {
          reset(flake);
        }
        if (settings.image == false) {
          ctx.fillStyle = "rgba(" + rgb + "," + flake.opacity + ")";
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fill();
        } else {

          ctx.drawImage($("img#lis_flake").get(0), flake.x, flake.y, flake.size * 2, flake.size * 2);
        }

      }
      if (settings.delay > 0) {
        requestAnimationFrame(snow);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (settings.image != false){
          var c = parseInt($('#click_count').text());
          // fk 为当次可获得福卡数 ， cj 为可获得抽奖机会
          var fk = 0, cj = 0, tit = '';
          c < 8 ? (fk = 3, cj = 0) : c === 8 ? (fk = 4, cj = 1) : (fk = 5, cj = 2);
          cj > 0 ? tit = '恭喜，获得了' + cj + '次抽奖机会' : tit = '很抱歉，没有获得抽奖机会！';

          var rf = parseInt($.cookie('raffle')) || 0;
          // 设置抽奖机会当天 24:00 自动清除
          var validity1 = validity(23,59,59);
          $.cookie('raffle', rf+cj, { expires: validity1 });

          Modal.modal({
            title: tit,
            url: cj > 0 ? 'http://10.0.0.125/html/yn_jfcj/raffle.html' : 'http://10.0.0.125/html/yn_jfcj/index.html',
            backdrop: false,
            content: '每次集福卡规定在6秒内，点击福袋8次以内集3张福卡，但无抽奖机会；点击福袋8次集4张福卡并获得1次抽奖机会；点击福袋8次以上集5张福卡获得两个抽奖机会。集福卡所获得的抽奖机会可累计，当日24:00时清空。',
            btn_save_title: cj > 0 ? '立即抽奖' : '返回首页',
            btn_close_title: '继续集福卡'
          });
          $('.modal-header h4').css({'textAlign': 'center', 'color': '#fef2c2'});
          $('.modal-content').css({'backgroundColor': '#de1e2b', 'padding': '0 10px'});
          var packs = '<div class="packs">\n' +
            '  <div class="pack">\n' +
            '    <img src="http://10.0.0.125/html/yn_jfcj/images/fucaifu.png" alt="" width="100%">\n' +
            '    <span class="pack_count"></span>\n' +
            '    <p>福彩福</p>\n' +
            '  </div>\n' +
            '  <div class="pack">\n' +
            '    <img src="http://10.0.0.125/html/yn_jfcj/images/fulaofu.png" alt="" width="100%">\n' +
            '    <span class="pack_count"></span>\n' +
            '    <p>扶老福</p>\n' +
            '  </div>\n' +
            '  <div class="pack">\n' +
            '    <img src="http://10.0.0.125/html/yn_jfcj/images/zhucanfu.png" alt="" width="100%">\n' +
            '    <span class="pack_count"></span>\n' +
            '    <p>助残福</p>\n' +
            '  </div>\n' +
            '  <div class="pack">\n' +
            '    <img src="http://10.0.0.125/html/yn_jfcj/images/jiugufu.png" alt="" width="100%">\n' +
            '    <span class="pack_count"></span>\n' +
            '    <p>救孤福</p>\n' +
            '  </div>\n' +
            '  <div class="pack">\n' +
            '    <img src="http://10.0.0.125/html/yn_jfcj/images/jikunfu.png" alt="" width="100%">\n' +
            '    <span class="pack_count"></span>\n' +
            '    <p>济困福</p>\n' +
            '  </div>\n' +
            '</div>';
          $(packs).insertBefore($('.modal-footer'));
          // 0 福彩福, 1 扶老福, 2 助残福, 3 救孤福, 4 济困福
          var pks = [0, 1, 2, 3, 4];

          var hs = pks.random_numbers(fk, false, true);
          // 缓存用户获得的总福卡数
          hs.forEach(function (t1, n1) {
            $('.packs .pack:eq(' + t1 + ')').addClass('have').find('.pack_count').text(1);
            // t1 > 0 ? $('.packs .pack:eq(' + n1 + ')').addClass('have').find('.pack_count').text(t1) : $('.packs .pack:eq(' + n1 + ')').removeClass('have');
          });

          $('.modal-footer .btn_close').unbind('click').bind('click', function () {
            var ct = parseInt($('.chance').text());
            if (ct > 0) {
              $('#click_count').html(0);
              $('.chance').html(--ct);
              $('#client_time').text(options.delay || 6);
              $("canvas.snow").redPacket({
                windPower: 3,
                speed: 1,
                count: 250,
                size: 0,
                delay:6
              });
              $("canvas.cpack").redPacket({
                windPower: -3,
                speed: 5,
                count: 10,
                size: 50,
                delay:6,
                image: "images/game_fudai1.png"
              });
              settings.click_count = 0;
              settings.delay = options.delay;

              sessionStorage.setItem('chance', ct);
            } else {
              Modal.modal({
                title: '',
                content: '<h4>很抱歉。您今天集福卡的机会已用完！</h4><p>每个微信账号每天只有5次集福卡的机会，明天继续加油哦！</p>',
                btn_close_title: '关闭'
              });
              $('.modal-footer .btn_close').unbind('click').bind('click', function () { $('#backdrop,#no_chance').hide();location.reload(); })
            }
          })
        }

      }
    }


    // 重绘
    function reset(flake) {

      if (settings.windPower == false || settings.windPower == 0) {
        flake.x = Math.floor(Math.random() * canvas.width);
        flake.y = 0;
      } else {
        if (settings.windPower > 0) {
          var xarray = Array(Math.floor(Math.random() * canvas.width), 0);
          var yarray = Array(0, Math.floor(Math.random() * canvas.height));
          var allarray = Array(xarray, yarray);

          var selected_array = allarray[Math.floor(Math.random() * allarray.length)];

          flake.x = selected_array[0];
          flake.y = selected_array[1];
        } else {
          var xarray = Array(Math.floor(Math.random() * canvas.width), 0);
          var yarray = Array(canvas.width, Math.floor(Math.random() * canvas.height));
          var allarray = Array(xarray, yarray);

          var selected_array = allarray[Math.floor(Math.random() * allarray.length)];

          flake.x = selected_array[0];
          flake.y = selected_array[1];
        }
      }

      flake.size = (Math.random() * 3) + settings.size;
      flake.speed = (Math.random() * 1) + settings.speed;
      flake.velY = flake.speed;
      flake.velX = 0;
      flake.opacity = (Math.random() * 0.5) + settings.opacity;
    }

    // 初始化
    function init() {
      $('#progressbar').show();
      for (var i = 0; i < flakeCount; i++) {
        var x = Math.floor(Math.random() * canvas.width),
          y = Math.floor(Math.random() * canvas.height),
          size = (Math.random() * 3) + settings.size,
          speed = (Math.random() * 1) + settings.speed,
          opacity = (Math.random() * 0.5) + settings.opacity;

        flakes.push({
          speed: speed,
          velY: speed,
          velX: 0,
          x: x,
          y: y,
          size: size,
          stepSize: (Math.random()) / 30,
          step: 0,
          angle: 180,
          opacity: opacity
        });
      }

      var now = 0;
      var timer = setInterval(function () {
        if (now == 100) {
          clearInterval(timer);
          $('#progressbar').hide();
          var t1 = setInterval(function () {
            $('#client_time').text(--settings.delay);
            if (settings.delay <= 0) {
              clearInterval(t1);
            }
          }, 1000);
          snow();
        } else {
          now += 2;
          progressfn(now);
        }
      }, 50);
    }

    if (settings.image != false) {
      $("<img src='" + settings.image + "' style='display: none' id='lis_flake'>").prependTo("body")
    }

    init();

    function IsPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    }

    var flag = '';
    if (IsPC()) {
      flag = 'click';
    } else {
      flag = 'touchstart';
    }

    if (settings.interaction == true) {
      settings.click_count = 0;
      canvas.addEventListener("click", function (e) {
        var clientX = e.clientX;
        var clientY = e.clientY;
        for (var i = 0; i < flakes.length; i++) {
          //点击检测
          if (clientX > flakes[i].x && clientX < (flakes[i].x + flakes[i].size * 2) && clientY > flakes[i].y && clientY < (flakes[i].y + flakes[i].size * 2 )) {
            settings.click_count++;
            $("#click_count").html(settings.click_count);
            reset(flakes[i]);
            break;
          }
        }
      });
    }
  }
}(window.jQuery);

