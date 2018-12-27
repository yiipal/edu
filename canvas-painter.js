/**
 * Created by Renk on 2018/12/18.
 */
window.renk.canvasPainter = (function($) {
    var pub = {
        isActive: true,
        canvas: null,
        init: function() {
            this.canvas = document.getElementById('canvas1');
            this.ray(1,2);
        },

        ray: function(graph,color){
          this.canvas.add(new fabric.Line([100, 100, 300, 300], {
            left: 100,
            top: 100,
            stroke: 'red',
            type: 'ray'
          }));

          // create a rectangle object
          var rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 20,
            height: 20
          });

          // "add" rectangle onto canvas
          this.canvas.add(rect);
        },
        // ... other public functions and properties go here ...
    };
    
    function move (event) {
        if(event.target.type == 'ray'){
            var target = event.target;
          var ang1 = Math.atan2((target.x2 - target.x1), (target.y2 - target.y1));
          console.log(ang1);
          // console.log(event.target);
        }
    }
    
    // ... private functions and properties go here ...
    return pub;
})(window.jQuery);