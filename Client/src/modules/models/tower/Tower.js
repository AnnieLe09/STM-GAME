var Tower = cc.Class.extend({
    ctor:function(id){
        this.type = id;
        this.statNum = 1;
        this.curStat = 1;
        this.curDir = 0;
        this.isActive = false;
        this.timerSprite = null;
        ConfigLoader.load(this, GC.TOWER.LIST[id]);
        ConfigLoader.load(this, GC.TOWER.LIST[id].stat["" + this.statNum]);
        this.towerStat = [null, new TowerStat(id,1), new TowerStat(id,2), new TowerStat(id,3)];
        this.buffs = [];
        //LA
        this.spells = [];

    },
    putInMap: function (battleId,map,cell,tick,tickToActive){
        this.battleId = battleId;
        this.tickToActive = tickToActive;
        this.curTick = tick;
        this.isActive = false;
        this.curTime = 0;
        this.map = map;
        this.cell = cell;

        cc.log("cell.posInMap "+cell.posInMap.x+ " "+cell.posInMap.y);
        var posPixelOfUI = Helper.convertPoint2Pixel(cell.posInMap,this.map.isMyMap);
        this.mapPixel = posPixelOfUI;
        this.logicPoint = Helper.convertMapPixelToLogicPoint(this.mapPixel,this.map.isMyMap);
        this.towerUIStat0 = new TowerUI(this,map,true);
        map.addChild(this.towerUIStat0,1000)
        this.towerUIStat0.setPosition(this.mapPixel);
        this.towerUIStat0.setAnchorPoint(cc.p(0.5, 0.5));

        this.curLogicPoint = Helper.convertMapPixelToLogicPoint(this.mapPixel,map.isMyMap);

        cc.log("UI Position "+this.towerUIStat0.getPosition().x+" "+this.towerUIStat0.getPosition().y);

        this.towerUIStat123 = new TowerUI(this,map,true);
        map.addChild(this.towerUIStat123,1000);
        this.towerUIStat123.setPosition(this.mapPixel);
        this.towerUIStat123.setAnchorPoint(cc.p(0.5, 0.5));

        this.setUIRunAnimIdle();

        if (this.map.isMyMap){
            this.player = gv.battleController.players[0];
        }
        else {
            this.player = gv.battleController.players[1];
        }

        //this.towerUIStat0.runAimAttack(0);
        //this.towerUIStat123.runAimAttack(this.curStat);
        return true;

    },
    dropTower: function (){
        if (!this.map.dropTower(this.cell,this)){
            cc.log("Cannot drop Tower in Map"+this.cell.posInMap.x+" "+this.cell.posInMap.y);
            return false;
        }
        this.towerUIStat0.dropInMap();
        this.towerUIStat123.dropInMap();
        cc.log("drop Tower success is "+this.cell.posInMap.x+" "+this.cell.posInMap.y);
        var player;
        if (this.map.isMyMap){
            player = gv.battleController.players[0];
        }
        else {
            player = gv.battleController.players[1];
        }
        Helper.removeFromArray(player.towerInMapList,this);
        return true;
    },
    dropInMap: function (isServerInput = false){
        if (!this.isActive && this.isMyMap){
            cc.log("Cannot drop Tower because not active"+this.cell.posInMap.x+" "+this.cell.posInMap.y);
            return false;
        }
        if (!isServerInput){
            if (!this.map.isMyMap){
                cc.log("Cannot drop opponent Tower ");
                return false;
            }
            else {
                var cellPoint = Helper.convertMapCellToLogicCell(this.cell.posInMap,true);
                gv.battleController.sendDropTower(gv.battleController.curTick,cellPoint.x,cellPoint.y);
            }
        }
        return this.dropTower();

        //this.isActive = false;

    },
    upgradeTower: function (){
        if (this.curStat == 3){
            return false;
        }
        cc.log("upgrade Tower 3")
        this.curStat+=1;
        if (!this.isStartAttack) {
            this.setUIRunAnimIdle();
        }
        return true;
    },
    onActive: function (){
        this.isActive = true;
        this.towerUIStat0.onActive();
        this.towerUIStat123.onActive();
    },
    setUIRunAnimIdle: function (){
        this.towerUIStat0.runAimIdle(0);
        this.towerUIStat123.runAimIdle(this.curStat);
    },
    setUIRunAnimAttack: function (){
        this.towerUIStat0.runAimAttack(0);
        this.towerUIStat123.runAimAttack(this.curStat);
    },

    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    updateActiveTower: function () {
        this.curTick += 1;
        if ((this.curTick >= this.tickToActive) && (this.isActive == false) ) {
            this.onActive();
        }
        this.updateSpellPerTick();
        this.updateTimerSprite();
    },
    parse: function (tower){
        //abstract
    },
    // spell LA
    isBuffBySpell:function(spell){
        for(let i = 0; i < this.spells.length; ++i){
            if(spell.battleId == this.spells[i].spell.battleId){
                return true;
            }
        }
        return false;
    },
    getSpeed:function (){
        return this.speed;
    },
    getEffectTick:function (spell){
        for(let i = 0; i < this.spells.length; ++i){
            if(spell.battleId == this.spells[i].spell.battleId){
                return this.spells[i].tick;
            }
        }
        return -1;
    },
    getBuffById: function (buffId){
        for(let i=0;i<this.buffs.length;i++){
            if (this.buffs[i].battleId == buffId){
                return this.buffs[i];
                cc.log("Tower "+this.buffs[i].battleId +" "+buffId);
            }
        }
        return null;
    },
    // AnhLPL yeu cau
    increaseDamage:function (spellId, rate){
        // todo-Hanh
        let buffId = spellId+"_Buff_";
        cc.log(buffId);
        var buff = this.getBuffById(buffId);
        if (buff == null){
            buff = new SpellTowerBuff(0);
            buff.battleId = buffId;
            buff.addEffect(new Effect("damageUp", "damageAdjustment", rate - 1))
            this.addBuff(buff);
            this.player.addBuff(buff);
        }
        else {
            buff.effects[1].value += rate -1;
        }
    },
    // AnhLPL yeu cau
    removeDamage:function (spellId){
        // todo-Hanh
        let buffId = spellId+"_Buff_";
        let buff = this.getBuffById(buffId);
        this.popBuff(buff);
        this.player.popBuff(buff);
    },
    addBuff: function (buff){
        if (Helper.checkInArr(this.buffs,buff)) {
            return;
        }
        this.buffs.push(buff);
    },
    popBuff: function (buff){
        Helper.removeFromArray(this.buffs, buff);
    },
    addSpell:function (spell){
        this.spells.push({
            "spell": spell,
            "tick": spell.effectTick
        });

    },
    addSpellWithTick:function (spell, tick){
        for(let i = 0; i < this.spells.length; ++i){
            if(this.spells[i].spell == spell){
                this.spells[i].tick = tick;
                return;
            }
        }
        this.spells.push({
            "spell": spell,
            "tick": tick
        });
    },
    updateSpellPerTick:function (){
        for(let i = 0; i < this.spells.length; ++i){
            let spell = this.spells[i].spell;
            if(this.spells[i].tick > 0){
                this.spells[i].tick--;
                spell.doAction(this);
            }
            else{
                Helper.removeFromArray(this.spells, this.spells[i]);
                spell.removeEffect(this);
                i--;
            }
        }
    },
    addTimerSprite: function (timerSprite){
        this.timerSprite = timerSprite;
    },
    updateTimerSprite:  function (timerSprite){
        if (this.timerSprite == null){
            return;
        }
        if (this.isActive){
            this.timerSprite.setVisible(false);
        }
        if (this.curTick <= this.tickToActive - 1 && this.curTick >= this.tickToActive - 1 - GC.BATTLE.TICK_PER_SECOND){
            this.timerSprite.setVisible(true);
            let tick = this.tickToActive - 1 - this.curTick;
            this.timerSprite.setPercentage(100 - tick*100.0/60);
        }
        if (this.curTick < this.tickToActive - 1 - GC.BATTLE.TICK_PER_SECOND) {
            this.timerSprite.setVisible(false);
        }

    }
});

Tower.addTower = function (battleId,tower,map,cell,tick,tickToActive,card){
    if (cell.obstacleType == OBSTACLE.TOWER && cell.obstacle.type == tower.type){
        return Tower.upgradeTower(tower,map,cell,tick,card);
    }
    if (map.isMyMap){
        if (!map.addTower(cell,tower)){
            return false;
        }
    }
    if (tower.putInMap(battleId,map,cell,tick,tickToActive)){
        if (map.isMyMap){
            var logicCell = Helper.convertMapCellToLogicCell(cell.posInMap,true);
            gv.battleController.sendPlaceTower(gv.battleController.curTick,card.battleId,
                logicCell.x,logicCell.y);
            gv.battleController.players[0].towerInMapList.push(tower);

            let timerSprite = new cc.ProgressTimer(new cc.Sprite(res.timer_sprite));
            let pos = Helper.convertPoint2Pixel(cell.posInMap,map.isMyMap);
            timerSprite.setPosition(pos.x,pos.y);
            timerSprite.type = cc.ProgressTimer.TYPE_RADIAL;
            // timerSprite.runAction(cc.progressFromTo(20, 0, 100).repeatForever());
            map.addChild(timerSprite,900);
            tower.addTimerSprite(timerSprite);
        }
        else {
            gv.battleController.players[1].towerInMapList.push(tower);
        }

        return true;
    }
    return false;
};
Tower.upgradeTower = function (tower,map,cell,tick,card){
    cc.log("Tower. upgrade Tower ");
    cc.log("Tower type: "+cell.obstacle.type+" "+tower.type);
    if (!(cell.obstacleType == OBSTACLE.TOWER && cell.obstacle.type == tower.type)){
        return false;
    }
    cc.log("Tower. upgrade Tower 2");
    if (!cell.obstacle.upgradeTower()){
        return false;
    }
    if (map.isMyMap){
        var logicCell = Helper.convertMapCellToLogicCell(cell.posInMap,true);
        gv.battleController.sendUpgradeTower(gv.battleController.curTick,card.battleId,
            logicCell.x,logicCell.y);
    }

    return true;

};

