var BulletUI = cc.Sprite.extend({
    ctor:function(bullet) {
        var image = TOWER_FRAME_PATH + bullet.tower.bulletAvatar;
        this._super(image);
        this.bullet = bullet;
        this.map = this.bullet.map;
        this.map.addChild(this);
        this.setPosition(Helper.convertLogicPointToMapPixel(this.bullet.logicPoint,this.bullet.map.isMyMap));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.zIndex = this.bullet.tower.towerUIStat0.zIndex - 1;
        //var k = Math.abs(this.bullet.tower.towerUIStat0.getScale())*this.width/this.bullet.tower.towerUIStat0.width;
        var k = 1.2;
        this.setScale(k);
    },
    toTarget: function (){
        // abstract
    },
    updateMapPixel: function (logicPoint){
        // abstract
    },

});