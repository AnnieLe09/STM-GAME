var MagicBullet = Bullet.extend({
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

            this.buff =BuffFactory.create(GC.TARGETBUFF.ID,this.bulletTargetBuffType);
            this.buff.stat = this.stat;
            this.buff.battleId = this.battleId + "_Buff_";
            this.buff.startTimeRemaining();
            this.player.addBuff(this.buff);

            for(let i=0;i<this.player.monsterInMapList.length;i++){
                let monster = this.player.monsterInMapList[i];
                if (!Helper.checkNull(monster) && monster.isAlive){
                    let monsterRadius = monster.hitRadius;
                    if (Helper.getDistance(this.logicPoint, monster.getLogicPoint()) <=
                        this.radius + monsterRadius){
                        monster.hitBullet(this.damage);
                        monster.addBuff(this.buff);
                    }
                }
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