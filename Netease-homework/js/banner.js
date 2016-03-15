// 根据实际页面动态生成容器高度
function bannerHeight(){
    var img = imgArr[0];
    var rightHeight = window.getComputedStyle(img).getPropertyValue('height');
    banner.style.height = rightHeight;
}
// 判断是否有cls类
function hasClass(obj, cls){
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    return obj.className.match(reg);
}
// 增加cls类
function addClass(obj, cls){
    if (!hasClass(obj,cls)){
        obj.className += ' ' + cls;
    }
}
// 移除cls类
function removeClass(obj, cls){
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ''); // 这里有个小问题就是 如果是"aa bb cc".replace(" bb ", '')这种情况就会导致aa和cc之间没有空格
}
// 改变图片和小圆点
function changeTo(num){
    var curImg = document.getElementsByClassName('show')[0];
    var tarImg = imgArr[num];
    removeClass(curImg, 'show');
    addClass(tarImg, 'show');
    var curIndex = document.getElementsByClassName('active')[0];
    var tarIndex = indexArr[num];
    removeClass(curIndex, 'active');
    addClass(tarIndex, 'active');
}
// 小圆点点击事件监听
function indexClick(){
    for (i = 0; i < imgLen; i++){
        (function(_i){
            indexArr[_i].addEventListener('click', function(){
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


var banner = document.getElementById('banner');
var imgArr = document.getElementById('list').getElementsByTagName('li');
var imgLen = imgArr.length;
var indexArr = document.getElementById('pointer').getElementsByTagName('li');
var curIndex = 0;
var autoChange = setInterval(function(){
    if (curIndex < imgLen - 1){
        curIndex++;
    }else{
        curIndex = 0;
    }
    changeTo(curIndex);
}, 5000);

window.onload = function(){
    bannerHeight();
    indexClick();
    banner.addEventListener('mouseover', stop, false);
    banner.addEventListener('mouseout', function(){
        autoChange = setInterval(function(){
            if(curIndex < imgLen - 1){
                curIndex++;
            }else{
                curIndex = 0;
            }
            changeTo(curIndex);
        },5000);
    }, false);
    window.addEventListener('resize',bannerHeight,false);
}
