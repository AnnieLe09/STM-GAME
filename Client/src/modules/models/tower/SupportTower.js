var SupportTower = Tower.extend({
    ctor:function(id){
        this._super(id);
        this.isStartAttack = false;

        this.towerBuff = BuffFactory.create(GC.TOWERBUFF.ID,this.auraTowerBuffType);
        this.towerBuff.setActive(false);

        this.curRange = this.towerStat[this.curStat].range;
        this.countTower = 0;

    },
    updateWithStatAndBuff: function () {
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

            if (effect.name == "rangeUp"){
                this.curRange += this.towerStat[this.curStat].range * effect.value;
            }
        }


        if (this.curRange < 0){
            this.curRange = 0;
        }
    },

    updateTower: function (){
        if ((this.curTick >= this.tickToActive - 1) && (this.isActive == false) ) {
            this.towerBuff.battleId = this.battleId + "_Buff_";
            cc.log("active Tower "+this.towerBuff.battleId);
            this.player.addBuff(this.towerBuff);
        }

        this.updateActiveTower();
        this.updateWithStatAndBuff();
        if (this.isActive){
            this.towerBuff.setActive(true);
        }
        else {
            this.towerBuff.setActive(false);
            return;
        }
        let towers = this.player.towerInMapList;
        let count = 0;
        for (let i=0;i<towers.length;i++){
            let tower = towers[i];
            if (tower != this && tower.isActive &&
                Helper.getDistance(this.curLogicPoint,tower.curLogicPoint) <= this.curRange){

                tower.addBuff(this.towerBuff);
                count+=1;
            }
        }

        if (count != this.countTower) {
            this.countTower = count;
            if (count > 0){
                cc.log("SupportTower Attack"+count);
                this.setUIRunAnimAttack();
            }
            else {
                cc.log("SupportTower Idle"+count);
                this.setUIRunAnimIdle();
            }
        }
    },

    parse: function (tower){
        cc.log("parse Tower");
        this.battleId = tower.battleId;
        cc.log("Attack tower battle Id: " + this.battleId);
        this.type = tower.type;
        cc.log("Attack tower type: " + this.type);
        this.tickToActive = tower.tickToActive;
        cc.log("Attack tower tickToActive: " + this.tickToActive);
        this.curStat = tower.curStat;
        cc.log("Attack tower curStat: " + this.curStat);
        this.curTimeWaiting = tower.curTimeWaiting;
        cc.log("Attack tower curTimeWaiting: " + this.curTimeWaiting);
        this.player = tower.player;


        this.map = this.player.virtualMap;
        cc.log("this.player: "+this.player);
        cc.log("this.virtualMap: "+this.player.virtualMap);
        this.logicPoint = cc.p(tower.logicCellPoint.x + 0.5,tower.logicCellPoint.y + 0.5);
        cc.log("Attack Tower LogicPoint" + this.logicPoint.x + " "+ this.logicPoint.y);
        this.mapPixel = Helper.convertLogicPointToMapPixel(this.logicPoint,this.map.isMyMap);
        this.cell = this.map.getTouchedCell(this.mapPixel);
        this.curTick = gv.battleController.curTick;
        this.tickToActive = tower.tickToActive;
        this.isActive = false;
        this.buffs = [];
        for(let i = 0;i < tower.buffsBattleId.length;i++){
            let buff = this.player.findBuffByBattleId(tower.buffsBattleId[i]);
            if (buff != null){
                this.buffs.push(buff);
            }
            //cc.log("Attack tower 0  buff " + i + " : " +tower.buffsBattleId[i]);
            //cc.log("Attack tower 1  buff " + i + " : " +this.buffs[i].battleId);
        }
        let towerBuff = this.player.findBuffByBattleId(tower.towerBuffBattleId);
        if (towerBuff != null) {
            this.towerBuff = towerBuff;
        }
    }
});