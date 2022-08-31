var IceBulletUI = BulletUI.extend({
    ctor:function(bullet) {
        this._super(bullet);
    },
    toTarget: function (){
        this.setVisible(false);
    },
    updateMapPixel: function (logicPoint){
        this.setPosition(Helper.convertLogicPointToMapPixel(logicPoint,this.bullet.map.isMyMap));
    },
});