//21.1.4 POST请求
//通常用于向服务器发送应该被保存的数据。POST请求应该把数据作为请求的主题提交，而GET请求传统上不是专业。POST请求的主题可以包含非常多的数据，而且格式不限。在open()方法第一个参数的位置传入“post”，就可以初始化一个POST请求，如下面的例子所示。
xhr.open("post", "example.php", true);
//发送POST请求第二布就是向send()方法中传入某些数据。由于XHR最初的设计主要是为了处理XML，因此可以在此传入XML DOM文档，传入的文档经序列化之后将作为请求主题被提交到服务器。当然，也可以额在此传入任何发送到服务器的字符串。
//默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁。因此，服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。不过，我们可以使用XHR来模仿表单提交：
//首先将Content-Type头部信息设置为applicatoin/x-www-form-urlencoded，也就是表单提交时的内容类型
//其次是以适当的格式创建一个字符串。第14章层级讨论过，POST数据的格式与查询字符串格式相同。
//如果需要将页面中表单的数据进行序列化，然后再通过XHR发送到服务器，那么就可以使用第14章介绍的serialize()函数来创建这个字符串

//要用到的函数createXHR() serialize(form)
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
  //表单序列化的代码
    function serialize(form) {
      var parts = [],
      field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;
        for (i=0 , len=form.elements.length;i<len;i++){
          switch(field.type){
            case "select-one":
            case "select-multiple":
            if (field.name.length) {
              for (j=0, optLen = field.options.length; j< optLen;j++){
                option = field.options[j];
                if(option.selected){
                  optValue = "";
                  if (option.hasAttribute) {
                    optValue = (option.haAttribute("value")?
                                option.value : option.text );
                  }else {
                    optValue = (option.attributes["value"].spectified ?
                                option.value : option.text);
                  }
                  parts.push(encodeURIComponent(field.name) + "=" +
                             encodeURIComponent(optValue));
                }
              }
            }
            break;
            case undefined: //字符集
            case "file":    //文件输入
            case "submit":  //提交按钮
            case "reset":   //重置按钮
            case "button":  //自定义按钮
            break;
            case "radio":   //单选按钮
            case "checkbox"://复选框
            if(!field.checked){
              break;
            }
            default:
              if(field.name.length){
                parts.push(encodeURIComponent(field.name) + "=" +
                             encodeURIComponent(field.value));
              }
          }
        }
      return parts.join("&")
    }
    // serialize(form)()
///


function submitData() {
  var xhr = createXHR();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
      if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        alert(xhr.responseText);
      } else {
        alert("Request was successful: "+ xhr.status);
      }
    }
  };
  xhr.open("post", "postexample.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var form = document.getElementById("user-info");
  xhr.send(serialize(form));
}
//这个函数可以将ID为user-info的表单中的数据序列化之后发给服务器。而示例PHP就可以通过$_POST取得提交的数据了


/////21.2XMLHttpRequest 2级
//21.2.1 FormData
//


//21.4.5跨浏览器的CORS
function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  if("withCredentials" in xhr){
    xhr.open(method, url, true)
  } else if(typeof XDomainRequest != "undefined"){
    vxhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null
  }
  return xhr
}

var request = createCORSRequest("get", "http://www.somewhere-else.com/page/")
if(request){
  request.onload = function(){
    //对request.responseText进行处理
  }
  request.send()
}

//使用XHR对象实现HTTP流的典型代码如下所示。

function createStreamingClient(url, progress, finished){
  var xhr = new XMLHttpRequest(),
      received = 0;
  xhr.open("get", url, true);
  xhr.onreadystatechange = function() {
    var result;
    if(xhr.readyState == 3 ){
      //只取得最新数据并调整计数器
      result = xhr.responseText.substring(received);
      received += result.length;
    }else if(xhr.readyStae == 4){
      finished(xhr.responseText)
    }
  };
  xhr.send(null);
  return xhr;
}

var client = createStreamingClient("streaming.php", function(data){
  alert("Received: "+CharacterData)
}, function(data){
  alert("Done!")
})