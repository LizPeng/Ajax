//闭包修正

var handler = {
	message:"Event handled",
	handleClick:function(event){
		alert(this.message);
	}
}
var btn = document.getElementById("my-btn");
//EventUtil.addHandler(btn,"click", handler.handleClick);//显示undefined
EventUtil.addHandler(btn, "click", function(event){
  handler.handlerClick(event);
})
//这个解决方案在onClick事件处理程序内使用了一个闭包直接调用handler.handleClick()。
//很多JavaScript库实现了一个可以将函数绑定到指定环境的函数。这个函数一般都叫bind() 语法如下：
function bind(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  }
}
//这个函数似乎简单，但其功能是强大的。在bind()创建了一个闭包，闭包使用apply()调用传入的函数，
EventUtil.addHandler(btn, "click", bind(handler.handleClick, handler));



//创建柯里化函数的通用方式
function curry(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(null, finalArgs);
  }
}
//curry()函数的主要工作就是将被返回函数的参数进行排序。curry()的第一个参数是要进行柯里化的函数，其他参数是要传入的值。为了获取第一个参数之后的所有参数，在arguments对象上调用了slice()方法，并传入参数1表示被返回的数组包含从第二参数开始的所有参数。然后args数组包含了来自外部函数的参数。在内部参数中，创建了innerArgs数组用来存放所有传入的参数(又一次用到了slice())。有了存放来组外部函数和内部函数的参数数组后，就可以使用cancat()方法将他们组合为finalArgs，然后使用apply()将结果传递给该函数。注意这个函数并没有考虑到执行环境，所以调用apply()时第一个参数是null。curry()函数可以按以下方式应用。

//函数柯里化还常常作为函数绑定的一部分包含在其中，构造出更为复杂的bind()函数。例如：

function bind(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function(){
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(context, finalArgs);
  }
}
//对curry()函数的主要更改在于传入的参数个数，以及它如何影响代码的结果。curry()仅仅接受一个要包裹的函数作为参数，而bind()同时接受函数和一个object对象。这表示给被绑定的函数的参数是从第三个开始而不是第二个，这就要更改slice()的第一处调用。另一处更改是在倒数第三行将object对象传给apply()。当使用bind()时，它会返回绑定到给定环境的函数，并且可能它其中某些函数参数已经被设好。当你想除了event对再额外给事件处理程序传递参数时，这非常有用，例如：

var handler = {
  message:'Event handled',
  handleClick: function(name, event) {
    alert(this.message+': '+ event.type);
  }
};
EventUtil.addHandler(btn,"click", bind(handler.handleClick, handler, "my-btn"));

//在这个更新的例子中，handler.handleCLick()方法接受了两个参数：要处理的元素名字和event对象。作为第三个参数传递给bind()函数的名字，又被传递给了handler.handleClick(),而handler.handleClick()也会同时接收到event对象。

//ES5的bind()方法也实现函数柯里化，只要在this的值之后再传入另一个参数即可。

EventUtil.addHandler(btn, "click", handler.handleClick.bind(handler, "my-btn"));

