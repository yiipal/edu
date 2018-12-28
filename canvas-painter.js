/**
 * Created by Renk on 2018/12/18.
 */
window.renk.canvasPainter = (function($) {
    var pub = {
        isActive: true,
        canvas: null,
        ctx: null,
        objects:{},
        init: function() {
            this.canvas = document.getElementById("canvas1");
            this.ctx = this.canvas.getContext('2d');
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

    return pub;
})(window.jQuery);