var CannonBulletUI = BulletUI.extend({
    ctor:function(bullet) {
        this._super(bullet);
    },
    toTarget: function (){
        this.setVisible(false);
    },
    updateMapPixel: function (logicPoint){
        this.setPosition(Helper.convertLogicPointToMapPixel(logicPoint,this.bullet.map.isMyMap));
        //cc.log("CannonBulletUI LogicPoint: "+logicPoint.x + " "+logicPoint.y);
        //cc.log("CannonBulletUI Position: "+this.x + " "+this.y);
    },

});