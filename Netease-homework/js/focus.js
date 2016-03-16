var login_panel_cancel = document.getElementById("login_panel_cancel");
var login = document.getElementById("login");
var focus_btn = document.getElementById("focus_btn");
var account = document.getElementById("account").value;
var password = document.getElementById("password").value;
var submit = document.getElementById("submit");
// 点击关注，判断是否已登录，未登陆则打开登陆页面
focus_btn.addEventListener('click', function(){
    login.style.display = "block";
},false);
// 点击登陆面板的取消按钮，关闭面板
login_panel_cancel.addEventListener('click', function(){
    login.style.display = "none";
},false)
submit.addEventListener('click', function(){
    if (!account || !password) {
        alert("请正确填写账号或密码");
    } else {}
},false)
