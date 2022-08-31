var Bullet = cc.Class.extend({
    ctor:function(tower){
        this.isAlive = true;
        this.tower = tower;
        this.damage = this.tower.curDamage;
        this.radius =this.tower.towerStat[this.tower.curStat].bulletRadius;
        this.speed = this.tower.towerStat[this.tower.curStat].bulletSpeed/10;
        this.map = this.tower.map;
        this.logicPoint = this.tower.logicPoint;
        this.targetMonster = this.tower.targetMonster;
        this.targetLogicPoint = this.tower.targetLogicPoint;
        this.stat = this.tower.curStat;
        this.bulletTargetBuffType = this.tower.bulletTargetBuffType;
        /*
        cc.log("towerType "+this.tower.type);

         */
        this.bulletUI = new GC.TOWER.BULLET_CLASS[this.tower.type](this);
        this.battleId = this.tower.battleId + "_Bullet_" + this.tower.numBulletShooted;
        this.player = this.tower.player;
    },
    updateBullet: function (){
    },
    destroy: function (){
        //this.bulletUI.setVisible(false);
        //this.bulletUI.removeFromParent(true);
    },
    parse: function (bulletPk){
        this.battleId = bulletPk.battleId;
        this.isAlive = true;
        this.tower = bulletPk.player.findTowerByBattleId(bulletPk.towerBattleId);
        this.damage = bulletPk.damage;
        this.radius = bulletPk.radius;
        this.speed = bulletPk.speed;
        this.logicPoint = bulletPk.logicPoint;
        this.targetLogicPoint = bulletPk.targetLogicPoint;
        this.targetMonster = bulletPk.player.findMonsterByBattleId(bulletPk.targetMonsterBattleId);
        this.stat = bulletPk.stat;
        this.bulletTargetBuffType = bulletPk.bulletTargetBuffType;

        //BoomerangeBullet
        this.isComeBack = bulletPk.isComeBack;
        this.hittedMonster = [];
        for(let i=0;i<bulletPk.hittedMonsterBattleId.length;i++){
            this.hittedMonster.push(this.player.findMonsterByBattleId(bulletPk.hittedMonsterBattleId[i]));
        }

    }
});
