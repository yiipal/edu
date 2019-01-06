/**
 * Created by Renk on 2018/12/18.
 */
window.renk.canvasPainter = (function($) {
    var pub = {
        isActive: true,
        canvas: null,
        mouse:null,//鼠标位置
        origin:{x: 0, y: 0}, //格線原點座標
        scale:1,//缩放
        ctx: null,
        objects:{},
        init: function() {
            this.canvas = document.getElementById("canvas1");
            this.ctx = this.canvas.getContext('2d');
            this.canvas.onmousemove = function(e){ onMouseMove(e)};


            var point = {p1:{x:1,y:1},p2:{x:100,y:100}};
            // this.ray({p1:{x:1,y:1},p2:{x:100,y:100}},2);
            var blackLine = new BlackLine();
            blackLine.draw(point,this.ctx);
        },
        ray: function(graph,color){
          this.ctx.beginPath();
          this.ctx.strokeStyle = color ? color : 'black';
          ang1 = Math.atan2((graph.p2.x - graph.p1.x), (graph.p2.y - graph.p1.y)); //從斜率取得角度
          cvsLimit = this.canvas.height + this.canvas.width;
          this.ctx.moveTo(graph.p1.x, graph.p1.y);
          this.ctx.lineTo(graph.p1.x + Math.sin(ang1) * cvsLimit, graph.p1.y + Math.cos(ang1) * cvsLimit);
          this.ctx.stroke();
        },
    };

    function onMouseMove(e) {
        var et = e;
        if (e.changedTouches) {console.log(111);
            var et = e.changedTouches[0];
        }

        pub.mouse = graphs.point((et.pageX - e.target.offsetLeft - pub.origin.x) / pub.scale, (et.pageY - e.target.offsetTop - pub.origin.y) / pub.scale); //滑鼠實際位置
        console.log(pub.mouse);
        // console.log(e.target.offsetLeft);
        // console.log(origin.x);
    }

    return pub;
})(window.jQuery);