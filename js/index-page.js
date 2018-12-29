window.onload = function () {
    var oTopad = document.getElementById('topad');
    var oa = oTopad.getElementsByTagName('a')[0];
    oa.onclick = function () {
        oTopad.style.display = 'none';
    }
    /*-------------banner------------*/
    var oWrap = document.getElementById('wrap');
    var oUl = document.getElementById('banner');
    var oOl = document.getElementById('banner-bottom');
    var aLi = oUl.getElementsByTagName('li');
    var olLi = oOl.getElementsByTagName('li');
    var str1 = "";
    var str2 = "";
    ajax("data/banner.txt",function (str) {
        var arr = eval(str);
        for(var i = 0;i<arr.length;i++){
            str1 += '<li><img src="'+arr[i][0].src+'" alt=""></li>';
            str2 += "<li></li>";
        }
        oUl.innerHTML =str1;
        oOl.innerHTML =str2;

        //
        aLi[0].className = "active";
        olLi[0].className = "active";
        oWrap.style.background = arr[0][0].background;
        //自动播放
        var index = 0;
        clearInterval(timer);
        var timer = setInterval(auto,2000);
        function auto() {
            index++;
            if (index == arr.length) {
                index = 0;
            }
            tab();
        }
        function tab() {
            for (var i = 0;i<arr.length;i++){
                aLi[i].className = '';
                olLi[i].className = '';
            }
            aLi[index].className = 'active';
            olLi[index].className = 'active';
            oWrap.style.background = arr[index][0].background;
        }
        //清除定时器
        for (var i = 0; i < aLi.length; i++) {
            oUl.onmouseover=function () {
                clearInterval(timer);
            }
            oUl.onmouseout=function () {
                timer=setInterval(auto,3000);
            }
        }
        //手动切换
        for (var i = 0; i<arr.length;i++){
            olLi[i].index= i;
            olLi[i].onmouseover = function () {
                index = this.index;
                tab();
            }
        }
        var oPrev= document.getElementById('prev');
        var oNext= document.getElementById('next');
        oNext.onclick = function(){
            auto();
        }
        oPrev.onclick = function () {
            index--;
            if (index == -1)index = aLi.length-1;
            tab();
        }

    })

    //--------------每日必抢-----------------------------------------------------------

    var dailyMain = document.getElementsByClassName("daily-main")[0];
    var dailyList = dailyMain.getElementsByTagName("li");
    var dailyUL = dailyMain.getElementsByTagName("ul");
    var dailyBut = dailyMain.getElementsByTagName("p");

    ajax("data/day.txt",function (str) {
        //1.通过ajax获取请求的数据
        var dayArry = eval(str)[0].data.indexRushItem;

        //2.循环生成li标签
        for(var i = 0;i<dayArry.length;i++){
            if(i % 4 == 0){ //每4个一个ul
                var oUl = document.createElement("ul");
                oUl.className = "daily-list clearfix";
                dailyMain.appendChild(oUl);
            }
            oUl.innerHTML += "<li><a href='#'><img src='"+dayArry[i].goods_img+"' alt='' width='120' height='120'><p class='list-price'>¥"+dayArry[i].goods_tg_price+" <span>"+dayArry[i].goods_price+"</span></p> <p class='list-name'>"+dayArry[i].goods_name+"</p></a></li>";
        }

        //操作li
        dailyList[3].className  =dailyList[7].className = "list-last";
        dailyUL[0].style.display = "block";

        //点击切换模块
        var index = 0;
        dailyBut[0].onclick = function () {
            index ++;
            if(index == dailyUL.length){index = 0}
            for(var i = 0;i<dailyUL.length;i++){
                dailyUL[i].style.display = "none";
            }
            dailyUL[index].style.display = "block";
        }
        dailyBut[1].onclick = function () {
            index --;
            if(index < 0){index = dailyUL.length-1 }
            for(var i = 0;i<dailyUL.length;i++){
                dailyUL[i].style.display = "none";
            }
            dailyUL[index].style.display = "block";
        }

        /*--------倒计时----------------------------------------*/

        function countTime() {
            //获取当前时间
            var date = new Date();
            var now = date.getTime();
            //设置截止时间
            var endDate = new Date("2019-10-22 23:59:59");
            var end = endDate.getTime();
            //时间差
            var leftTime = end-now;
            //定义变量 h,m,s保存倒计时的时间
            var h,m,s;
            if (leftTime>=0) {
                h = Math.floor(leftTime/1000/60/60%24);
                m = Math.floor(leftTime/1000/60%60);
                s = Math.floor(leftTime/1000%60);
            }
            if (h<10){h = '0'+h;}
            if (m<10){m = '0'+m;}
            if (s<10){s = '0'+s;}
            //将倒计时赋值到div中
            document.getElementById("_h").innerHTML = h;
            document.getElementById("_m").innerHTML = m;
            document.getElementById("_s").innerHTML = s;
            //递归每秒调用countTime方法，显示动态时间效果
            setTimeout(countTime,1000);
        }
        countTime();

    })


    /*------------------楼层floor--------------------------------------------------*/

    ajax("data/floor.txt",function (str) {
        var floorArr = eval(str)[0].floor;//9层所有的数据
        var gmFloor = document.getElementsByClassName("gm-floor");
        var k = 0;
        for(var i = 0;i<gmFloor.length;i++){
            floor(gmFloor[i],i);
        }

        function floor(obj,index) {
            var floorMin = obj.getElementsByClassName("floor-main");
            var floorA = obj.getElementsByClassName("floor-nav")[0].getElementsByTagName("a");

            //1.创建
            for(var i = 1;i<floorMin.length;i++){
                createElement(floorMin[i],floorArr[index][i-1]);
            }

            //2.划过li显示对应的div
            for(var i = 0;i<floorA.length;i++){
                floorA[i].index = i;
                floorA[i].onmouseover = function () {
                    for(var j = 0;j<floorA.length;j++){
                        floorMin[j].style.display = "none";
                        floorA[j].className = "";
                    }
                    floorMin[this.index].style.display = "block";
                    this.className = "active";
                    k = this.index;
                }
            }
            //3.切换模块
            var nextBut = obj.getElementsByClassName("floor-wrap")[0].getElementsByTagName("i")[0];
            nextBut.onclick = function () {
                k++;
                if (k == floorA.length){k = 0}
                for(var n = 0;n<floorA.length;n++){
                    floorMin[n].style.display = "none";
                    floorA[n].className = "";
                }
                floorMin[k].style.display = "block";
                floorA[k].className = "active";
            }
        }
        function createElement(floor,arr) {
            //添加ul标签
            floor.innerHTML = "<ul class='floor-main-list'></ul>";

            var oUl = floor.getElementsByTagName("ul")[0];
            var str = "";

            for(var i = 0;i<floorArr[0][0].length;i++){
                str += "<li><a href='#'><img src='"+arr[i].goods_img+"' alt=''><p class='p-name'>"+arr[i].goods_name+"</p><p class='p-price'>"+arr[i].goods_price+"</p></a></li>"
            }
            oUl.innerHTML = str;
        }


        //-------------楼层多个轮播图---------------------------------------------------
        var oF = document.getElementsByClassName('gm-fn-wrap');
        for (var n = 0;n<9;n++){
            lunbo(n);
        }
       function lunbo(m) {
           var oCa = document.getElementsByClassName('carousel')[m];
           var opspan = document.getElementsByClassName('floor-main-fl')[m];
           var aLi2 = oCa.getElementsByTagName('li');
           var ospan= opspan.getElementsByTagName('span');
           var oPh= document.getElementsByClassName('phBrand-page')[m];
           var oPre= oPh.getElementsByTagName("em")[0];
           var oNex= oPh.getElementsByTagName("em")[1];
           var index = 0;
           var time = setInterval(auto2,2000);
           function auto2() {
               index++;
               if (index == aLi2.length) {
                   index = 0;
               }
               tab2();
           }
           function tab2() {
               for (var i = 0;i<aLi2.length;i++){
                   aLi2[i].style.display = '';
                   ospan[i].style.background = '#474747';
               }
               aLi2[index].style.display = 'block';
               ospan[index].style.background = '#f5004b';
           }
           //-----------清除定时器
           for (var i = 0; i < aLi2.length; i++) {
               oCa.onmouseover=function () {
                   clearInterval(time);
               }
               oCa.onmouseout=function () {
                   time=setInterval(auto2,2000);
               }
           }
           //----------轮播图下方切换
           for (var i = 0; i<aLi2.length;i++){
               olLi[i].index= i;
               olLi[i].onmouseover = function () {
                   index = this.index;
                   tab2();
               }
           }
           //----------轮播图左右按钮

           oNex.onclick = function(){
               auto2();
           }
           oPre.onclick = function () {
               index--;
               if (index == -1)index = aLi2.length-1;
               tab2();
           }
       }


    })

    /*------------------------楼层导航-----------------------------------------------------------   */
    var oFloorNav = document.getElementById('floor-nav');
    var aFloorNavli = oFloorNav.getElementsByTagName('a');
    var oFloorWrap = document.getElementsByClassName('gm-fn-wrap')[0];
    var aFloor = document.getElementsByClassName('gm-floor');
    var oMoveBottom= document.getElementsByClassName('gm-bottom')[0];
    var oMoveTop = document.getElementsByClassName('gm-top')[0];
    var oClientHeight = document.documentElement.clientHeight;//屏幕高
    window.onscroll = function () {
        var oScrollTop= document.documentElement.scrollTop;
        oFloorNav.style.display = '';
        if (oScrollTop >= oFloorWrap.offsetTop - oClientHeight) {
            oFloorNav.style.display = 'block';
        } else {
            oFloorNav.style.display = '';
        }
        var time = null;
        /*  导航颜色滚动  */
        for(var i=0;i<aFloorNavli.length;i++){
            if( oScrollTop  >= aFloor[i].offsetTop- oClientHeight){
                for(var j=0;j<aFloorNavli.length;j++){
                    aFloorNavli[j].className = "";
                }
                aFloorNavli[i].className = "active";
            }

            (function (i) {
                /*  缓动  */
                var floorTop = aFloor[i].offsetTop;
                aFloorNavli[i].onclick = function () {
                    clearInterval(time);
                    time = setInterval(function () {
                        var sp = (floorTop - oScrollTop)/10;
                        sp = sp > 0 ? Math.ceil(sp) : Math.floor(sp);
                        oScrollTop = oScrollTop + sp;
                        if(oScrollTop == floorTop){
                            clearInterval(time);
                        }
                        window.scrollTo(0,oScrollTop);
                    },30);
                }
            })(i)
        }

        /*  到顶部  */
        oMoveTop.onclick = function () {
            time = setInterval(function () {
                var sp = (0- oScrollTop)/10;
                sp = sp > 0 ? Math.ceil(sp) : Math.floor(sp);
                oScrollTop = oScrollTop + sp;
                if (oScrollTop>0){window.scrollTo(0,oScrollTop);}
                else {window.scrollTo(0,0);clearInterval(time);}
            },30);
        }
        /*  到底部  */
        oMoveBottom.onclick = function () {
            clearInterval(time);
            time = setInterval(function () {
                var sp = (document.documentElement.offsetHeight - oScrollTop)/10;
                sp = sp > 0 ? Math.ceil(sp) : Math.floor(sp);
                oScrollTop = oScrollTop + sp;
                if (oScrollTop < document.documentElement.offsetHeight){window.scrollTo(0,oScrollTop);}
                else {window.scrollTo(0,document.documentElement.offsetHeight);clearInterval(time);}
            },30);
        }

    }







}
