var ChasingBullet = Bullet.extend({
    ctor:function(tower){
        this._super(tower);
    },
    updateBullet: function (){
        var dt = 1/GC.BATTLE.TICK_PER_SECOND;
        //cc.log("bulletLogicPoint: "+this.logicPoint.x + " " +this.logicPoint.y);
        var monsterRadius;
        if (!Helper.checkNull(this.targetMonster) && this.targetMonster.isAlive){
            this.targetLogicPoint = this.targetMonster.getLogicPoint();
            monsterRadius = this.targetMonster.hitRadius;
        }
        else {
            monsterRadius = 0;
        }
        if (Helper.getDistance(this.logicPoint,this.targetLogicPoint) - monsterRadius < this.speed*dt){
            this.logicPoint = this.targetLogicPoint;
            this.bulletUI.toTarget(this.logicPoint);
            if (!Helper.checkNull(this.targetMonster) && this.targetMonster.isAlive){
                this.targetMonster.hitBullet(this.damage);
            }
            this.isAlive = false;
            //TODO something
        }
        else {
            //cc.log("speed + dt: "+this.speed + " "+dt);
            this.logicPoint = Helper.pointMoveToPoint(this.logicPoint,this.targetLogicPoint,this.speed,dt);
            this.bulletUI.updateMapPixel(this.logicPoint);
        }
        /*
        cc.log("ChasingBullet battleObjectId: "+this.battleId);
        cc.log("ChasingBullet curPos: " + this.logicPoint.x + " " + this.logicPoint.y);
        cc.log("ChasingBullet isAlive: "+this.isAlive);

         */

    },

})