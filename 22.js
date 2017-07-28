//数组分块函数
function chunk(array, process, context) {
  setTimeout(function(){
    var item = array.shift();
    process.call(context, item);
    if(array.length>0) {
      setTimeout(arguments.callee, 100);
    }
  }, 100);
}

//22.3.3函数节流
var processor = {
  timeoutId: null,
  //实际进行处理的方法
  performProcessing: function(){
    //实际执行的代码
  },
  //初始处理调用的方法
  process: function() {
    clearTimeout(this.timeoutId);

    var that = this;
    this.timeoutId = setTimeout(function(){
      that.performProcessing();
    }, 100)
  }
};
//尝试开始执行
processor.process();

//throttle()
function throttle(method, context){
  clearTimeout(method.tId);
  method.tId = setTimeout(function(){
    method.call(context);
  },100);
}

function resizeDiv(){
  var div = document.getElementById('myDiv')
  div.style.height = div.offsetWidth +"px";
}
window.onresize = function(){
  throttle(resizeDiv)
}