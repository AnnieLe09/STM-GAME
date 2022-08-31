var MonsterUI = cc.Sprite.extend({
    ctor:function(monster){
        this._super(Helper.getTowerImage(monster.statPath, -1));
        this.setAnchorPoint(cc.p(0.5, 0.5));
    }
});