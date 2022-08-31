var RangeUI = cc.Sprite.extend({
    ctor: function(range) { //point is cc.Point object
        this._super(res.PNG_TOWER_RANGE);
        this.setScale(range / this.width);
        this.setAnchorPoint(cc.p(0.5, 0.5));
    }
});