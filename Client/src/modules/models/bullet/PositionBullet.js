var PositionBullet = Bullet.extend({
    ctor:function(tower){
        this._super(tower);
    },
    updateBullet: function (){
        var dt = 1/GC.BATTLE.TICK_PER_SECOND;
        //cc.log("bulletLogicPoint: "+this.logicPoint.x + " " +this.logicPoint.y);
        if (Helper.getDistance(this.logicPoint,this.targetLogicPoint) < this.speed*dt){
            this.logicPoint = this.targetLogicPoint;
            this.bulletUI.toTarget(this.logicPoint);
            this.isAlive = false;

            for(let i=0;i<this.player.monsterInMapList.length;i++){
                let monster = this.player.monsterInMapList[i];
                if (!Helper.checkNull(monster) && monster.isAlive){
                    let monsterRadius = monster.hitRadius;
                    if (Helper.getDistance(this.logicPoint, monster.getLogicPoint()) <=
                        this.radius + monsterRadius){
                        monster.hitBullet(this.damage);
                    }
                }
            }
            //TODO something
        }
        else {
            //cc.log("speed + dt: "+this.speed + " "+dt);
            this.logicPoint = Helper.pointMoveToPoint(this.logicPoint,this.targetLogicPoint,this.speed,dt);
            this.bulletUI.updateMapPixel(this.logicPoint);
        }
        /*
        cc.log("PositionBullet battleObjectId: "+this.battleId);
        cc.log("PositionBullet curPos: " + this.logicPoint.x + " " + this.logicPoint.y);
        cc.log("PositionBullet isAlive: "+this.isAlive);

         */

    },

})