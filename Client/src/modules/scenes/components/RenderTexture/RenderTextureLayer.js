var RenderTextureLayer = cc.Layer.extend({
    _brushs:null,
    _target:null,
    _lastLocation:null,
    _counter:0,
    sprite: null,
    listPoint: null,
    number:0,

    ctor:function () {
        this._super();

        var winSize = cc.size(GC.MAP.P_WIDTH, GC.MAP.P_HEIGHT);

        this.listPoint = [];
        this.number = 0;

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                target._lastLocation = target.convertToNodeSpace(touch.getLocation());
                target.listPoint.push(target._lastLocation);
                return true;
            },
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                target.drawInLocation(target.convertToNodeSpace(touch.getLocation()));
            },
            onTouchEnded:function (touch, event){
                var target = event.getCurrentTarget();
                // var b = target.listPoint;
                // for(var i = 0; i < b.length; i++){
                //     log("Point " + i + ": " + [b[i].x, b[i].y]);
                // }
                target.checking(target.number);
                // target.saveCB();
                target.clearCB();

            },
            // onTouchCancelled:function(touch, event){
            //     log("ddddddddddddddddddddddddd");
            // }
        });
        cc.eventManager.addListener(eventListener, this);


        // if ('touches' in cc.sys.capabilities){
        //     cc.eventManager.addListener({
        //         event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        //         onTouchesMoved:function (touches, event) {
        //             event.getCurrentTarget().drawInLocation(touches[0].getLocation());
        //         }
        //     }, this);
        // } 
        // else if ('mouse' in cc.sys.capabilities)
        //     cc.eventManager.addListener({
        //         event: cc.EventListener.MOUSE,
        //         onMouseDown: function(event){
        //             var target = event.getCurrentTarget();
        //             target._lastLocation = target.convertToNodeSpace(event.getLocation());
        //         },
        //         onMouseMove: function(event){
        //             var target = event.getCurrentTarget();
        //             if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
        //                 target.drawInLocation(target.convertToNodeSpace(event.getLocation()));
        //             }
                        
        //         }
        //     }, this);

        this._brushs = [];

        // var save = new cc.MenuItemFont("Save", this.saveCB, this);
        // var clear = new cc.MenuItemFont("Clear", this.clearCB.bind(this)); // another way to pass 'this'
        // var menu = new cc.Menu(save, clear);
        // // var menu = cc.Menu.create(clear);
        // menu.alignItemsVertically();
        // menu.x = winSize.width - 70;
        // menu.y = winSize.height - 80;
        // this.addChild(menu, 10);

        // create a render texture
        var target = new cc.RenderTexture(winSize.width, winSize.height, 2);
        target.x = winSize.width / 2;
        target.y = winSize.height / 2;
        this.addChild(target, 1);

        this._target = target;

        this._lastLocation = cc.p(winSize.width / 2, winSize.height / 2);
    },

    setNumber:function(number){
        this.number = number;
    },

    onExit:function () {
        for(var i in this._brushs){
            this._brushs[i].release();
        }
        this._super();
    },

    saveCB:function () {
        if(!cc.sys.isNative){
            cc.log("RenderTexture's saveToFile doesn't suppport on HTML5");
            return;
        }
        var namePNG = "image-" + this._counter + ".png";
        var nameJPG = "image-" + this._counter + ".jpg";

        // You can only save one file at a time (in one frame)
        this._target.saveToFile(nameJPG, cc.IMAGE_FORMAT_JPEG, false);
        // this._target.saveToFile(namePNG, cc.IMAGE_FORMAT_PNG);

        cc.log("images saved!" + this._counter);
        // this._counter++;
    },

    clearCB:function () {
        this._target.clear(0,0,0,0);
        this.listPoint = [];
    },

    drawInLocation:function (location) {
        var distance = cc.pDistance(location, this._lastLocation);

        if (distance > 1) {
            this.listPoint.push(location);

            var locLastLocation = this._lastLocation;
            this._target.begin();
            this._brushs = [];
            for(var i = 0; i < distance; ++i) {
                var diffX = locLastLocation.x - location.x;
                var diffY = locLastLocation.y - location.y;
                var delta = i / distance;
                var sprite = new cc.Sprite(res.s_fire);
                sprite.attr({
                    x: location.x + diffX * delta,
                    y: location.y + diffY * delta,
                    // rotation: Math.random() * 360,
                    // color: cc.color(Math.random() * 255, 255, 255),
                    scale: 0.3,
                    // opacity: 20
                });
                sprite.retain();
                this._brushs.push(sprite);
            }
            for (var i = 0; i < distance; i++) {
                this._brushs[i].visit();
            }
            this._target.end();
        }
        this._lastLocation = location;
    },

    subtitle:function () {
        return "Testing 'save'";
    },

    checking:function(number){
        if(number == 1){
            // log(CheckingGuesture.pic1(this.listPoint));
            if(CheckingGuesture.pic1(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 3){
            // log(CheckingGuesture.pic3(this.listPoint));
            if(CheckingGuesture.pic3(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 5){
            // log(CheckingGuesture.pic5(this.listPoint));
            if(CheckingGuesture.pic5(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 6){
            // log(CheckingGuesture.pic6(this.listPoint));
            if(CheckingGuesture.pic6(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 7){
            // log(CheckingGuesture.pic7(this.listPoint));
            if(CheckingGuesture.pic7(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 8){
            // log(CheckingGuesture.pic8(this.listPoint));
            if(CheckingGuesture.pic8(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 9){
            // log(CheckingGuesture.pic9(this.listPoint));
            if(CheckingGuesture.pic9(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else if(number == 11){
            // log(CheckingGuesture.pic11(this.listPoint));
            if(CheckingGuesture.pic11(this.listPoint)){
                gv.battleController.players[1].boom();
            }
        }
        else {
            // log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        }
    }

});