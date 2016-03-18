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
var login = document.getElementById("login");
var focus_btn = document.getElementById("focus_btn");
var focused_btn = document.getElementById("focused_btn");
var submit = document.getElementById("submit");
// 点击关注，判断是否已登录，未登陆则打开登陆页面
focus_btn.addEventListener('click', function(){
    if (!mycookie.loginSuc) {
        login.style.display = "block";
    } else {
        focus_btn.style.display = "none";
        focused_btn.style.display = "inline-block";
    }
},false);
// 点击登陆面板的取消按钮，关闭面板
login_panel_cancel.addEventListener('click', function(){
    login.style.display = "none";
},false)
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
                //successFollow();
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
