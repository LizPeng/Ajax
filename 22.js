function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
}
var person = Person("Nicholas", 29, "Software Engineer");
alert(window.name);//"Nicholas"



//作用域安全的构造函数在进行任何更改前，首先确认this对象是正确类型的实例。
//如果不是，那么会创建新的实例并返回。请看以下例子：
function Person(name, age, job){
  if(this instanceof Person){
    this.name = name;
    this.age = age;
    this.job = job;
  } else {
    return new Person(name, age, job);
  }
}
var person1 = Person("Nicholas", 29, "Software Engineer");
alert(window.name); //""
alert(person1.name); //"Nicholas"


function Polygon(sides) {
  if(this instanceof Polygon){
    this.sides = sides;
    this.getArea = function() {
      return 0;
    }
  } else {
    return new Polygon(sides)
  }
}

function Rectangle(width, height){
  Polygon.call(this, 2);
  this.width = width;
  this.height = height;
  this.getArea = function(){
    return this.width * this.height;
  };
}

var rect = new Rectangle(5, 10);
console.log(rect.sides);//undefined

//这段代码中，Polygon构造函数是作用域安全的，然而Rectangle构造函数则不是。新创建一个Rectangle实例后，这个实例应该通过Polygon.call()来继承Polygon的sides属性。但是，由于Polygon构造函数式作用域安全的，this对象并非polygon的实例，所以会创建并返回一个新的Polygon对象。Rectangle构造函数中的this病毒并没有得到增长，同时Polygong.call()返回的值也没有用到，所以Rectangle实例中就不会有sides属性。

//如果构造函数窃取结合使用原型链或者寄生组合则可以解决这个问题。考虑一下例子:
Rectangle.prototype = new Polygon();
var rect = new Rectangle(5, 10);
console.log(rect.sides); //2 

//上面这段重写的代码中，一个Rectangle实例也同时是一个Polygon实例，所以Polygong.call()会照愿意执行，最终为Rectangle实例先加了sides属性。