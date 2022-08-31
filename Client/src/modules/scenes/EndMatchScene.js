var EndMatchLayer = BaseLayer.extend({
    ctor: function (players, result) {
        this._super(null, res.JSON_END_MATCH_LAYER);
        this.initAnim(result);
        this.initInfo(players);
        this.setButtons(players);
    },
    initAnim:function (result){
        this.layer.setVisible(false);
        switch (result){
            case GC.BATTLE.RESULT_MSG.WIN:
                this.anim = new sp.SkeletonAnimation(res.JSON_RESULT_WIN, res.ATLAS_RESULT_WIN);
                this.anim.setAnimation(0, "fx_result_win_init", false);
                this.winnerBg.setVisible(true);
                this.drawBg.setVisible(false);
                this.loserBg.setVisible(false);
                this.initAttributes(this.winnerBg);
                break;
            case GC.BATTLE.RESULT_MSG.DRAW:
                this.anim = new sp.SkeletonAnimation(res.JSON_RESULT_DRAW, res.ATLAS_RESULT_DRAW);
                this.anim.setAnimation(0, "fx_result_draw_init", false);
                this.winnerBg.setVisible(false);
                this.drawBg.setVisible(true);
                this.loserBg.setVisible(false);
                this.initAttributes(this.drawBg);
                break;
            case GC.BATTLE.RESULT_MSG.LOSE:
                this.anim = new sp.SkeletonAnimation(res.JSON_RESULT_LOSE, res.ATLAS_RESULT_LOSE);
                this.anim.setAnimation(0, "fx_result_lose_init", false);
                this.winnerBg.setVisible(false);
                this.drawBg.setVisible(false);
                this.loserBg.setVisible(true);
                this.initAttributes(this.loserBg);
                break;
        }

        this.anim.setAnchorPoint(cc.p(0, 0));
        this.anim.setPosition(cc.p(this.winSize.width / 2, this.winSize.height / 2));
        this.anim.update(0.0);
        this.anim.setScale(0.8);
        this.addChild(this.anim, -1);
        this.scheduleOnce(function() {
            // Here this refers to component
            this.layer.setVisible(true);
        }, 2);
    },
    initInfo:function (players){
        for(let i = 0; i < 2; ++i){
            let player = players[i];
            this["player" + i + "Name"].string = player.name;
            this["player" + i + "HpTxt"].string = "" + player.hp;
        }
    },
    setButtons:function (){
        this.homeBtn.addTouchEventListener(function (sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.mainController.onRunScene(gv.mainController.mainLayer);
            }
        }, this);
    }
});
