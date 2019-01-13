/**
 * Created by Renk on 2018/12/18.
 */

var graphs = {
    /**
     * 基本圖型
     **/
    point: function(x, y) {return {type: 'point', x: x, y: y, exist: true}},

    line: function(p1, p2) {return {type: 'line', p1: p1, p2: p2, exist: true}},

    ray: function(p1, p2) {return {type: 3, p1: p1, p2: p2, exist: true}},

    line_segment: function(p1, p2) {return {type: 4, p1: p1, p2: p2, exist: true}},

    segment: function(p1, p2) {return {type: 4, p1: p1, p2: p2, exist: true}},

    circle: function(c, r) {
        if (typeof r == 'object' && r.type == 1) {
            return {type: 5, c: c, r: this.line_segment(c, r), exist: true}
        } else {
            return {type: 5, c: c, r: r, exist: true}
        }
    },
    /**
     * inner product
     * @method dot
     * @param {graph.point} p1
     * @param {graph.point} p2
     * @return {Number}
     **/
    dot: function(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    },
    /**
     * outer product
     * @method cross
     * @param {graph.point} p1
     * @param {graph.point} p2
     * @return {Number}
     **/
    cross: function(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    },
    /**
     * 求交點
     * @method intersection
     * @param {graph} obj1
     * @param {graph} obj2
     * @return {graph.point}
     **/
    intersection: function(obj1, obj2) {
        // line & line
        if (obj1.type == 2 && obj2.type == 2) {
            return this.intersection_2line(obj1, obj2);
        }
        // line & circle
        else if (obj1.type == 2 && obj2.type == 5) {
            return this.intersection_line_circle(obj1, obj2);
        }
        // circle & line
        else if (obj1.type == 5 && obj2.type == 2) {
            return this.intersection_line_circle(obj2, obj1);
        }
    },
    /**
     * 兩直線交點
     * @method intersection_2line
     * @param {graph.line} l1
     * @param {graph.line} l2
     * @return {graph.point}
     **/
    intersection_2line: function(l1, l2) {
        var A = l1.p2.x * l1.p1.y - l1.p1.x * l1.p2.y;
        var B = l2.p2.x * l2.p1.y - l2.p1.x * l2.p2.y;
        var xa = l1.p2.x - l1.p1.x;
        var xb = l2.p2.x - l2.p1.x;
        var ya = l1.p2.y - l1.p1.y;
        var yb = l2.p2.y - l2.p1.y;
        return graphs.point((A * xb - B * xa) / (xa * yb - xb * ya), (A * yb - B * ya) / (xa * yb - xb * ya));
    },
    /**
     * 直線與圓的交點
     * @method intersection_2line
     * @param {graph.line} l1
     * @param {graph.circle} c2
     * @return {graph.point}
     **/
    intersection_line_circle: function(l1, c1) {
        var xa = l1.p2.x - l1.p1.x;
        var ya = l1.p2.y - l1.p1.y;
        var cx = c1.c.x;
        var cy = c1.c.y;
        var r_sq = (typeof c1.r == 'object') ? ((c1.r.p1.x - c1.r.p2.x) * (c1.r.p1.x - c1.r.p2.x) + (c1.r.p1.y - c1.r.p2.y) * (c1.r.p1.y - c1.r.p2.y)) : (c1.r * c1.r);

        var l = Math.sqrt(xa * xa + ya * ya);
        var ux = xa / l;
        var uy = ya / l;

        var cu = ((cx - l1.p1.x) * ux + (cy - l1.p1.y) * uy);
        var px = l1.p1.x + cu * ux;
        var py = l1.p1.y + cu * uy;


        var d = Math.sqrt(r_sq - (px - cx) * (px - cx) - (py - cy) * (py - cy));

        var ret = [];
        ret[1] = graphs.point(px + ux * d, py + uy * d);
        ret[2] = graphs.point(px - ux * d, py - uy * d);

        return ret;
    },


    intersection_is_on_ray: function(p1, r1) {
        return (p1.x - r1.p1.x) * (r1.p2.x - r1.p1.x) + (p1.y - r1.p1.y) * (r1.p2.y - r1.p1.y) >= 0;
    },


    intersection_is_on_segment: function(p1, s1) {
        return (p1.x - s1.p1.x) * (s1.p2.x - s1.p1.x) + (p1.y - s1.p1.y) * (s1.p2.y - s1.p1.y) >= 0 && (p1.x - s1.p2.x) * (s1.p1.x - s1.p2.x) + (p1.y - s1.p2.y) * (s1.p1.y - s1.p2.y) >= 0;
    },

    /**
     * 線段長度
     * @method length_segment
     * @param {graph.segment} seg
     * @return {Number}
     **/
    length_segment: function(seg) {
        return Math.sqrt(this.length_segment_squared(seg));
    },
    /**
     * 線段長度平方
     * @method length_segment_squared
     * @param {graph.segment} seg
     * @return {Number}
     **/
    length_segment_squared: function(seg) {
        return this.length_squared(seg.p1, seg.p2);
    },
    /**
     * 兩點距離
     * @method length
     * @param {graph.point} p1
     * @param {graph.point} p2
     * @return {Number}
     **/
    length: function(p1, p2) {
        return Math.sqrt(this.length_squared(p1, p2));
    },
    /**
     * 兩點距離平方
     * @method length_squared
     * @param {graph.point} p1
     * @param {graph.point} p2
     * @return {Number}
     **/
    length_squared: function(p1, p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return dx * dx + dy * dy;
    },

    /*
    * 基本作圖函數
    */
    /**
     * 線段中點
     * @method midpoint
     * @param {graph.line} l1
     * @return {graph.point}
     **/
    midpoint: function(l1) {
        var nx = (l1.p1.x + l1.p2.x) * 0.5;
        var ny = (l1.p1.y + l1.p2.y) * 0.5;
        return graphs.point(nx, ny);
    },
    /**
     * 線段中垂線
     * @method perpendicular_bisector
     * @param {graph.line} l1
     * @return {graph.line}
     **/
    perpendicular_bisector: function(l1) {
        return graphs.line(
            graphs.point(
                (-l1.p1.y + l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
                (l1.p1.x - l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
            ),
            graphs.point(
                (l1.p1.y - l1.p2.y + l1.p1.x + l1.p2.x) * 0.5,
                (-l1.p1.x + l1.p2.x + l1.p1.y + l1.p2.y) * 0.5
            )
        );
    },
    /**
     * 畫通過一點且與一直線平行的線
     * @method parallel
     * @param {graph.line} l1
     * @param {graph.point} p1
     * @return {graph.line}
     **/
    parallel: function(l1, p1) {
        var dx = l1.p2.x - l1.p1.x;
        var dy = l1.p2.y - l1.p1.y;
        return graphs.line(p1, graphs.point(p1.x + dx, p1.y + dy));
    }
};


var helper = {
    mouseOnPoint:function(mouse, point, clickExtentPoint){
        return graphs.length_squared(mouse, point) < clickExtentPoint * clickExtentPoint;
    },
    mouseOnFirstPoint:function(mouse, point, clickExtentPoint){
        helper.mouseOnPoint(mouse, point, clickExtentPoint);
    },
    convertObjectToLine:function(object){
        return graphs.line({x:object.startPoint.x,y:object.startPoint.y}, {x:object.endPoint.x,y:object.endPoint.y});
    },
    rayIntersection: function(obj, ray) {
        var rp_temp = graphs.intersection_2line(graphs.line(ray.p1, ray.p2), graphs.line(obj.p1, obj.p2));   //求光(的延長線)與物件(的延長線)的交點

        if (graphs.intersection_is_on_segment(rp_temp, obj) && graphs.intersection_is_on_ray(rp_temp, ray))
        {
            //↑若rp_temp在ray上且rp_temp在obj上(即ray真的有射到obj,不是ray的延長線射到或射到obj的延長線上)
            return rp_temp; //回傳光線的頭與鏡子的交點
        }
        return false;
    }
};


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

};

ObjectType.prototype.startPoint = {};
ObjectType.prototype.endPoint = {};
ObjectType.prototype.points = {};
ObjectType.prototype.pub = {};
ObjectType.prototype.selected = false;//物体被选中
ObjectType.prototype.selectedStartPoint = false;//起始点被选中
ObjectType.prototype.selectedEndPoint = false;//结束点被选中
ObjectType.prototype.creating = false;//正在被创建中
ObjectType.prototype.effectRay = false;//物体是否会影响光

ObjectType.prototype.shoot = function(){
  console.log('shoot！');
};

ObjectType.prototype.mouseDown = function(event,pub){
    this.pub = pub;
    if(this.creating){
        this.creating = false;
    }
     this.selectedStartPoint = this.selected && this.isSelectStartPoint();
     this.selectedEndPoint = this.selected && this.isSelectEndPoint();

};

ObjectType.prototype.mouseMove = function(event){
    this.draw(event);
};
ObjectType.prototype.mouseUp = function(event){
    this.selected = false;
    this.selectedStartPoint = false;
    this.selectedEndPoint = false;
};

ObjectType.prototype.draw = function(){
    console.log('draw！');
};

ObjectType.prototype.setPub = function(pub){
    this.pub = pub;
    return this;
};

ObjectType.prototype.update = function(pub){
    this.pub = pub;
    if(this.selected){
        return this;
    }
    if(pub.currentObject.getId() == this.getId()){
        this.startPoint = pub.startPoint;
        this.endPoint = pub.currentPoint;
    }

    return this;
};

ObjectType.prototype.getId = function(){
    if(!this.id){
        this.id = this.constructor.name+new Date().getTime();
    }
    return this.id;
};

//检测自己是否被选中
ObjectType.prototype.isSelected = function(mouse){
    var segment={p1:this.startPoint,p2:this.endPoint};
    var d_per = Math.pow((mouse.x - segment.p1.x) * (segment.p1.y - segment.p2.y) + (mouse.y - segment.p1.y) * (segment.p2.x - segment.p1.x), 2) / ((segment.p1.y - segment.p2.y) * (segment.p1.y - segment.p2.y) + (segment.p2.x - segment.p1.x) * (segment.p2.x - segment.p1.x)); //類似於滑鼠與直線垂直距離
    var d_par = (segment.p2.x - segment.p1.x) * (mouse.x - segment.p1.x) + (segment.p2.y - segment.p1.y) * (mouse.y - segment.p1.y); //類似於滑鼠在直線上投影位置
    return d_per < this.pub.clickExtentLine * this.pub.clickExtentLine && d_par >= 0 && d_par <= graphs.length_segment_squared(segment);
};

//检测自己起始点是否被选中
ObjectType.prototype.isSelectStartPoint = function(){
    var pub = this.pub;
    if (helper.mouseOnPoint(pub.startPoint, this.startPoint,pub.clickExtentPoint) && graphs.length_squared(pub.startPoint, this.startPoint) <= graphs.length_squared(pub.startPoint, this.endPoint)) {
        console.log('select first point');
        return true;
    }
    return false;
};

//检测自己结束点是否被选中
ObjectType.prototype.isSelectEndPoint = function(){
    var pub = this.pub;
    if (helper.mouseOnPoint(pub.startPoint, this.endPoint,pub.clickExtentPoint)){console.log('select end point');
        return true;
    }
    return false;
};


//-----不透光墙------
function BlackLine() {
  this.title = '遮挡墙';
  this.effectRay = 'block';
};
getPrototype(BlackLine,ObjectType);
BlackLine.prototype.draw = function() {
    if(this.selected){
        //拖拽起始点
        if(this.selectedStartPoint){
            this.startPoint = this.pub.currentPoint;
        }
        //拖拽终点
        if(this.selectedEndPoint){
            this.endPoint = this.pub.currentPoint;
        }
    }
    var ctx = this.pub.ctx;
    ctx.strokeStyle = 'rgb(70,35,10)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.stroke();
    ctx.lineWidth = 1;
};

BlackLine.prototype.shoot = function(obj,ray){
  ray.exist = false;
};

BlackLine.prototype.isSelected = function(mouse){
    var segment={p1:this.startPoint,p2:this.endPoint};
    var d_per = Math.pow((mouse.x - segment.p1.x) * (segment.p1.y - segment.p2.y) + (mouse.y - segment.p1.y) * (segment.p2.x - segment.p1.x), 2) / ((segment.p1.y - segment.p2.y) * (segment.p1.y - segment.p2.y) + (segment.p2.x - segment.p1.x) * (segment.p2.x - segment.p1.x)); //類似於滑鼠與直線垂直距離
    var d_par = (segment.p2.x - segment.p1.x) * (mouse.x - segment.p1.x) + (segment.p2.y - segment.p1.y) * (mouse.y - segment.p1.y); //類似於滑鼠在直線上投影位置
    return d_per < this.pub.clickExtentLine * this.pub.clickExtentLine && d_par >= 0 && d_par <= graphs.length_segment_squared(segment);
};

//-----单条光线------
function Ray() {
    this.title = '光线';
    this.finalPoint = {x:0,y:0};
}
getPrototype(Ray,ObjectType);
Ray.prototype.draw = function() {
    var pub = this.pub;
    if(this.selected){
        //拖拽起始点
        if(this.selectedStartPoint){
            this.startPoint = this.pub.currentPoint;
        }
        //拖拽终点
        if(this.selectedEndPoint){
            this.endPoint = this.pub.currentPoint;
        }
    }

    var ang1 = Math.atan2((this.endPoint.x - this.startPoint.x), (this.endPoint.y - this.startPoint.y)); //從斜率取得角度
    cvsLimit = pub.canvas.height + pub.canvas.width;
    this.finalPoint.x = this.startPoint.x + Math.sin(ang1) * cvsLimit;
    this.finalPoint.y = this.startPoint.y + Math.cos(ang1) * cvsLimit;

    for (var id in pub.objects){
        var object = pub.objects[id];
        if(!object.effectRay) continue;
        l1 = helper.convertObjectToLine(object);
        l2 = helper.convertObjectToLine(this);
        var intersection = helper.rayIntersection(l1,l2);
        console.log(intersection);
    }

    var ctx = pub.ctx;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.finalPoint.x, this.finalPoint.y);
    ctx.stroke();
};

//-------拖动点----------
function Pointer() {
    this.title = '拖动点';
}
getPrototype(Pointer,ObjectType);
Pointer.prototype.draw = function() {
    var ctx = this.pub.ctx;
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(this.startPoint.x - 2, this.startPoint.y - 2, 5, 5); //繪製填滿的矩形
    ctx.stroke();
};