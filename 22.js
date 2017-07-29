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

//22.4 自定义事件
function inheritPrototype(subType, superType){
  var prototype = Object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}
function EventTarget() {
  this.handlers = {};
}

EventTarget.prototype = {
  constructor:EventTarget,
  addHandler: function(type, handler) {
    if(typeof this.handlers[type] == 'undefined'){
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  },
  fire: function(event) {
    if(!event.target){
      event.target = this;
    }
    if(this.handlers[event.type] instanceof Array){
      var handlers = this.handlers[event.type];
      for(var i= 0, len = handlers.length; i < len ;i ++){
        handlers[i](event);
      }
    }
  },
  removeHandler: function(type, handler) {
    if(this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for(var i = 0, len = handlers.length; i<len; i++){
        if(handlers[i] === handler){
          break;
        }
      }
      handlers.splice(i, 1);
    }
  }
};

function Person(name, age) {
  EventTarget.call(this)
  this.name= name;
  this.age = age;
}
//使用寄生组合继承EventTarget.
inheritPrototype(Person, EventTarget);
Person.prototype.say = function(message) {
  this.fire({type:'message', message:message});
};
//调用方式
function handleMessage(event) {
  alert(event.target.name + " says: "+ event.message);
}
//创建新的person
var person = new Person("Nicholas", 28);
//添加一个事件处理从程序
person.addHandler("message", handleMessage);
person.say("Hi there.");
