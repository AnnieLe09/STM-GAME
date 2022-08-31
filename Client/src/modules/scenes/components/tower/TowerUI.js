var TowerUI = cc.Sprite.extend({
    ctor:function(tower,map,isHaveAnim){
        this._super(Helper.getTowerImage(tower.statPath, 1));
        this.tower = tower;
        this.setAnchorPoint(cc.p(0.5, 0));

        this.setAnchorPoint(cc.p(0.5, 0.5)); //Replace By Hanh
        this.animPlist = this.tower.animPlist;
        this.dirNum = this.tower.dirNum;
        this.animDirAttackNum = this.tower.animDirAttackNum;
        this.animDirIdleNum = this.tower.animDirIdleNum;


        if (isHaveAnim){
            //this.eventHandler();
            this.initAnimation();
            var tmp = new cc.Sprite(TOWER_ANIMATION_PATH+"exam/"+this.animPlist+"_idle_0_0000"+ ".png")
            var k = map.getCellSize()/tmp.width*this.tower.multiScale;
            this.setScale(k);
            this.setVisible(false);
            //this.addTouchEventListener(this.callDropTower, this);
        }

    },
    onActive: function (){
        this.setVisible(true);
    },
    initAnimation: function (){
        var spriteFrameCache = cc.spriteFrameCache;
        this.spriteFrameCache = spriteFrameCache;

        this.spriteFrameCache.addSpriteFrames(TOWER_ANIMATION_PATH+this.animPlist+"_012"+".plist");
        this.spriteFrameCache.addSpriteFrames(TOWER_ANIMATION_PATH+this.animPlist+"_3"+".plist");

        this.dirAnimAttackFrames = [];
        this.dirAnimIdleFrames = [];
        for(let stat = 0; stat <=3; stat++){
            this.dirAnimAttackFrames.push([]);
            this.dirAnimIdleFrames.push([]);
            for(let i=0;i<this.dirNum;i++){
                this.dirAnimAttackFrames[stat].push([]);
                this.dirAnimIdleFrames[stat].push([]);
                this.initDirAnimIdleFrames(stat,i);
                this.initDirAnimAttackFrames(stat,i);
            }
        }

    },
    initDirAnimIdleFrames: function (stat,dir){
        var animFrames = [];
        var str = "";
        var frame;
        for (var i = this.animDirIdleNum*dir; i < this.animDirIdleNum*(dir+1); i++) {
            var num = ""+i;
            while (num.length < 4) {
                num = "0"+num;
            }
            str = this.animPlist+"_idle_"+stat+"_" + num + ".png";
            frame = this.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.dirAnimIdleFrames[stat][dir] = animFrames;
    },
    initDirAnimAttackFrames: function (stat,dir){
        var animFrames = [];
        var str = "";
        var frame;
        for (var i = this.animDirAttackNum*dir; i < this.animDirAttackNum*(dir+1); i++) {
            var num = ""+i;
            while (num.length < 4) {
                num = "0"+num;
            }
            str = this.animPlist+"_attack_"+stat+"_" + num + ".png";
            frame = this.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.dirAnimAttackFrames[stat][dir] = animFrames;
    },
    changeDirAndScale: function(dir) {
        if (this.tower.dirNum == 1){
            return 0;
        }
        dir = dir % ((this.tower.dirNum - 1) * 2);
        if (dir < this.tower.dirNum) {
            if (this.getScaleX() < 0) {
                this.setScaleX(this.getScaleX()*(-1));
            }
        }
        else {
            if (this.getScaleX() > 0) {
                this.setScaleX(this.getScaleX()*(-1));
            }
            dir = (this.tower.dirNum - 1) - (dir - (this.tower.dirNum - 1));
        }
        return dir;
    },
    runAimIdle: function (stat){

        var dir = this.tower.curDir;
        dir = this.changeDirAndScale(dir);
        var animation = cc.Animation(this.dirAnimIdleFrames[stat][dir],0.1);
        this.stopAllActions();
        this.runAction(cc.animate(animation).repeatForever());




    },

    runAimAttack: function (stat){
        var dir = this.tower.curDir;
        dir = this.changeDirAndScale(dir);
        var animation = cc.Animation(this.dirAnimAttackFrames[stat][dir],this.tower.attackAnimationTime/4000);
        this.stopAllActions();
        if (this.tower.archetype == GC.TOWER.TYPES.SUPPORT){
            this.runAction(cc.animate(animation).repeatForever());
        }
        else {
            this.runAction(cc.animate(animation));
        }

    },
    dropInMap: function (){
        this.stopAllActions();
        this.removeFromParent();
    },

    eventHandler: function (){
        // mouse handler
        /*
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event){

                    if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {

                        event.getCurrentTarget().processEvent(event);
                    }
                }
            }, this);
        }

        // touch handler
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchesEnded:function (touches, event) {
                    var touch = touches[0];

                    if (this.prevTouchId !== touch.getID()) {
                        this.prevTouchId = touch.getID();
                    } else {
                        event.getCurrentTarget().processEvent(touches[0]);
                    }

                }
            }, this);
        }

         */

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //swallowTouches: true,
            onTouchBegan: function (touch, event) {
                //do something
                cc.log("hanh ne 3");
                cc.log(event.getCurrentTarget().tower.cell.posInMap.x + " " + event.getCurrentTarget().tower.cell.posInMap.y);
                event.getCurrentTarget().processEvent(touch);
                return false;
            }
        });
        cc.eventManager.addListener(eventListener, this);

    },
    processEvent: function(event) {
        if (!this.tower.isActive){
            return false;
        }
        var pointEvent = event.getLocation();
        var cell = this.tower.map.getTouchedCell(pointEvent);
        cc.log("bam tai tower cua cell: " + this.tower.cell.posInMap.x + " " + this.tower.cell.posInMap.y);
        if (this.tower.cell === cell){
            this.tower.dropInMap();
            return true;
        }
        return false;
    },

});