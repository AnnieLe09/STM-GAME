var Player = cc.Class.extend({
    ctor:function(){
        this.spellInMapList = [];
        this.towerInMapList = [];

        this.monsterInMapList = [];
        this.generatedSystemMonsterId = 0;

        // this.placedMonsterInMapList = [];
        this.generatedPlacedMonsterId = 0;

        this.systemMonsters = [];
        this.trappedMonsters = [];
        this.placedMonsters = []; // [[monsterObj, tickToRelease], [monsterObj, tickToRelease], ...]

        this.bulletInMapList = [];
        this.buffInMapList = [];
        this.cardList = [];
        this.curHp = GC.BATTLE.INIT_HP;
        this.curEnergy = GC.BATTLE.INIT_ENERGY;
        //this.curTick = 0;

        this.balloonNumberList = [1,3,5,6,7,8,9,11];

        this.monsterBalloon = null;
    },

    getSystemMonsterId: function(){
        var s = "Monster:1:" + this.generatedSystemMonsterId;
        this.generatedSystemMonsterId++;
        return s;
    },
    getPlaceMonsterId: function(){
        var s = "Monster:2:" + this.generatedPlacedMonsterId;
        this.generatedPlacedMonsterId++;
        return s;
    },

    // DecreaaseHP and Up energy
    decreaseCurHp:function(type){
        if(type == "boss"){
            var newHp = this.curHp - 5;
        }
        else{
            var newHp = this.curHp - 1;
        }

        if (newHp < 0){
            newHp = 0;
        }
        
        this.increaseEnergy(10*(this.curHp - newHp));

        this.setCurHp(newHp);

    },

    increaseEnergy:function(energy){
        this.setCurEnergy(this.curEnergy + energy);
    },
    // ---------------------------------------------

    startRound:function (){
        let round = this.battleController.curRound;
        this.createSystemMonsters(round - 1, this.battleController.systemMonsterTypes[round - 1]);
    },
    releaseSystemMonster:function (){
        if(this.systemMonsters != null && this.systemMonsters.length > 0){
            let monster = this.systemMonsters.shift();
            // cc.log("release monster: "+ monster.battleId);
            monster.setVisible(true);

            // if (this.monsterBalloon){
            //     log("Monster balloon: " + this.monsterBalloon.battleObjectId);
            // }
            // else {
            //     log("Monster balloon: " + "K co");
            // }
            

            // balloon
            if(monster.balloon != null){
                if(this.monsterBalloon == null){
                    this.monsterBalloon = monster;
                    gv.battleController.players[0].virtualMap.renderField.setNumber(monster.balloon.getTag());
                }
                else {
                    monster.balloon.setVisible(false);
                }
                
            }
            
            //this.monsterInMapList.push(monster);

            var i = 0;
            while(i < this.monsterInMapList.length && this.monsterInMapList[i].battleObjectId[8] == "1"){
                i++;
            }

            this.monsterInMapList.splice(i, 0, monster);
            // this.virtualMap.addMonster(monster);
            monster.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition);

            // for(var i = 0; i < this.monsterInMapList.length; i++){
            //     log(this.monsterInMapList[i].battleObjectId);
            // }
            // log("======================================================");
        }
    },

    addMonster:function(type, curr_direction, position) {
        var monster = new WalkMonster(type, this.virtualMap.isMyMap, 1, true, this.getSystemMonsterId());

        var i = 0;
        while(i < this.monsterInMapList.length && this.monsterInMapList[i].battleObjectId[8] == "1"){
            i++;
        }

        this.monsterInMapList.splice(i, 0, monster);
        this.virtualMap.addMonster(monster, position);
        monster.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition, curr_direction);

    },

    updatePerTick:function (){
        //this.curTick++;

        // cc.log("============== tick: " + gv.battleController.curTick + " =================");
        // cc.log("player hp: " + this.curHp);
        this.releasePlaceMonster();


        this.updateBuff();
        this.updateSpells();
        this.updateMonsters();
        this.updateTowers();
        this.updateBullets();

        this.checkMonsterAgain();

        this.clearTrash();
    },

    checkMonsterAgain:function() {
        var flag = null;

        for(let i = 0; i < this.monsterInMapList.length; ++i){
            let monster = this.monsterInMapList[i];
            // Check monster die
            if (monster.wentHome) { // Monster da ve nha
                this.decreaseCurHp(monster.category);
            }
            else {
                if(!monster.isAlive) {
                    this.increaseEnergy(monster.gainEnergy);
                }
            }

            // Check boss skill
            if (monster.bossSkill == GC.BOSS.SKILL.MOC_TINH) {
                if(monster.counter % GC.BOSS.MOC_TINH.TIME_TO_RELEASE == 0) {
                    flag = monster;
                    break;
                }
            }
            else if (monster.bossSkill == GC.BOSS.SKILL.GOLEM){
                if (!monster.isAlive && !monster.wentHome) {
                    flag = monster;
                }
            }
        }

        // Set boss skill
        if (flag){
            if(flag.bossSkill == GC.BOSS.SKILL.MOC_TINH){
                this.addMonster(12, flag.curr_direction, cc.p(flag.posX, flag.posY));
            }
            else if(flag.bossSkill == GC.BOSS.SKILL.GOLEM) {
                var p = Helper.convertMapPixelToLogicPoint(cc.p(flag.posX, flag.posY), this.isMyMap);
                var p1 = cc.p(Math.floor(p.x) , Math.floor(p.y));
                var pos1 = Helper.convertLogicPointToMapPixel(cc.p(p1.x + 0.4, p1.y+0.4), this.isMyMap);
                var pos2 = Helper.convertLogicPointToMapPixel(cc.p(p1.x + 0.6, p1.y+0.6), this.isMyMap);

                this.addMonster(10, flag.curr_direction, pos1);
                this.addMonster(10, flag.curr_direction, pos2);
            }
        }

    },
    
    updateBuff:function (){
        //cc.log("Player co "+this.buffInMapList.length + " Buff");
        for(let i=0;i<this.buffInMapList.length;i++){
            //cc.log("Player buff "+i+" co batlleId la: "+this.buffInMapList[i].battleId);
           // cc.log("Player buff "+i+" co batlleId la: "+this.buffInMapList[i].battleId);
            this.buffInMapList[i].updateBuff(1.0/60);
        }
    },

    updateMonsters:function (){
        // Update monster
        for(let i = 0; i < this.monsterInMapList.length; ++i){
            let monster = this.monsterInMapList[i];
            this.checkMonsterCollision(monster); //LA
            monster.update();
        }
    },
    checkMonsterCollision: function (monster){
        for(let j = 0; j < this.monsterInMapList.length; ++j){
            let monster2 = this.monsterInMapList[j];
            if(monster.battleObjectId != monster2.battleObjectId){
                monster.checkCollision(monster2);
            }
        }
    },
    updateTowers:function (){
        for(var i=0;i<this.towerInMapList.length;i++){
            this.towerInMapList[i].updateTower();
        }
    },
    updateBullets:function (){
        for(var i=0;i<this.bulletInMapList.length;i++){
            this.bulletInMapList[i].updateBullet();
        }
    },
    updateSpells:function (){

        for(let i = 0; i < this.spellInMapList.length; ++i){
            let spell = this.spellInMapList[i];
            //cc.log("update spell: "+spell.battleId);
            if(spell.update(this.monsterInMapList, this.towerInMapList) == false){
                Helper.removeFromArray(this.spellInMapList, spell);
                i--;
                //gv.battleController.battleLayer.removeSpell(i);
            }
        }
    },
    clearTrash:function (){
        //clear Bullet
        let i=0;
        while (i < this.bulletInMapList.length){
            if (this.bulletInMapList[i].isAlive == false){
                Helper.removeFromArray(this.bulletInMapList,this.bulletInMapList[i])
            }
            else {
                i+=1;
            }
        }

        // clear buff
        i=0;
        while (i < this.buffInMapList.length){
            if (this.buffInMapList[i].isActive == false){
                Helper.removeFromArray(this.buffInMapList,this.buffInMapList[i])
            }
            else {
                i+=1;
            }
        }

        // clear Monster
        for(let i = 0; i < this.monsterInMapList.length; ++i){
            let monster = this.monsterInMapList[i];
            if (!monster.isAlive){
                monster.destroy();
                i--;
            }
        }

    },
    setInfo:function(name, avatar, trophy){
        this.name = name;
        this.avatar = avatar;
        this.trophy = trophy;
    },
    setCardList:function(cardList){
        this.cardList = cardList;
    },
    setSystemMonsters: function(monsters){
        this.systemMonsters = monsters;
    },
    setMap:function(map){
        this.map = map;
    },
    setCurHp: function (curHp){
        this.curHp = curHp;

        var playerIdx;
        if (this.isMyMap){
            playerIdx = 0;
        }
        else{
            playerIdx = 1;
        }
        gv.battleController.battleLayer.setPlayerHp(playerIdx,this.curHp);
    },

    setCurEnergy: function (curEnergy){
        this.curEnergy = curEnergy;
        if (this.isMyMap){
            gv.battleController.battleLayer.setEnerny(this.curEnergy);
        }
    },

    setVirtualMap:function(map){
        this.virtualMap = map;
    },
    setBattleController:function (battleController){
        this.battleController = battleController;
    },
    setIsMyMap:function (isMyMap){
      this.isMyMap = isMyMap;
    },

    setTowerInMapList: function (towers){
        var towersId = [];
        for(let i =0;i < towers.length; ++i) {
            let towerPk = towers[i];
            towersId.push(towerPk.battleId);
            let tower = this.findTowerByBattleId(towerPk.battleId);
            if (tower == null ){
                // cc.log("Player tower == "+tower.battleId);
                //cc.log("Player tower == null");
            }
            else {
                //cc.log("Player tower == "+tower.battleId);
            }

            towerPk.player = this;
            let flag = true;
            if (tower == null){
                //cc.log("Player tower == null")
                flag = false;
                tower = TowerFactory.create(towerPk.type);
            }
            tower.parse(towerPk);
            if (!flag){
                //cc.log("Player flag == false")
                tower.putInMap(tower.battleId,tower.map,tower.cell,gv.battleController.curTick,tower.tickToActive);
                this.towerInMapList.push(tower);
            }
            //LA
            for(let j = 0; j < towerPk.spellNum; ++j){
                let spellPk = towerPk.spells[j];
                let spell = this.findSpellByBattleId(this.spellInMapList, spellPk.battleId);
                if(spell != null){
                    tower.addSpellWithTick(spell, spellPk.tick);
                    spell.doEffect(tower);
                }
            }
        }
        for(let i=0;i<this.towerInMapList.length;i++){
            let tower = this.towerInMapList[i];
            if (!Helper.checkInArr(towersId,tower.battleId)){
                tower.dropTower();
            }
        }
    },
    setBulletInMapList: function (bullets){
        var bulletsId = [];
        for(let i =0;i < bullets.length; ++i) {
            let bulletPk = bullets[i];
            let bullet = this.findBulletByBattleId(bulletPk.battleId);
            bulletsId.push(bulletPk.battleId);
            bulletPk.player = this;
            let flag = true;
            if (bullet == null){
                flag = false;
                bullet = BulletFactory.create(this.findTowerByBattleId(bulletPk.towerBattleId));
            }
            bullet.parse(bulletPk);
            if (!flag){
                //todo-Hanh
                this.bulletInMapList.push(bullet);
            }
        }

        for(let i=0;i<this.bulletInMapList.length;i++){
            let bullet = this.bulletInMapList[i];
            if (!Helper.checkInArr(bulletsId,bullet.battleId)){
                bullet.destroy();
                Helper.removeFromArray(this.buffInMapList,bullet);
            }
        }
    },
    setCellInMapList: function (cells){
        for(let i =0;i < cells.length; ++i) {
            let cellPk = cells[i];
            let cell = this.virtualMap.cellMatrix[cellPk.posInMap.x][cellPk.posInMap.y];
            cellPk.player = this;
            cell.parse(cellPk);
        }
    },
    setBuffInMapList:function (buffs){
        var buffsId = [];

        for(let i =0;i < buffs.length; ++i) {
            let buffPk = buffs[i];
            let buff = this.findBuffByBattleId(buffPk.battleId);
            buffsId.push(buffPk.battleId);

            buffPk.player = this;
            let flag = true;
            if (buff == null){
                flag = false;
                buff = new BuffFactory.create(buffPk.buffType,buffPk.buffTypeOrder);
            }
            buff.parse(buffPk);
            if (!flag){
                //todo-Hanh
                this.addBuff(buff);
            }
        }
        for(let i=0;i<this.buffInMapList.length;i++){
            let buff = this.buffInMapList[i];
            if (!Helper.checkInArr(buffsId,buff.battleId)){
                Helper.removeFromArray(this.buffInMapList,buff);
            }
        }
    },
    setSpellInMapList:function (spells){
        for(let i = 0; i < this.spellInMapList.length; ++i){
            let spell = this.findSpellByBattleId(spells, this.spellInMapList[i].battleId);
            if(spell == null){
                this.spellInMapList[i].ui.removeFromParent();
                Helper.removeFromArray(this.spellInMapList, this.spellInMapList[i]);
                i--;
            }
        }
      for(let i = 0; i < spells.length; ++i){
          let spellPk = spells[i];
          let spell = this.findSpellByBattleId(this.spellInMapList, spellPk.battleId);
          if(spell != null){
              spell.leftTick = spellPk.leftTick;
              spell.animTick = spellPk.animTick;
              spell.curPos = cc.p(spellPk.curPos.x, spellPk.curPos.y);
          }
          else{
              spell = SpellFactory.create(spellPk.objectId);
              spell.curPos = cc.p(spellPk.curPos.x, spellPk.curPos.y);
              spell.leftTick = spellPk.leftTick;
              spell.animTick = spellPk.animTick;
              this.spellInMapList.push(spell);
              let pos = Helper.convertLogicPointToMapPixel(spell.curPos, this.isMyMap);
              gv.battleController.battleLayer.addSpell(spell, pos, this.isMyMap);
          }
      }
    },
    setSystemMonstersStatus:function (monsters){
        for(let i = 0; i < monsters.length; ++i){
            let monsterPk = monsters[i];
            //let monster = this.findMonsterInArray(this.systemMonsters, monsterPk)
        }
    },
    setMonsterInMapList:function (monsters){
        // log("BEFORE *****************************************")
        // log("client ------------------")
        // for(var k = 0; k < this.monsterInMapList.length; k++) {
        //     log(this.monsterInMapList[k].battleObjectId);
        // }
        // log("server ------------------")
        // for(var k = 0; k < monsters.length; k++) {
        //     log(monsters[k].battleId);
        // }

        var i = 0;
        var j = 0;

        while(i < this.monsterInMapList.length && j < monsters.length){
            if(this.monsterInMapList[i].battleObjectId == monsters[j].battleId){
                this.monsterInMapList[i].setState(monsters[j]);
                i++;
                j++;
            }
            else{
                // var client = Number(this.monsterInMapList[i].battleObjectId.split(':')[2])
                // var server = Number(monsters[j].battleId.split(':')[2])
                if(Helper.isGreaterBattleId(monsters[j].battleId, this.monsterInMapList[i].battleObjectId)){ // Server chet r ma client chua chet => xoa khoi clinet
                    var m = this.monsterInMapList[i];
                    m.destroy();
                }
                else { // Client chet r ma server chua chet => them vao client
                    var monster = monsters[j];
                    var isSystemMonster = (monster.battleId[8] == "1");
                    if(monster.type == 3){
                        var x = new FlyMonster(monster.type, this.isMyMap, 1, isSystemMonster, monster.battleId);
                    }
                    else {
                        var x = new WalkMonster(monster.type, this.isMyMap, 1, isSystemMonster, monster.battleId);
                    }
                    this.virtualMap.addMonster(x);
                    x.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition);
                    x.setState(monster);
                    this.monsterInMapList.splice(i, 0, x);
                    let monsterPk = monsters[j];
                    for(let k = 0; k < monsterPk.spellNum; ++k){
                        let spellPk = monsterPk.spells[i];
                        let spell = this.findSpellByBattleId(this.spellInMapList, spellPk.battleId);
                        if(spell != null){
                            x.addSpellWithTick(spell, spellPk.tick);
                        }
                    }
                    i++;
                    j++;
                }
            }
        }
        while(i < this.monsterInMapList.length){
            var m = this.monsterInMapList[i];
            m.destroy();
        }
        while(j < monsters.length){
            var monster = monsters[j];
            var isSystemMonster = (monster.battleId[8] == "1");
            if(monster.type == 3){
                var x = new FlyMonster(monster.type, this.isMyMap, 1, isSystemMonster, monster.battleId);
            }
            else {
                var x = new WalkMonster(monster.type, this.isMyMap, 1, isSystemMonster, monster.battleId);
            }
            this.virtualMap.addMonster(x);
            x.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition);
            x.setState(monster);
            this.monsterInMapList.push(x);
            j++;
        }
        //LA
        for(let k = 0; k < monsters.length; ++k){
            let monster = this.findMonsterByBattleId(monsters[k].battleId);
            let id = monsters[k].collisionMonster;
            if(id != null){
                let collisionMonster = this.findMonsterByBattleId(id);
                monster.collisionMonster = collisionMonster;
            }
            else{
                monster.collisionMonster = null;
            }
        }
        // log("AFTER *****************************************")
        // log("client ------------------")
        // for(var k = 0; k < this.monsterInMapList.length; k++) {
        //     log(this.monsterInMapList[k].battleObjectId);
        // }
        // log("server ------------------")
        // for(var k = 0; k < monsters.length; k++) {
        //     log(monsters[k].battleId);
        // }
    },
    
    findSpellByBattleId:function (id){
        for(let i = 0; i < this.spellInMapList.length; ++i){
            let spell = this.spellInMapList[i];
            if(spell.battleId == id) return spell;
        }
        return null;
    },
    findSpellByBattleId:function (spellArr, id){
        for(let i = 0; i < spellArr.length; ++i){
            let spell = spellArr[i];
            if(spell.battleId == id) return spell;
        }
        return null;
    },
    findBulletByBattleId:function (id){
        for(let i = 0; i < this.bulletInMapList.length; ++i){
            let bullet = this.bulletInMapList[i];
            if(bullet.battleId == id) return bullet;
        }
        return null;
    },
    findBuffByBattleId:function (id){
        for(let i = 0; i < this.buffInMapList.length; ++i){
            let buff = this.buffInMapList[i];
            if(buff.battleId == id) return buff;
        }
        return null;
    },
    findTowerByBattleId:function (id){
        for(let i = 0; i < this.towerInMapList.length; ++i){
            let tower = this.towerInMapList[i];
            if(tower.battleId == id) return tower;
        }
        return null;
    },
    findMonsterByBattleId:function (id){
        for(let i = 0; i < this.monsterInMapList.length; ++i){
            let monster = this.monsterInMapList[i];
            if(monster.battleObjectId == id) return monster;
        }
        return null;
    },
    findMonsterInArray:function (arr, id){
        for(let i = 0; i < arr.length; ++i){
            let monster = arr[i];
            if(monster.battleObjectId == id) return monster;
        }
        return null;
    },

    createSystemMonsters:function(round, types){ // types is one dimension array with 3 element

        if (types[0] >= 5){ // Boss
            var x = new WalkMonster(types[0], this.virtualMap.isMyMap, 1, true, this.getSystemMonsterId());
            this.systemMonsters.push(x);
            this.virtualMap.addMonster(x);
            return;
        }
        let player;
        if (this == gv.battleController.players[0]){
            player =  gv.battleController.players[1];
        }
        else {
            player =  gv.battleController.players[0];
        }

        var totalTowerLevel = player.getTotalStatTower();;
        // var totalTowerLevel = 5;

        // if (types[0] >= 5){ // Boss
        //     var x = new WalkMonster(types[0], this.virtualMap.isMyMap, 1, true, this.getSystemMonsterId());
        //     this.systemMonsters.push(x);
        //     this.virtualMap.addMonster(x);
        //     return;
        // }



        var rate = Math.floor(totalTowerLevel/5);
        if(rate > 6) rate = 6;
        var hpRate = GC.MONSTER.GENERATION.MULTIPLIER[rate]["hp"];
        var numMonsterRate = GC.MONSTER.GENERATION.MULTIPLIER[rate]["monster"];

        for(var i = 0; i < 3; i++){
            var type = types[i];

            if(type >= 0){
                if(type >= 5){
                    var numMonster = 1;
                }
                else {
                    var baseNumMonster = GC.MONSTER.GENERATION.BASE[type];
                    var spawnRate = GC.MONSTER.GENERATION.ROUND[round+1]["rate"][i];
                    var numMonster = Math.ceil(baseNumMonster * spawnRate * numMonsterRate);
                }
                
                // log("numMonster: " + numMonster + "....Round: " + round);

                var monsterIdx = -1;
                var num = 0;
                if(!this.isMyMap && type < 5) {
                    var monsterIdx = Math.floor(Math.random() * numMonster);
                    log("monster random: " + monsterIdx);
                    if(this.balloonNumberList != null && this.balloonNumberList.length > 0 && !this.isMyMap){
                        var num = this.balloonNumberList.shift();
                    }
                }


                for(var j = 0; j < numMonster; j++){
                    var x;
                    if (type == 3){
                        x = new FlyMonster(type, this.virtualMap.isMyMap, hpRate, true, this.getSystemMonsterId());
                    }
                    else {
                        x = new WalkMonster(type, this.virtualMap.isMyMap, hpRate, true, this.getSystemMonsterId());
                    }
                    x.setVisible(false);
                    this.systemMonsters.push(x);
                    this.virtualMap.addMonster(x);

                    if(j == monsterIdx && num > 0){
                        x.addBalloon(num);
                    }
                    
                }
            }
        }

        // log("Player ..................Round " + round)
        // for(var i = 0 ; i < this.systemMonsters.length; i++){
        //     log(this.systemMonsters[i].battleObjectId)
        // }
    },


    recreateSystemMonster:function(listMonsters){

        var i = 0;
        var j = 0;

        while(i < this.systemMonsters.length && j < listMonsters.length){
            if(this.systemMonsters[i].battleObjectId == listMonsters[j].battleId){
                i++;
                j++;
            }
            else{
                var client = Number(this.systemMonsters[i].battleObjectId.split(':')[2])
                var server = Number(listMonsters[j].battleId.split(':')[2])
                if(client < server){ // Server chet r ma client chua chet => xoa khoi clent
                    var m = this.systemMonsters[i];
                    Helper.removeFromArray(this.systemMonsters, m);
                    m.removeFromParent(true);

                }
                else { // Client chet r ma server chua chet => them vao client
                    var monster = listMonsters[j];
                    if(monster.type == 3){
                        var x = new FlyMonster(monster.type, this.isMyMap, monster.hpRate, true, monster.battleId);
                    }
                    else {
                        var x = new WalkMonster(monster.type, this.isMyMap, monster.hpRate, true, monster.battleId);
                    }
                    x.setVisible(false);
                    this.systemMonsters.splice(i, 0, x);
                    this.virtualMap.addMonster(x);
                    i++;
                    j++;
                }
            }
        }
        while(i < this.systemMonsters.length){
            var m = this.systemMonsters[i];
            Helper.removeFromArray(this.systemMonsters, m);
            m.removeFromParent(true);
        }
        while(j < listMonsters.length){
            var monster = listMonsters[j];
            if(monster.type == 3){
                var x = new FlyMonster(monster.type, this.isMyMap, monster.hpRate, true, monster.battleId);
            }
            else {
                var x = new WalkMonster(monster.type, this.isMyMap, monster.hpRate, true, monster.battleId);
            }
            x.setVisible(false);
            this.virtualMap.addMonster(x);
            this.systemMonsters.push(x);
            j++;
        }

        // if (monsters.length > 0){
        //     this.generatedSystemMonsterId = Number(monsters[monsters.length-1].battleId.split(':')[2]) + 1;
        //     // log("NUMMMMMMMMMMMMMMMMMM =" + this.generatedSystemMonsterId)
        // }

        // log("AFTER *****************************************")
        // log("client ------------------")
        // for(var k = 0; k < this.monsterInMapList.length; k++) {
        //     log(this.monsterInMapList[k].battleObjectId);
        // }
        // log("server ------------------")
        // for(var k = 0; k < monsters.length; k++) {
        //     log(monsters[k].battleId);
        // }
    },


    addBuff: function (buff){
        for(let i=0;i<this.buffInMapList.length;i++){
            if (this.buffInMapList[i].battleId == buff.battleId){
                return;
            }
        }
        this.buffInMapList.push(buff);
    },
    popBuff: function (buff){
        Helper.removeFromArray(this.buffInMapList,buff);
    },

    getNumPlaceMonster:function(){
        var rate = Math.floor(this.getTotalStatTower()/5);
        if(rate > 6) rate = 6;
        var numMonsterRate = GC.MONSTER.GENERATION.MULTIPLIER[rate]["monster"];
        var baseNumMonster = 1;
        return Math.ceil(baseNumMonster * numMonsterRate);
    },

    createPlaceMonster: function(type){
        var playerIdx = this.isMyMap? 1:0;

        var totalTowerLevel = this.getOpponentPlayer().getTotalStatTower();
        
        // log("================ Tha quai:" +  gv.battleController.curTick)
        
        var rate = Math.floor(totalTowerLevel/5);
        if(rate > 6) rate = 6;
        var hpRate = GC.MONSTER.GENERATION.MULTIPLIER[rate]["hp"];
        var numMonsterRate = GC.MONSTER.GENERATION.MULTIPLIER[rate]["monster"];
        var baseNumMonster = 1;

        var numMonster = Math.ceil(baseNumMonster * numMonsterRate);
        // log("Nummonster :" + numMonster)

        if (!gv.battleController.decreaseEnergy(playerIdx, numMonster)) return;
        
        var temp = [];
        var tick = gv.battleController.curTick+1;
        for(var j = 0; j < numMonster; j++){
            var x;
            if (type == 3){
                x = new FlyMonster(type, this.virtualMap.isMyMap, hpRate, false, this.getPlaceMonsterId());
            }
            else {
                x = new WalkMonster(type, this.virtualMap.isMyMap, hpRate, false, this.getPlaceMonsterId());
            }
            x.setVisible(false);
            this.virtualMap.addMonster(x);
            temp.push([x, tick]);
            tick += GC.BATTLE.TICK_PER_MONSTER;
        }

        var newArr = [];
        var i = 0;
        var j = 0;
        while(i < this.placedMonsters.length && j < temp.length){
            if(this.placedMonsters[i][1] <= temp[j][1]){
                newArr.push(this.placedMonsters[i]);
                i++;
            }
            else {
                newArr.push(temp[j]);
                j++;
            }
        }
        while (i < this.placedMonsters.length){
            newArr.push(this.placedMonsters[i]);
            i++;
        }
        while (j < temp.length){
            newArr.push(temp[j]);
            j++;
        }

        this.placedMonsters = newArr;
        // for(var i = 0; i < this.placedMonsters.length; i++){
        //     log('===================== Tha quai: ' + this.placedMonsters[i][1]);
        // }
    },
    addTrappedMonsters:function (monster){
        this.trappedMonsters.push(monster);
    },
    releaseTrappedMonster:function (){
        if(this.trappedMonsters != null && this.trappedMonsters.length > 0){
            let monsterId = this.trappedMonsters.shift();
            let monster = this.findMonsterByBattleId(monsterId);
            let p = Helper.convertPoint2Pixel(this.virtualMap.startPosition, this.virtualMap.isMyMap);
            monster.setMonsterPosition(p.x, p.y);
            monster.setVisible(true);
            monster.status = GC.MONSTER.STATUS.NORMAL;
            monster.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition);
        }
    },
    setTrappedMonsters:function (monsters){
        this.trappedMonsters = monsters;
    },
    recreatePlaceMonster:function(listMonsters){

        var i = 0;
        var j = 0;

        while(i < this.placedMonsters.length && j < listMonsters.length){
            if(this.placedMonsters[i][1] == listMonsters[j].tick && this.placedMonsters[i][0].battleObjectId == listMonsters[j].battleId){
                i++;
                j++;
            }
            else if (this.placedMonsters[i][1] == listMonsters[j].tick && this.placedMonsters[i][0].battleObjectId != listMonsters[j].battleId){
                var x = this.placedMonsters[i];
                Helper.removeFromArray(this.placedMonsters, x);
                x[0].removeFromParent(true);
            }
            else{
                var client = this.placedMonsters[i][1];
                var server = listMonsters[j].tick;
                if(client < server){ // Server chet r ma client chua chet => xoa khoi clent
                    var x = this.placedMonsters[i];
                    Helper.removeFromArray(this.placedMonsters, x);
                    x[0].removeFromParent(true);

                }
                else { // Client chet r ma server chua chet => them vao client
                    var monster = listMonsters[j];
                    if(monster.type == 3){
                        var x = new FlyMonster(monster.type, this.isMyMap, monster.hpRate, false, monster.battleId);
                    }
                    else {
                        var x = new WalkMonster(monster.type, this.isMyMap, monster.hpRate, false, monster.battleId);
                    }
                    x.setVisible(false);
                    this.virtualMap.addMonster(x);
                    this.placedMonsters.splice(i, 0, [x, monster.tick]);
                    i++;
                    j++;
                }
            }
        }
        while(i < this.placedMonsters.length){
            var x = this.placedMonsters[i];
            Helper.removeFromArray(this.placedMonsters, x);
            x[0].removeFromParent(true);
        }
        while(j < listMonsters.length){
            var monster = listMonsters[j];
            if(monster.type == 3){
                var x = new FlyMonster(monster.type, this.isMyMap, monster.hpRate, false, monster.battleId);
            }
            else {
                var x = new WalkMonster(monster.type, this.isMyMap, monster.hpRate, false, monster.battleId);
            }
            x.setVisible(false);
            this.virtualMap.addMonster(x);
            this.placedMonsters.push([x, monster.tick]);
            j++;
        }

        // for(var i = 0; i < this.placedMonsters.length; i++){
        //     log([this.placedMonsters[i][0].battleObjectId, this.placedMonsters[i][1] ])
        // }
    },

    releasePlaceMonster: function(){
        if(this.placedMonsters == null || this.placedMonsters.length == 0) return;

        while(this.placedMonsters.length > 0 && gv.battleController.curTick == this.placedMonsters[0][1]){
            var m = this.placedMonsters.shift();
            
            var monster = m[0];
            // log("release Monster: " + monster.battleObjectId);

            monster.setVisible(true);

            //monster.setPlayer(this);

            monster.run(this.virtualMap.cellMatrix, this.virtualMap.endPosition);

            var x = Number(monster.battleObjectId.split(':')[2]);

            var i = 0;
            while(i < this.monsterInMapList.length && this.monsterInMapList[i].battleObjectId[8] == "1"){
                i++;
            }

            while(i < this.monsterInMapList.length){
                if(Number(this.monsterInMapList[i].battleObjectId.split(':')[2]) < x){
                    i++;
                }
                else {
                    this.monsterInMapList.splice(i, 0, monster);
                    return;
                }
            }

            this.monsterInMapList.push(monster);
        }
    },

    setGesture:function(monsterId){
        for(var i = 0; i < this.monsterInMapList.length; i++){
            if(this.monsterInMapList[i].battleObjectId == monsterId) {
                var monsterBalloon = this.monsterInMapList[i];
            }
        }
        
        for(var i = 0; i < this.monsterInMapList.length; i++){
            var monster = this.monsterInMapList[i];
            if(monster != monsterBalloon){
                if (Helper.getDistance(monsterBalloon.getLogicPoint(), monster.getLogicPoint()) <= 2) {
                    monster.fx.setAnimation(0, 'fx_cover', false);
                }
            }
            else {
                monster.fx.setAnimation(0, 'fx_cover', false);
                monster.setScaleX(1.5*monster.getScaleX());
                monster.setScaleY(1.5*monster.getScaleY());
            }
            
        }
    },

    boom:function(){
        if(this.monsterBalloon){
            this.monsterBalloon.balloon.setVisible(false);

            gv.battleController.sendGesture(this.monsterBalloon.battleObjectId);

            for(var i = 0; i < this.monsterInMapList.length; i++){
                var monster = this.monsterInMapList[i];
                if(monster != this.monsterBalloon){
                    if (Helper.getDistance(this.monsterBalloon.getLogicPoint(), monster.getLogicPoint()) <= 2) {
                        monster.healing(0.1);
                    }
                }
                else {
                    monster.hp += Math.round(monster.hp*0.2*1000)/1000;
                    monster.healing(1);
                    monster.setScaleX(1.5*monster.getScaleX());
                    monster.setScaleY(1.5*monster.getScaleY());
                }
                
            }
        }
        
        this.unsetBalloonMonster();
    },

    unsetBalloonMonster:function(){
        this.monsterBalloon = null;
        gv.battleController.players[0].virtualMap.renderField.setNumber(0);
    },

    isEmptyPos:function (pos, radius, d){
        for(let i = 0; i < this.monsterInMapList.length; ++i){
            let monster = this.monsterInMapList[i];
            if(monster.isFlying == 0){
                let monsterPos = monster.curPos;
                if(pos.x - monsterPos.x <= 1 && pos.y - monsterPos.y <= 1){
                    if(Helper.getDistance(pos, monsterPos) + 0.0001 < (radius + monster.collisionRadius)){
                        // cc.log("NOT EMPTY: " + pos.x + " " + pos.y + " " + monsterPos.x + " " + monsterPos.y);
                        if(d != null){
                            if(d != monster.getRealDirection()){
                                continue;
                            }
                            else{
                                if(monster.checkPassingPoint(d, pos)){
                                    return false;
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                        return false;
                    }
                }
            }

        }
        return true;
    },
    getTotalStatTower: function (){
        let count =0;
        for(let i=0;i<this.towerInMapList.length;i++){
            count+=this.towerInMapList[i].curStat;
        }
        return count;
    },
    getOpponentPlayer: function (){
        if (this == gv.battleController.players[0]){
            return  gv.battleController.players[1];
        }
        else {
            return  gv.battleController.players[0];
        }
    }
});


Player.parse = function(packet){
    let player = new Player();
    //player.setInfo(packet.name, packet.avatar, packet.trophy);
    let cardList = Player.parseCardList(packet);
    player.setCardList(cardList);
    player.setMap(packet.map);
    return player;
};
Player.parseCardList = function (packet){
    let cardList = [];
    for(let i = 0; i < packet.cardList.length; ++i){
        let cardPacket = packet.cardList[i];
        let card = new Card(cardPacket.objectId, 1, 0);
        card.setBattleId(cardPacket.battleId);
        cardList.push(card);
    }
    return cardList;
}