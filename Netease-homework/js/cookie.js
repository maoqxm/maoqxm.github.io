// 设置cookie
function setCookie (name, value, expires, path, domain, secure){
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires){
        var today = new Date();
        today.setDate(today.getDate() + expires);
        cookie += '; expires=' + today.toGMTString();
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
// 点击不再提醒后设置本地cookie
var noRemind = document.getElementById("tip_noremind");
noRemind.addEventListener('click', function(){
    setCookie("noRemind", "1", 365);
    tip.style.display = "none";
}, false)
// 查询是否已有noRemind的cookie
var tip = document.getElementById("tip");
var mycookie = getcookie();
if (mycookie[noRemind]) {
    tip.style.display = "none";
}
