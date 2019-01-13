/**
 * Created by Renk on 2018/12/18.
 */
window.renk.canvasPainter = (function($) {
    var pub = {
        isActive: true,
        canvas: null,
        startPoint:false,//鼠标起始位置
        currentPoint:false,//鼠标起始位置
        origin:{x: 0, y: 0}, //格線原點座標
        scale:1,//缩放
        ctx: null,
        creating:false,
        targetObject:'Ray',
        currentObject:false,
        clickExtentPoint:35,
        clickExtentLine:10,
        objects:{},
        init: function() {
            pub.canvas = document.getElementById("canvas1");
            pub.ctx = this.canvas.getContext('2d');
            pub.canvas.onmousemove = function(e){ onMouseMove(e)};
            pub.canvas.onmousedown = function(e){ onMouseDown(e)};
            pub.canvas.onmouseup = function(e){ onMouseUp(e)};


            // var point = {p1:{x:1,y:1},p2:{x:100,y:100}};
            // this.ray({p1:{x:1,y:1},p2:{x:100,y:100}},2);
            // var blackLine = new BlackLine();
            // blackLine.draw(point,this.ctx);
        },
        clear:function(){
            pub.ctx.setTransform(1,0,0,1,0,0);
            pub.ctx.clearRect(0, 0, pub.canvas.width, pub.canvas.height);
            pub.ctx.setTransform(pub.scale,0,0,pub.scale,pub.origin.x, pub.origin.y);
        },
    };

    //获取鼠标的位置
    function getMousePoint(et) {
        var mouse_nogrid = graphs.point((et.pageX - et.target.offsetLeft - pub.origin.x) / pub.scale, (et.pageY - et.target.offsetTop - pub.origin.y) / pub.scale); //滑鼠實際位置
        return mouse_nogrid;
    }

    function onMouseDown(e) {
        var currentPoint = getMousePoint(e);
        if(pub.creating == false){
            var selectedObject = getSelectedObject(currentPoint);
            if(selectedObject){console.log('select one!!');
                pub.startPoint = currentPoint;
                selectedObject.selected = true;
                pub.currentObject = selectedObject;
                selectedObject.mouseDown(e,pub);
            }else{
                pub.startPoint = currentPoint;
                if(pub.targetObject){
                    pub.creating = true;
                    var object = new window[pub.targetObject]();
                    object.startPoint = pub.startPoint;
                    object.creating = true;
                    object.mouseDown(e);
                    pub.currentObject = object;
                    pub.objects[object.getId()] = object;
                }
            }

        }else{
            resetPub();
        }
    }

    function onMouseMove(e) {
        var et = e;
        pub.currentPoint = getMousePoint(e);
        if(pub.currentObject){
            redraw();
        }
    }

    function onMouseUp(event) {
        //console.log('mouse up');
        //console.log(pub.currentObject);
        if(pub.currentObject){//console.log(pub.currentObject);
            pub.currentObject.mouseUp(event);
        }

        if(pub.creating == false){
            resetPub();
        }
    }

    function resetPub() {
        pub.creating = false;
        pub.currentObject = false;
        pub.startPoint = false;
    }

    function redraw() {
        pub.clear();
        for (var id in pub.objects){
            // console.log(object);
            pub.objects[id].update(pub).draw();
        }
    }

    function getSelectedObject(currentPoint) {
        for(var id in pub.objects){
            if(pub.objects[id].setPub(pub).isSelected(currentPoint)){
                return pub.objects[id];
            }
        }
        return false;
    }



    return pub;
})(window.jQuery);