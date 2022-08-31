var BoomerangBullet = Bullet.extend({
    ctor:function(tower){
        this._super(tower);
        this.isComeBack = false;
        this.hittedMonster = [];
    },
    countTimeHitted: function (monster,arr){
      let count = 0;
      for(let i = 0;i<arr.length;i++){
          if (monster == arr[i]){
              count += 1;
          }
      }
      return count;
    },
    updateGo: function (dt){
        //cc.log("Boomerang Go");
        if (Helper.getDistance(this.logicPoint,this.targetLogicPoint) < this.speed*dt){
            this.logicPoint = this.targetLogicPoint;
            //this.bulletUI.toTarget(true);

            this.isComeBack = true;
            this.targetLogicPoint = this.tower.logicPoint;
            this.hittedMonster = [];


            //TODO something
        }
        else {
            //cc.log("speed + dt: "+this.speed + " "+dt);
            this.logicPoint = Helper.pointMoveToPoint(this.logicPoint,this.targetLogicPoint,this.speed,dt);
        }

        //cc.log("Boomerang LogicPoint: " + this.logicPoint.x + " " +this.logicPoint.y );
        this.bulletUI.updateMapPixel(this.logicPoint);
        //cc.log("Boomerang MapPixel: " + this.bulletUI.x + " " +this.bulletUI.y );

        for(let i=0;i<this.player.monsterInMapList.length;i++){
            let monster = this.player.monsterInMapList[i];
            if (!Helper.checkNull(monster) && monster.isAlive){
                let monsterRadius = monster.hitRadius;
                if (Helper.getDistance(this.logicPoint, monster.getLogicPoint()) <=
                    this.radius + monsterRadius && this.countTimeHitted(monster,this.hittedMonster) < 1){
                    monster.hitBullet(this.damage);
                    this.hittedMonster.push(monster);
                }
            }
        }

    },
    updateComeBack: function (dt){
        //cc.log("Boomerang Comeback");
        if (Helper.getDistance(this.logicPoint,this.targetLogicPoint) < this.speed*dt){
            this.logicPoint = this.targetLogicPoint;
            this.bulletUI.toTarget(false);
            this.isAlive = false;
            //TODO something
        }
        else {
            //cc.log("speed + dt: "+this.speed + " "+dt);
            this.logicPoint = Helper.pointMoveToPoint(this.logicPoint,this.targetLogicPoint,this.speed,dt);
        }
        //cc.log("Boomerang LogicPoint: " + this.logicPoint.x + " " +this.logicPoint.y );
        this.bulletUI.updateMapPixel(this.logicPoint);
       // cc.log("Boomerang MapPixel: " + this.bulletUI.x + " " +this.bulletUI.y );

        for(let i=0;i<this.player.monsterInMapList.length;i++){
            let monster = this.player.monsterInMapList[i];
            if (!Helper.checkNull(monster) && monster.isAlive){
                let monsterRadius = monster.hitRadius;
                if (Helper.getDistance(this.logicPoint, monster.getLogicPoint()) <=
                    this.radius + monsterRadius && this.countTimeHitted(monster,this.hittedMonster) < 1){
                    monster.hitBullet(this.damage);
                    this.hittedMonster.push(monster);
                }
            }
        }
    },
    updateBullet: function (){
        var dt = 1/GC.BATTLE.TICK_PER_SECOND;
        if (this.isComeBack){
            this.updateComeBack(dt);
        }
        else {
            this.updateGo(dt);
        }
        /*
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
        //


    },

})