//上一章的createXHR函数 
  function createXHR() {
    if(typeof XMLHttpRequest != "undefined") {
      return new XMLHttpRequest();
    }else if (typeof ActiveXObject != "undefined"){
      if(typeof arguments.callee.activeXString != "string"){
        var versions = [ "MSXML2.XMLHttp.6.0", "MSXML.XMLHttp.3.0", "MSXML2.XMLHttp"],
                        i, len;
        for(i=0, len=versions.length; i<len; i++){
          try {
            new ActiveXObject(version[i]);
            arguments.callee.activeXString = versions[i]
            break;
          }catch(ex){
            //跳过
          }
        }
      }
      return new ActiveXObject(arguments.callee.activeXString);
    } else {
      throw new Error("NO XHR object available.")
    }
  }

//用下面的方式使用惰性载入重写
  function createXHR(){
    if(typeof XMLHttpRequest != "undefined") {
      createXHR = function(){
        return new XMLHttpRequest();
      }
    }else if (typeof ActiveXObject != "undefined"){
      createXHR = function(){
        if(typeof arguments.callee.activeXString != "string"){
          var versions = [ "MSXML2.XMLHttp.6.0", "MSXML.XMLHttp.3.0", "MSXML2.XMLHttp"],
                          i, len;
          for(i=0, len=versions.length; i<len; i++){
            try {
              new ActiveXObject(version[i]);
              arguments.callee.activeXString = versions[i]
              break;
            }catch(ex){
              //跳过
            }
          }
        }
        return new ActiveXObject(arguments.callee.activeXString);
      }
    } else {
      createXHR = function(){
        throw new Error("NO XHR object available.")
      }
    }
    return createXHR()
  }
//这个惰性载入的createXHR()中，if语句的每一个分支都会为createXHR变量赋值，有效覆盖了原有的函数。
//最后一步便是调用新赋的函数。下一次调用createXHR()的时候，就会直接调用被分配的函数，不用再次执行if语句了。


//第二种实现惰性载入的方式是在声明函数时就指定适当的函数。这样，第一次调用函数时就不会损失性能了，而在代码首次加载时会损失一点性能。以下就是按照这一思路重写前面例子的结果：
var createXHR1 = (function createXHR() {
    if(typeof XMLHttpRequest != "undefined") {
      return new XMLHttpRequest();
    }else if (typeof ActiveXObject != "undefined"){
      if(typeof arguments.callee.activeXString != "string"){
        var versions = [ "MSXML2.XMLHttp.6.0", "MSXML.XMLHttp.3.0", "MSXML2.XMLHttp"],
                        i, len;
        for(i=0, len=versions.length; i<len; i++){
          try {
            new ActiveXObject(version[i]);
            arguments.callee.activeXString = versions[i]
            break;
          }catch(ex){
            //跳过
          }
        }
      }
      return new ActiveXObject(arguments.callee.activeXString);
    } else {
      throw new Error("NO XHR object available.")
    }
  }
)()
//这个例子中使用的技巧是创建一个匿名函数、自执行的函数，用以确定应该使用哪一个函数实现。