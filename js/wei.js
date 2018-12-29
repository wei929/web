
function getStyle(obj,attr){
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
function getPos(obj){
    var l = 0;
    var t = 0;
    while (obj){
        l += obj.offsetLeft;
        t += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {left:l ,top:t};
}
//   move(oDiv1,{'opacity':100,'width':100,'height':100});  //调用
function move(obj,json,fun) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var tag = true;
        for (var attr in json) {
            if (attr == 'opacity') {
                var cur = parseInt(getStyle(obj, attr) * 100);
            } else {
                var cur = parseInt(getStyle(obj, attr));
            }
            //
            var speed = (json[attr] - cur) / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (cur != json[attr]) {
                tag = false;

            }
            if (attr == 'opacity') {
                obj.style[attr] = (cur + speed) / 100;
            } else {
                obj.style[attr] = cur + speed + 'px';
            }
        }
        if (tag == true){
            clearInterval(obj.timer);
            if (fun){
                fun();
            }
        }
    },30);
}

//1.存储cookie的函数 + 过期时间   +  天
function setCookie(key,value,day) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate()+day);
    document.cookie = key+"="+value+";expires="+oDate;
}

//2.获取cookie    传入key，返回value    传入1213  返回faskflas
function getCookie(key) {
    /* var cookies = document.cookie.split("; "); //passWord=ujiuye123; 1213=faskflas
      //["passWord=ujiuye123", "1213=faskflas"]
     for(var i = 0;i<cookies.length;i++){
        var arr = cookies[i].split("=");  //[passWord,ujiuye]
        if(arr[0] == key){
            return arr[1];
        }
     }*/

    var json = {};
    var cookie = document.cookie.split("; ");
    //["passWord=ujiuye123", "1213=faskflas"]
    for(var i = 0;i<cookie.length;i++){
        var arr = cookie[i].split("=");  //[passWord,ujiuye123]
        json[arr[0]] = arr[1];
    }
    return json[key];
}

//3.删除
function  removeCookie(key) { //passWord
    var oDate = new Date();
    oDate.setDate(oDate.getDate()-1);
    document.cookie = key+"=123;expires="+oDate;

}


//封装的ajax
function ajax(url,sFun,dFun) {
    var ajax = new XMLHttpRequest();
    ajax.open("GET",url,true);
    ajax.send();    //发送请求
    ajax.onreadystatechange = function () {    //监听反馈
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                sFun && sFun(ajax.response);  //&&  两个条件为真才为真
            }else {
                dFun &&  dFun(ajax.status);
            }
        }
    }
}



