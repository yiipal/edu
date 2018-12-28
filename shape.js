/**
 * Created by Renk on 2018/12/18.
 */

window.objectTypes = {};

function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function getPrototype(child, parent) {
  var prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
  return child;
}

//基类
function getObject(objectName) {
  return renk.getPrototype(objectName,ObjectType);
}

function ObjectType(){
  this.label = '';
};

ObjectType.prototype.shoot = function(){
  console.log('shoot！');
};

ObjectType.prototype.mouseDown = function(obj, mouse){
  console.log('shoot！');
};


//-----------
function BlackLine() {
  this.name = 'Black Line';
};
getPrototype(BlackLine,ObjectType);
BlackLine.prototype.draw = function(obj, ctx) {
  //var ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgb(70,35,10)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(obj.p1.x, obj.p1.y);
  ctx.lineTo(obj.p2.x, obj.p2.y);
  ctx.stroke();
  ctx.lineWidth = 1;
};

BlackLine.prototype.shoot = function(obj,ray){
  ray.exist = false;
};

//-----------
