var AttackTower = Tower.extend({
    ctor:function(id){
        this._super(id);

        this.curTimeWaiting = 0;
        this.curAttackSpeed = this.towerStat[this.curStat].attackSpeed;
        this.curDamage = this.towerStat[this.curStat].damage;
        this.curRange = this.towerStat[this.curStat].range;
        this.targetMonster = null;
        this.isStartAttack = false;
        this.isShootBullet = false;
        this.numBulletShooted = 0;

    },
    updateTower: function (){
        this.updateActiveTower();
        var dt = 1.0/GC.BATTLE.TICK_PER_SECOND;
        if (!this.isActive){
            return true;
        }
        this.updateWithStatAndBuff();

        if (this.curTimeWaiting < dt){
            if (this.curTimeWaiting >= 0 && !this.isStartAttack) {
                if (Helper.checkNull(this.targetMonster)){
                    this.targetMonster = null;
                }
                if (this.targetMonster == null || !this.targetMonster.isAlive
                    || Helper.getDistance(this.logicPoint,this.targetMonster.getLogicPoint())
                    - this.targetMonster.hitRadius > this.curRange) {
                    this.findTargetMonster();
                }

                if (this.targetMonster != null && this.targetMonster.attackType != GC.BOSS.ATTACK.ONLY){
                    this.findOnlyTargetMonster()
                }

                if (this.targetMonster!= null){
                    this.curDir = this.getDir();
                    this.curTimeWaiting = 0;
                    this.isStartAttack = true;
                    this.setUIRunAnimAttack();
                    this.targetLogicPoint = this.targetMonster.getLogicPoint();
                }
                else {
                    this.curTimeWaiting = 0;
                }
            }
            else {
                if (this.isStartAttack){
                    if (this.attackAnimationTime*1.0/1000 - this.curTimeWaiting*(-1) < dt){
                        this.curTimeWaiting = this.curAttackSpeed/1000;
                        if (!this.isShootBullet){
                            this.shootBullet();
                        }
                        this.isStartAttack = false;
                        this.isShootBullet = false;
                        this.setUIRunAnimIdle();
                    }
                    else {
                            if (!this.isShootBullet && this.shootAnimationTime*1.0/1000 - this.curTimeWaiting*(-1) < dt ){
                                this.shootBullet();
                            }
                            this.curTimeWaiting -=dt;
                        }
                }
            }

        }
        else {
            this.curTimeWaiting -=dt;
        }



        // cc.log("AttackTower battleId: "+this.battleId)
        // cc.log("AttackTower D A R: "+this.curDamage+" "+this.curAttackSpeed+" "+this.curRange);
        // cc.log("AttackTower curTimeWaiting: "+this.curTimeWaiting);
        // cc.log("AttackTower isStartAttack: "+this.isStartAttack);
        // cc.log("AttackTower isShootBullet: "+this.isShootBullet);

        /*
        cc.log("AttackTower battleId: "+this.battleId)
        cc.log("AttackTower D A R: "+this.curDamage+" "+this.curAttackSpeed+" "+this.curRange);
        cc.log("AttackTower curTimeWaiting: "+this.curTimeWaiting);
        cc.log("AttackTower isStartAttack: "+this.isStartAttack);
        cc.log("AttackTower isShootBullet: "+this.isShootBullet);
>>>>>>> 46e36eac4af45a0c235a8e192ce38a6a7c723e52
        if (this.targetMonster != null){
            //cc.log("AttackTower targetMonsterId: "+this.targetMonster.battleObjectId);
        }
        else {
            //cc.log("AttackTower targetMonsterId: "+"null");
        }

         */





    },
    findTargetMonster: function (){
        //TODO something
        if (Helper.checkNull(this.targetMonster)){
            this.targetMonster = null;
        }
        var monsters;
        if (this.map.isMyMap){
            monsters = gv.battleController.players[0].monsterInMapList;
        }
        else {
            monsters = gv.battleController.players[1].monsterInMapList;
        }

        var index = -1;
        for(let i=0; i<monsters.length; i++){
            if (monsters[i].isAlive ){
                var dis = Helper.getDistance(monsters[i].getLogicPoint(),this.logicPoint);
                if (dis <= this.curRange) {
                    if (index == -1 || dis > Helper.getDistance(monsters[index].getLogicPoint(),this.logicPoint)){
                        index = i;
                    }
                }

            }
        }
        if (index == -1){
            this.targetMonster = null;
        }
        else {
            this.targetMonster = monsters[index];
        }

        return this.targetMonster;
    },
    findOnlyTargetMonster: function () {
        if (Helper.checkNull(this.targetMonster)){
            this.targetMonster = null;
        }
        var monsters;
        if (this.map.isMyMap){
            monsters = gv.battleController.players[0].monsterInMapList;
        }
        else {
            monsters = gv.battleController.players[1].monsterInMapList;
        }

        for(let i=0; i<monsters.length; i++){
            if (monsters[i].isAlive && monsters[i].attackType == GC.BOSS.ATTACK.ONLY){
                var dis = Helper.getDistance(monsters[i].getLogicPoint(),this.logicPoint);
                if (dis <= this.curRange) {
                    this.targetMonster = monsters[i];
                    return this.targetMonster;
                }

            }
        }
        return this.targetMonster;
    },
    getDir: function (){
        if (this.dirNum == 1){
            return 0;
        }
        var X = this.targetMonster.x - this.mapPixel.x;
        var Y = this.targetMonster.y - this.mapPixel.y;
        //X = (X * X)/(X*X+Y*Y);
        //Y = (Y*Y)/(X*X+Y*Y);
        var cosA = (-Y)/(Math.sqrt(X*X+Y*Y));
        // cosA in [1...-1]
        cosA = (cosA * (-1))+1;
        // cosA in [0...2]
        var k = (this.dirNum - 1);
        if (cosA < 2/(k*2)) return 0;
        var dir = Math.floor((cosA - (2/(k*2))) / (2/k)) + 1;
        if (X < 0){
            if ((dir > 0) && (dir < this.dirNum - 1)) {
                dir = (this.dirNum - 1) * 2 - dir;
            }
        }
        return dir;

    },
    updateWithStatAndBuff: function (){
        this.curAttackSpeed = this.towerStat[this.curStat].attackSpeed;
        this.curDamage = this.towerStat[this.curStat].damage;
        this.curRange = this.towerStat[this.curStat].range;

        //cc.log("Attack Tower: "+this.battleId);

        let k = 0;
        while (k < this.buffs.length){
            if (this.buffs[k] == null || !this.buffs[k].isActive){
                Helper.removeFromArray(this.buffs,this.buffs[k]);
            }
            else {
                k+=1;
            }
        }

        for(let i=0;i<this.buffs.length;i++){
            let buff = this.buffs[i];
            //cc.log("buff "+i+" is: "+buff.buffTypeOrder+" "+buff.battleId);
            if ( !buff.isActive){
                continue;
            }
            let effects = buff.effectList;
            let index;
            if (effects.length > 2){
                index = this.curStat;
            }
            else {
                index = 1;
            }
            let effect = effects[index];

            if (effect.name == "damageUp"){
                this.curDamage += this.towerStat[this.curStat].damage * effect.value;
            }
            if (effect.name == "attackSpeedUp"){
                this.curAttackSpeed -= this.towerStat[this.curStat].attackSpeed * effect.value;
            }
            if (effect.name == "rangeUp"){
                this.curRange += this.towerStat[this.curStat].range * effect.value;
            }
        }


        if (this.curDamage < 0) {
            this.curDamage = 0;
        }
        if (this.curAttackSpeed < 0){
            this.curAttackSpeed = 0;
        }
        if (this.curRange < 0){
            this.curRange = 0;
        }

    },
    shootBullet: function (){
        //TODO something
        this.isShootBullet = true;
        var player;
        if (this.map.isMyMap){
            player = gv.battleController.players[0];
        }
        else {
            player = gv.battleController.players[1];
        }
        this.numBulletShooted +=1;
        var bullet = new BulletFactory.create(this);
        player.bulletInMapList.push(bullet);
    },
    parse: function (tower){
        //cc.log("parse Tower");
        this.battleId = tower.battleId;
        //cc.log("Attack tower battle Id: " + this.battleId);
        this.type = tower.type;
        //cc.log("Attack tower type: " + this.type);
        this.tickToActive = tower.tickToActive;

        //cc.log("Attack tower tickToActive: " + this.tickToActive);
        this.curStat = tower.curStat;
        //cc.log("Attack tower curStat: " + this.curStat);

        this.curTimeWaiting = tower.curTimeWaiting;
        //cc.log("Attack tower curTimeWaiting: " + this.curTimeWaiting);
        this.player = tower.player;
        this.targetMonster = this.player.findMonsterByBattleId(tower.targetMonsterBattleId);
        if (this.targetMonster != null){
            //cc.log("Attack tower targetMonster: " + this.targetMonster.battleObjectId);
        }
        else {
            //cc.log("Attack tower targetMonster: " + null);
        }


        this.targetLogicPoint = tower.targetLogicPoint;
        if (this.targetLogicPoint != null){
            //cc.log("Attack tower targetLogicPoint: " + this.targetLogicPoint.x+ " "+this.targetLogicPoint.y);
        }
        else {
            //cc.log("Attack tower targetLogicPoint: " + null);
        }

        this.isShootBullet = tower.isShootBullet;

       // cc.log("Attack tower is Shooted Bullet: " + this.isShootBullet);
        this.numBulletShooted = tower.numBulletShooted;
        //cc.log("Attack tower num Shooted Bullet: " + this.numBulletShooted);

        this.map = this.player.virtualMap;
        //cc.log("this.player: "+this.player);
        //cc.log("this.virtualMap: "+this.player.virtualMap);

        this.logicPoint = cc.p(tower.logicCellPoint.x + 0.5,tower.logicCellPoint.y + 0.5);
        //cc.log("Attack Tower LogicPoint" + this.logicPoint.x + " "+ this.logicPoint.y);
        this.mapPixel = Helper.convertLogicPointToMapPixel(this.logicPoint,this.map.isMyMap);
        this.cell = this.map.getTouchedCell(this.mapPixel);
        this.curTick = gv.battleController.curTick;
        this.tickToActive = tower.tickToActive;
        this.isActive = false;
        if (this.curTimeWaiting < 0){
            this.isStartAttack = true;
        }
        else {
            this.isStartAttack = false;
        }
        this.curDamage = tower.curDamage;
        this.curAttackSpeed = tower.curAttackSpeed;
        this.curRange = tower.curRange;
        this.buffs = [];
        for(let i = 0;i < tower.buffsBattleId.length;i++){
            let buff = this.player.findBuffByBattleId(tower.buffsBattleId[i]);
            if (buff != null){
                this.buffs.push(buff);
            }
            //cc.log("Attack tower 0  buff " + i + " : " +tower.buffsBattleId[i]);
            //cc.log("Attack tower 1  buff " + i + " : " +this.buffs[i].battleId);
        }
    }


});