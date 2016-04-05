// 工具函数

// 判断是否有cls类
function hasClass(obj, cls){
    var fullClass = obj.className.split(' ');
    if (fullClass.indexOf(cls) != -1) {
        return true;
    } else {
        return false;
    }
}
// 增加cls类
function addClass(obj, cls){
    if (!hasClass(obj,cls)) {
        obj.className += ' ' + cls;
    }
}
// 移除cls类
function removeClass(obj, cls){
    var fullClass = obj.className.split(' ');
    var clsIndex = fullClass.indexOf(cls);
    fullClass.splice(clsIndex, 1);  // 删除cls
    obj.className = fullClass.join(' ');
}
// 设置cookie
function setCookie (name, value, expires, path, domain, secure){
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires){
        var today = new Date();
        today.setDate(today.getDate() + expires);
        cookie += '; expires=' + today.toUTCString();
    }
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 解析cookie
function getcookie (){
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
/*
封装Ajax方法
参数说明：
参数为对象，可包括的参数为：
    url：请求地址
    type：默认为get
    data：发送的数据，一个键值对象或用&连接的赋值字符串
    onsuccess：成功时的调用函数
    onfail：失败时的调用函数
*/
var ajax = function(options){
    var xhr = new XMLHttpRequest();
    var method, queryString = '', requestURL = options.url;
    var keyValuePairs = [];

    requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
    method = options.type ? options.type : 'get';

    // 处理传入的参数，编码并链接
    if (options.data) {
        if (typeof options.data == 'string') {
            queryString = options.data;
            requestURL += queryString;
        } else {
            for (var p in options.data){
                var key = encodeURIComponent(p);
                var value = encodeURIComponent(options.data[p]);
                keyValuePairs.push(key + '=' + value);
            }
            queryString = keyValuePairs.join('&');
            requestURL += queryString;
        }
    }

    // 回调操作
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                options.onsuccess(xhr.responseText);
            } else {
                if (options.onfail) {
                    options.onfail();
                } else {
                    alert('Sorry, your request is unsuccessful:' + xhr.statusText);
                }
            }
        }
    }

    // 发起请求
    if (method == 'get') {
        xhr.open(method, requestURL, true);
        xhr.send();
    } else {
        xhr.open(method, options.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(queryString);
    }

}
/*
Ajax加载课程列表方法
参数说明：
pageNo：             请求页数
psize：              每页返回总数
type：               课程类型
startPageIndex：     可选参数，位于第一个分页号的页数
currentPageIndex：   可选参数，动态生成分页导航后处于active状态的分页号页数

外面放一个totalPageCount用在分页器的边界判定
*/
var totalPageCount;
var getCourseList = function(pageNo, psize, type, startPageIndex, currentPageIndex){
    var ajaxOnsuccess = function(rText){
        var courseLists = [];
        var lenOfItems = 20;
        var ulOfCourse = document.querySelector("#course_list");

        courseLists = JSON.parse(rText);
        var segment = '';

        for (i = 0; i < lenOfItems ; i++) {
            segment +=
            '<li class="course_list_item">\
                <div class="course_img_wrapper">\
                    <img src=' + courseLists.list[i].bigPhotoUrl + '>\
                </div>\
                <div class="course_details">\
                    <h4 class="course_name">' + courseLists.list[i].name + '</h4>\
                    <h4 class="course_provider">' + courseLists.list[i].provider + '</h4>\
                    <div class="course_num_wrapper">' + courseLists.list[i].learnerCount + '</div>\
                    <h4 class="course_price"> ￥ ' + courseLists.list[i].price + '</h4>\
                </div>\
            </li>';
        }
        ulOfCourse.innerHTML = segment;
        var currentIndex;
        if (typeof currentPageIndex != 'undefined') {
            currentIndex = currentPageIndex;
        } else {
            currentIndex = pageNo - 1;
        }
        createPageNav(startPageIndex, currentIndex, 8);
        totalPageCount = courseLists.pagination.totlePageCount;
    };

    var options = {
        url: "http://study.163.com/webDev/couresByCategory.htm",
        type: 'get',
        data: {
            pageNo: pageNo,
            psize: psize,
            type: type
        },
        onsuccess: ajaxOnsuccess
    }

    ajax(options);
};
// 分页导航生成器
var createPageNav = function(startPageIndex, currentItemIndex, size){
    var pageNav_btn = document.querySelector('#pageNav_btn');
    var last_page_btn_tmpl = '<li class="last_page"><</li>';
    var next_page_btn_tmpl = '<li class="next_page">></li>';
    var pageNav_items = '';
    size = startPageIndex + size > totalPageCount? totalPageCount - startPageIndex + 1 : 8;

    pageNav_items += last_page_btn_tmpl;
    for (var i = 0; i < size; i++) {
        var pageIndexValue = startPageIndex + i;
        pageNav_items += '<li class="pageNav_item">' + pageIndexValue + '</li>';
    }
    pageNav_items += next_page_btn_tmpl;
    pageNav_btn.innerHTML = pageNav_items;
    var pageNav_item = pageNav_btn.querySelectorAll(".pageNav_item");
    var len = pageNav_item.length;
    var targetItem = pageNav_item[currentItemIndex] ? pageNav_item[currentItemIndex] : pageNav_item[len - 1];
    addClass(targetItem, 'active');
}
// 打乱数组（用于热门列表）
function shuffle(arr){
    var curIndex = arr.length;
    var tmpValue;
    var randomIndex;
    var resultArr = [];

    while (curIndex != 0) {
        randomIndex = Math.floor(Math.random() * curIndex);
        curIndex--;
        tmpValue = arr[curIndex];
        arr[curIndex] = arr[randomIndex];
        arr[randomIndex] = tmpValue;
    }

    return arr;
}

// 兼容

// addEventListener兼容
function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent('on' + sEventType, fnHandler);
    } else {
        oTarget['on' + sEventType] = fnHandler;
    }
}

// dataset兼容

if (typeof HTMLElement !== "undefined" && !Object.getOwnPropertyDescriptor(HTMLElement.prototype,"dataset")){
    //在HTMLElement.prototype上定义访问器属性dataset
    Object.defineProperty(HTMLElement.prototype,"dataset",{
        get:function(){
            //获取元素所有属性
            var attrs = this.attributes;
            var result = {};
            for (var i=0;i<attrs.length;i++){
                var attriName = attrs[i].nodeName;
                //判断属性名是否以"data-"开头
                if (/^data-/.test(attriName)){
                    //先去掉属性名开头的"data-"，然后若属性名有"-"则改写为驼峰写法
                    attriName = attriName.slice(5).replace(/-./g,function(m0){
                        return m0.slice(1).toUpperCase();
                    });
                    result[attriName] = attrs[i].value;
                }
            }
            return result;
        }
    });
}

// indexOf兼容

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(ele) {
        // 获取数组长度
        var len = this.length;
        // 检查第二个数字的值是否存在，默认为0
        var fromIndex = Number(arguments[1]) || 0;
        // 当第二个参数为负，则加上数组长度
        if (fromIndex < 0) {
            fromIndex += len;
        }
        // 从fromIndex开始循环数组
        while (fromIndex < len) {
            if (fromIndex in this && this[fromIndex] === ele) {
                return fromIndex;
            }
            fromIndex ++;
        }
        return -1;
    }
}

// banner

// 改变图片和小圆点
function changeTo(num){
    var curImg = document.querySelectorAll('.show')[0];
    var tarImg = imgArr[num];
    removeClass(curImg, 'show');
    addClass(tarImg, 'show');
    var curIndex = document.querySelectorAll('.active')[0];
    var tarIndex = indexArr[num];
    removeClass(curIndex, 'active');
    addClass(tarIndex, 'active');
}
// 小圆点点击事件监听
function indexClick(){
    for (var i = 0; i < imgLen; i++) {
        (function(_i){
            addEventHandler(indexArr[_i], 'click', function(){
                changeTo(_i);
                curIndex = _i;
            },false);
        })(i)
    }
}
// 停止自动播放
function stop(){
    clearInterval(autoChange);
}

var banner = document.querySelector('#banner');
var imgArr = document.querySelector('#list').querySelectorAll('li');
var imgLen = imgArr.length;
var indexArr = document.querySelector('#pointer').querySelectorAll('li');
var curIndex = 0;
var autoChange = setInterval(function(){
    if (curIndex < imgLen - 1){
        curIndex++;
    }else{
        curIndex = 0;
    }
    changeTo(curIndex);
}, 5000);



//cookie


// 点击不再提醒后设置本地cookie
var noRemind = document.querySelector("#tip_noremind");
addEventHandler(noRemind, 'click', function(){
    setCookie("noRemind", "1", 365);
    tip.style.display = "none";
}, false)
// 查询是否已有noRemind的cookie
var tip = document.querySelector("#tip");
var mycookie = getcookie();
if (mycookie.noRemind) {
    tip.style.display = "none";
}




var login_panel_cancel = document.querySelector("#login_panel_cancel");
var video_panel_cancel = document.querySelector("#video_panel_cancel");
var videoMask = document.querySelector("#videoMask");
var video_thumbnail = document.querySelector("#video_thumbnail");
var login = document.querySelector("#login");
var focus_btn = document.querySelector("#focus_btn");
var focused_btn = document.querySelector("#focused_btn");
var focused_btn_cancel = document.querySelector("#focused_btn_cancel");
var submit = document.querySelector("#submit");
// 关注成功操作
 function successFollow(){
    focus_btn.style.display = "none";
    focused_btn.style.display = "inline-block";
 }
 // 取消关注
 function unFollow(){
    focused_btn.style.display = "none";
    focus_btn.style.display = "inline-block";
 }
// 点击关注，判断是否已登录，未登陆则打开登陆页面
addEventHandler(focus_btn, 'click', function(){
    if (!mycookie.loginSuc) {
        login.style.display = "block";
    } else {
        successFollow();
    }
},false);
// 点击取消关注
addEventHandler(focused_btn_cancel, 'click', unFollow, false);
// 点击登陆面板的取消按钮，关闭面板
addEventHandler(login_panel_cancel, 'click', function(){
    login.style.display = "none";
},false);
// 视频取消按钮
addEventHandler(video_panel_cancel, 'click', function(){
    videoMask.style.display = "none";
}, false);
// 打开视频
addEventHandler(video_thumbnail, 'click', function(){
    videoMask.style.display = "block";
}, false);
// 登陆框提交监听
addEventHandler(submit, 'click', function(){
    var account = document.querySelector("#account").value;
    var password = document.querySelector("#password").value;
    if (!account || !password) {
        alert("请正确填写账号或密码");
    } else {
        ajaxOnsuccess = function(rText){
            if (rText === "1") {
                setCookie("loginSuc", '1', 1);
                login.style.display = "none";
                successFollow();
                alert('登陆成功');
            } else {
                alert('用户名或密码错误，请重新输入');
            }
        };
        options = {
            url: 'http://study.163.com/webDev/login.htm',
            data: {
                userName: md5(account),
                password: md5(password)
            },
            onsuccess: ajaxOnsuccess
        };
        ajax(options);
    }
},false)


// Ajax动态加载最热排行模块
var getHotList = (function(){
    var ajaxOnsuccess = function(rText){
        var hotLists = [];
        var lenOfItems = 10;
        var ulOfHot = document.querySelector("#hot_list");

        hotLists = shuffle(JSON.parse(rText));
        var segment = '';

        for (i = lenOfItems - 1; i >= 0; i--) {
            segment +=
            '<li class="hot_list_item">\
                <div class="hot_img_wrapper">\
                    <img src=' + hotLists[i].smallPhotoUrl + '>\
                </div>\
                <h4>' + hotLists[i].name + '</h4>\
                <div class="hot_num_wrapper">' + hotLists[i].learnerCount + '</div>\
            </li>';
        }
        ulOfHot.innerHTML = segment;
    };

    var options = {
        url: "http://study.163.com/webDev/hotcouresByCategory.htm",
        onsuccess: ajaxOnsuccess
    }
    ajax(options);
})();


getCourseList(1, 20, 10, 1);

// 分页器切换模块
var pageNavSwitch = (function(){
    var pageNav_btn = document.querySelector("#pageNav_btn");
    pageNav_btn.addEventListener('click', function(e){
        var targetIndex = e.target.innerHTML;
        var pageNav_item = pageNav_btn.querySelectorAll(".pageNav_item");
        var currentStartPageIndex = parseInt(pageNav_item[0].innerHTML);
        var currentEndPageIndex = parseInt(pageNav_item[pageNav_item.length - 1].innerHTML);
        var currentType = document.querySelector("#tab_btn").querySelectorAll(".active")[0].dataset.type;
        var currentPageIndex = parseInt(pageNav_btn.querySelectorAll(".active")[0].innerHTML);

        if (hasClass(e.target, 'pageNav_item')) {
            getCourseList(targetIndex, 20, currentType, currentStartPageIndex, targetIndex % 8 - 1 == -1 ? 7 : targetIndex % 8 - 1);
        } else if (hasClass(e.target, 'last_page')) {
            if (currentStartPageIndex > 8) {
                var newStartPageIndex = currentStartPageIndex - 8;
                targetIndex = currentPageIndex - 8;
                getCourseList(targetIndex, 20, currentType, newStartPageIndex, targetIndex % 8 - 1 == -1 ? 7 : targetIndex % 8 - 1);
            }
        } else if (hasClass(e.target, 'next_page')) {
            var newStartPageIndex = currentStartPageIndex + 8;
            targetIndex = currentPageIndex + 8;
            getCourseList(targetIndex, 20, currentType, newStartPageIndex, targetIndex % 8 - 1 == -1 ? 7 : targetIndex % 8 - 1);
        }

    },false)
})();

// Tab切换模块
var tabSwitch = (function(){
    var tab_btn = document.querySelector("#tab_btn");
    var tab_items = tab_btn.querySelectorAll(".tab");
    var len = tab_items.length;
    var currentTabIndex;

    addEventHandler(tab_btn, 'click', function(e){
        for (var i = 0; i < len; i++) {
            if (hasClass(tab_items[i], 'active')) {
                currentTabIndex = i;
                break;
            }
        }
        for (var i = 0; i < len; i++) {
            if (tab_items[i].contains(e.target)) {
                if (currentTabIndex == i) {
                    break;
                } else {
                    var type = tab_items[i].dataset.type;
                    getCourseList(1, 20, type, 1);
                    removeClass(tab_items[currentTabIndex], 'active');
                    addClass(tab_items[i], 'active');
                }
            }
        }
    },false)
})();

(function(){
    indexClick();
    addEventHandler(banner, 'mouseover', stop, false);
    addEventHandler(banner, 'mouseout', function(){
        autoChange = setInterval(function(){
            if (curIndex < imgLen - 1) {
                curIndex++;
            }else {
                curIndex = 0;
            }
            changeTo(curIndex);
        },5000);
    }, false);
})()
