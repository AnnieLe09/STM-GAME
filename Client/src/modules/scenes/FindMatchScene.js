var FindMatchScene = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.findMatchUI = ccs.load(res.ui_matching_json).node;

        this.winSize = cc.director.getWinSize();

        this.addChild(this.findMatchUI);
        this.findMatchUI.setScaleX(this.winSize.width / this.findMatchUI.width);
        this.findMatchUI.setScaleY(this.winSize.height / this.findMatchUI.height);
        this.findMatchUI.setAnchorPoint(cc.p(0.5, 0.5));
        this.findMatchUI.setNormalizedPosition(0.5,0.5);
        this.scheduleOnce(function() {
            gv.battleController.sendFindMatch();
        }, 1);
        this.findMatchUI.getChildByName("btn_cancel").addTouchEventListener(function (sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.battleController.sendCancelFindMatch();
            }
        }, this);
    },
});

// var FindMatchScene = cc.Scene.extend({
//     ctor:function(){
//         this._super();

//         this.matchingLayer = new FindMatchLayer();
//         this.addChild(this.matchingLayer);
//     }
// });