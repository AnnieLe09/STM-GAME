var BoomerangBulletUI = BulletUI.extend({
    ctor:function(bullet) {
        this._super(bullet);
    },
    toTarget: function (flag){
        this.setVisible(flag);
    },
    updateMapPixel: function (logicPoint){
        this.setPosition(Helper.convertLogicPointToMapPixel(logicPoint,this.bullet.map.isMyMap));
    },
});