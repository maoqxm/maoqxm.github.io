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
                if (options.data.hasOwnProperty(p)) {
                    var key = encodeURIComponent(p);
                    var value = encodeURIComponent(options.data[p]);
                    keyValuePairs.push(key + '=' + value);
                }
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
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(queryString);
    }

}

var login_panel_cancel = document.getElementById("login_panel_cancel");
var video_panel_cancel = document.getElementById("video_panel_cancel");
var videoMask = document.getElementById("videoMask");
var video_thumbnail = document.getElementById("video_thumbnail");
var login = document.getElementById("login");
var focus_btn = document.getElementById("focus_btn");
var focused_btn = document.getElementById("focused_btn");
var focused_btn_cancel = document.getElementById("focused_btn_cancel");
var submit = document.getElementById("submit");
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
focus_btn.addEventListener('click', function(){
    if (!mycookie.loginSuc) {
        login.style.display = "block";
    } else {
        successFollow();
    }
},false);
// 点击取消关注
focused_btn_cancel.addEventListener('click', unFollow, false);
// 点击登陆面板的取消按钮，关闭面板
login_panel_cancel.addEventListener('click', function(){
    login.style.display = "none";
},false);
// 视频取消按钮
video_panel_cancel.addEventListener('click', function(){
    videoMask.style.display = "none";
}, false);
// 打开视频
video_thumbnail.addEventListener('click', function(){
    videoMask.style.display = "block";
}, false);
// 登陆框提交监听
submit.addEventListener('click', function(){
    var account = document.getElementById("account").value;
    var password = document.getElementById("password").value;
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

// 打乱数组
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

// Ajax动态加载最热排行模块
var getHotList = (function(){
    var ajaxOnsuccess = function(rText){
        var hotLists = [];
        var lenOfItems = 10;
        var ulOfHot = document.getElementById("hot_list");

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

// 分页导航生成器
var createPageNav = function(startPageIndex, currentItemIndex, size){
    var pageNav_btn = document.getElementById('pageNav_btn');
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
    var pageNav_item = pageNav_btn.getElementsByClassName("pageNav_item");
    var len = pageNav_item.length;
    var targetItem = pageNav_item[currentItemIndex] ? pageNav_item[currentItemIndex] : pageNav_item[len - 1];
    addClass(targetItem, 'active');
}

/*
Ajax加载课程列表方法
参数说明：
pageNo：             请求页数
psize：              每页返回总数
type：               课程类型
startPageIndex：     可选参数，位于第一个分页号的页数
currentPageIndex：   可选参数，动态生成分页导航后处于active状态的分页号页数
*/
var totalPageCount;
var getCourseList = function(pageNo, psize, type, startPageIndex, currentPageIndex){
    var ajaxOnsuccess = function(rText){
        var courseLists = [];
        var lenOfItems = 20;
        var ulOfCourse = document.getElementById("course_list");

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
getCourseList(1, 20, 10, 1);

// 分页器切换模块
var pageNavSwitch = (function(){
    var pageNav_btn = document.getElementById("pageNav_btn");
    pageNav_btn.addEventListener('click', function(e){
        var targetIndex = e.target.innerHTML;
        var pageNav_item = pageNav_btn.getElementsByClassName("pageNav_item");
        var currentStartPageIndex = parseInt(pageNav_item[0].innerHTML);
        var currentEndPageIndex = parseInt(pageNav_item[pageNav_item.length - 1].innerHTML);
        var currentType = document.getElementById("tab_btn").getElementsByClassName("active")[0].dataset.type;
        var currentPageIndex = parseInt(pageNav_btn.getElementsByClassName("active")[0].innerHTML);

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
    var tab_btn = document.getElementById("tab_btn");
    var tab_items = tab_btn.getElementsByClassName("tab");
    var len = tab_items.length;
    var currentTabIndex;

    tab_btn.addEventListener('click', function(e){
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
