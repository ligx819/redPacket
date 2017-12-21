(function (win) {
  if (typeof(jssdk) !== 'undefined' && typeof(wx) !== 'undefined') {
    try {
      wx.ready(function () {
        //朋友圈
        wx.onMenuShareTimeline({
          title: jssdk.desc, // 分享标题
          link: jssdk.link, // 分享链接
          imgUrl: jssdk.imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
            //App.message('亲，分享成功');
          },
          cancel: function () {
          }
        });
        //我的好友
        wx.onMenuShareAppMessage({
          title: jssdk.title, // 分享标题
          desc: jssdk.desc, // 分享标题
          link: jssdk.link, // 分享链接
          imgUrl: jssdk.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            //App.message('亲，分享成功');
          },
          cancel: function () {
          }
        });
      });
    } catch (e) {

    }
  }
})(window);

function reHeight() {
  var bid = $('body').attr('id');
  switch (bid){
    case 'index':
      var th = $('.top').outerHeight();
      var ch = $('.cont').outerHeight();
      var fh = $('.foot').outerHeight();
      var h = $(window).height();
      if (h < th+ch+fh) h = th + ch + fh + 30 + 'px';
      $('html,body').height(h);
      break;
    case 'rule':
      var th = $('.head').outerHeight();
      var wh = $(window).height();
      var h = wh - th - 50 + 'px';
      $('.cont .role_c').height(h);
      break;
    case 'raffle':
      var th = $('.top').outerHeight();
      var rh = $('.raffle_cont').outerHeight();
      var h = $(window).height();
      if (h < th+rh) h = th + rh + 20 + 'px';
      $('html,body').height(h);
      break;
  }
}

function autoScroll(){
  if ($('#winners ul li').length * $('#winners ul li').outerHeight() <= $('#winners ul').outerHeight()){
    return false;
  }
  $("#winners").find("ul").animate({
    marginTop : "0"
  }, 400, function() {
    $(this).css({marginTop : "0px"}).find("li:first").appendTo(this);
  })
}

$(window).resize(function () {
  reHeight();
});
$(function(){
  reHeight();

  setInterval('autoScroll()', 1500);
  $('.chance').html(sessionStorage.chance || 5);
  $('.raffle_count').html($.cookie('raffle') || 0);
});
$('#getCard').click(function () {
  
   var count = parseInt($('.chance').text());
   if (count > 0){
     $('#backdrop,#no_chance').show();
     $("canvas.snow").redPacket({
       windPower: 3,
       speed: 1,
       count: 250,
       size: 0
     });
     $("canvas.cpack").redPacket({
       windPower: -3,
       speed: 5,
       count: 10,
       size: 50,
       delay:6,
       image: "images/game_fudai1.png"
     });
     $('.chance').html(--count);
     sessionStorage.setItem('chance',count);
   }else {
    Modal.modal({
       title:'',
       content:'<h4>很抱歉。您今天集福卡的机会已用完！</h4><p>每个微信账号每天只有5次集福卡的机会，明天继续加油哦！</p>',
       btn_close_title:'关闭'
     })
   }
});

// 获取当前指定格式时间
function getTime() {
  var now = new Date();
  var month = now.getMonth() + 1 < 10 ? '0' + now.getMonth() + 1 : now.getMonth() + 1;
  var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
  var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
  var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  var str = month + '-' + day + '&nbsp;&nbsp;' + hours + ':' + minutes;
  return str;
}

//  中奖等级对应的scrollTop及奖金值
var st = {
  0:{sTop:326,bonus:0},
  1:{sTop:244,bonus:218},
  2:{sTop:162,bonus:100},
  3:{sTop:82,bonus:50},
  4:{sTop:0,bonus:20},
  5:{sTop:408,bonus:2}
};
// 用户名
var userName = '测试';

// 抽奖
function drawCash() {
  var speed=10;
  var slid = 10;
  var slide = document.getElementById("slide");
  var slide2 = document.getElementById("slide2");
  var slide1 = document.getElementById("slide1");
  slide2.innerHTML = slide1.innerHTML;
  function Marquee(){
    if(slide2.offsetTop - slide.scrollTop <= -40)
      slide.scrollTop -= slide1.offsetHeight;
    else{
      slide.scrollTop += slid;
    }
  }
  var myMar=setInterval(Marquee,speed);
  setTimeout(function () {
    // m 为后台返回的中奖等级 0-5
    var m = Math.floor(Math.random() * 5);
    slide.scrollTop = st[m].sTop;
    clearInterval(myMar);
    switch (m){
      case 0:
        Modal.modal({
          title:'',
          url:'http://10.0.0.125/html/yn_jfcj/index.html',
          content:'<h4>很遗憾，没有中奖！</h4><p>差一点就中了，请再接再厉，换个姿势再试试吧！</p>',
          btn_save_title:'返回首页',
          btn_close_title:'继续抽奖'
        });
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        var now = getTime();
        var str = now + '&nbsp;&nbsp;' + userName + '&nbsp;&nbsp;' + st[m].bonus +'元红包';
        $('<li>'+str+'</li>').prependTo($('#winners ul'));
        Modal.modal({
          title:'',
          url:'http://10.0.0.125/html/yn_jfcj/index.html',
          content:'<h4>恭喜您，</br>获得了'+st[m].bonus+'元现金红包！</h4><p>红包将在收到中奖推送之后一个工作日内发放至微信账户。（红包可在“钱包”→“零钱”中查看）。因获奖者个人原因无法接收红包或联系不上的，均视为自动弃奖。</p>',
          btn_save_title:'返回首页',
          btn_close_title:'继续抽奖'
        });
        $('<img class="person" src="http://10.0.0.125/html/yn_jfcj/images/gold_coin.png">').prependTo($('.modal-dialog'));
        break;
    }
  },3000)
}
$('#draw').click(function () {
  var c = parseInt($('.raffle_count').text());
  if (c > 0){
    drawCash();
    $('.raffle_count').html(--c);
    // 设置抽奖机会当天 24:00 过期
    var validity1 = validity(23,59,59);
    $.cookie('raffle', c, { expires: validity1 });
  }else{
    var str = '';
    var c = sessionStorage.chance || -1;
    c = parseInt(c);
    c < 0 ? str = '<h4>很抱歉，您今天还未获得抽奖机会！</h4><p>用户只有通过活动首页的“我要集福卡”参与集福卡游戏才能获得抽奖机会，赶快参与吧</p>' : c === 0 ? str = '<h4>很抱歉，</br>您今天的抽奖机会已用完！</h4>' +
      '<p>您今天的抽奖机会已用完，明天继续加油哦！</p>' : str = '<h4>很抱歉，您当前获得的抽奖机会已用完！</h4><p>您可以返回首页点击“我要集福卡”参与集福游戏获取更多的抽奖机会哦！</p>';
    Modal.modal({
      title:'',
      content:str,
      btn_close_title:c === 0 ? '关闭' : '返回首页'
    });
    if(c != 0){
      $('.modal-footer .btn_close').unbind('click').bind('click',function () {
        location.href = 'http://10.0.0.125/html/yn_jfcj/index.html';
      })
    }
  }
});