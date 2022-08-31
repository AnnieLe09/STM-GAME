var Assasin = cc.Sprite.extend({
    ctor:function(){
        this._super(res.ASSASIN_SPRITE);
        this.setAnchorPoint(0.5, 0.5);
        this.setNormalizedPosition(0.5,0.5);
    }
});