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
