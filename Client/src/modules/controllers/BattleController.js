var BattleController = cc.Class.extend({
    ctor:function(){
        this.players = [];
        this.curTick = 0;
        this.curRound = -1;
        this.startRoundTick = 0;
        this.curCardIdx = 4;
        this.battleLayer = null;
    },
    startRound:function(){
        this.battleLayer.unscheduleUpdate();
        //this.curTick = tick;
        this.curRound++;
        this.battleLayer.setRoundString(this.curRound);
        // cc.log("Start Round: " + this.curRound + " at tick " + this.curTick);
        this.startRoundTick = this.curTick;
        this.curSystemMonsterNum = 1;
        if(this.curRound != 0){
            for(let i = 0; i < 2; ++i){
                this.players[i].startRound();
                //battleRecord.addStatus(new BattleStatus(this));
            }
        }
        this.releaseSystemMonster();
        //cc.log("Monster num: "+Math.max(this.players[0].systemMonsters.length, this.players[1].systemMonsters.length) + ", next release tick: " + this.getNextReleaseTick());
        let tick = this.curTick;
        this.battleLayer.scheduleUpdate();
        return tick;
    },
    updatePerTick:function (){
        if(this.checkEndMatch()){
            this.battleLayer.unscheduleUpdate();
            this.sendEndMatch();
            return;
        }
        this.curTick++;
        this.releaseTrappedMonsters();
         // so quai toi da can tha
        if(this.curTick == this.getNextStartRoundTick()){
            //this.startRound(this.curTick);
            this.startRound();
        }
        let releaseMonsterNum = Math.max(this.players[0].systemMonsters.length, this.players[1].systemMonsters.length);
        //cc.log("update tick now: " + this.curTick);
        if(releaseMonsterNum > 0 && (this.curTick == this.getNextReleaseTick())){
            this.releaseSystemMonster();
            this.curSystemMonsterNum++;
        }
        for(let i = 0; i < 2; ++i){
            // log("Player " + i + "...... TICK " + this.curTick);
            // for(var j = 0; j < this.players[i].monsterInMapList.length; j++){
            //     var  monster = this.players[i].monsterInMapList[j];
            //     var p = Helper.convertMapPixelToLogicPoint(cc.p(monster.posX, monster.posY), this.players[i].isMyMap)
            //     log(monster.battleObjectId + ", pos: " + p.x.toFixed(3) + ' ' + p.y.toFixed(3));
            //     // log(monster.battleObjectId + ", curHp: " + monster.currHp + ' Max Hp: ' + monster.hp);
            // }
            this.players[i].updatePerTick();
        }
    },
    setSystemMonsterTypes:function(types){ // 20x3 array
        this.systemMonsterTypes = types;
    },
    releaseSystemMonster:function (){
        for(let i = 0; i < 2; ++i){
            // cc.log("==========Release monster of player " + i + " at tick " + this.curTick +"start tick, next tick: " + this.startRoundTick + " " + this.getNextReleaseTick() +"===========");
            this.players[i].releaseSystemMonster();
        }
    },
    releaseTrappedMonsters:function (){
      for(let i = 0; i < 2; ++i) {
          if(this.curTick % 60 == 0){
              this.players[i].releaseTrappedMonster();
          }

      }
    },
    checkEndMatch:function (){
        for(let i = 0; i < 2; ++i){
            if(this.players[i].curHp <= 0){
                return true;
            }
        }
        if(this.curRound == GC.BATTLE.ROUND_NUM && this.curTick == this.getNextStartRoundTick() - 1){
            return true;
        }
        return false;
    },
    sendEndMatch:function (){
        cc.log("END MATCH TICK: " + this.curTick);
        testnetwork.connector.sendEndMatch(this.curTick);
    },
    onEndMatch:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS && this.battleLayer != null) {
            let players = [];
            for(let i = 0; i < 2; ++i){
                let player = {};
                player.hp = packet["hp" + i];
                player.name = this.players[i].name;
                player.avatar = this.players[i].avatar;
                this.battleLayer.setPlayerHp(i, player.hp);
                players.push(player);
            }
            this.battleLayer.unscheduleUpdate();
            this.battleLayer.release();
            let layer = null;
            if(players[0].hp > players[1].hp){
                layer = new EndMatchLayer(players, GC.BATTLE.RESULT_MSG.WIN);
            }
            else if(players[0].hp < players[1].hp){
                layer = new EndMatchLayer(players, GC.BATTLE.RESULT_MSG.LOSE);
            }
            else{
                layer = new EndMatchLayer(players, GC.BATTLE.RESULT_MSG.DRAW);
            }
            //this.onRunScene(layer);
            layer.setPosition(cc.p(0, 0));
            this.battleLayer.addChild(layer, 1003);
            gv.battleController = new BattleController();
        }
        else{
            if(error == GC.ERROR.ERROR){
                this.setBattleStatus(packet.status);
                this.battleLayer.scheduleUpdate();

            }
        }
    },
    sendStartRound:function (tick){
        testnetwork.connector.sendStartRound(tick);
    },
    onStartRound:function (packet){

    },
    onStartOpponentRound:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            // cc.log("BattleController onStartOpponentRound");
            this.battleLayer.unscheduleUpdate();
            let nextTick = this.curTick;
            this.setBattleStatus(packet.status); // Phai set status truoc khi start round ho tui nheeee!!!!
            this.startRound();
            this.updateToTick(this.curTick, nextTick);
            this.battleLayer.scheduleUpdate();

        }
    },
    checkCardInHand: function(cards,card){
        var flag = false;
        for(let i=0;i < Math.min(cards.length,GC.BATTLE.CARD_IN_HAND);i++){
            if (cards[i].id == card.id){
                flag = true;
            }
        }
        return flag;
    },
    popCardById:function (playerIdx, id){
        let cardList = this.players[playerIdx].cardList;
        var amountCardInHand = Math.min(GC.BATTLE.CARD_IN_HAND,cardList.length - 1);
        // cc.log("pop card "+id);
        for(let i = 0;i < amountCardInHand; i++){
            let card = cardList[i];
            if(card.battleId == id){
                // for(let i=0;i<10;i++){
                //     cc.log(this.players[1].cardList[i].battleId);
                // }
                Helper.removeFromArray(cardList, card);
                // for(let i=0;i<10;i++){
                //     cc.log(this.players[1].cardList[i].battleId);
                // }
                if (amountCardInHand > 1 && this.checkCardInHand(cardList,cardList[amountCardInHand])){
                    var index = amountCardInHand + 1;
                    while (index < cardList.length && this.checkCardInHand(cardList,cardList[index])){
                        index += 1;
                    }
                    if (index < cardList.length){
                        var tmp = cardList[amountCardInHand];
                        cardList[amountCardInHand] = cardList[index];
                        cardList[index] = tmp;
                    }
                }
                // for(let i=0;i<10;i++){
                //     cc.log(this.players[1].cardList[i].battleId);
                // }
                return card;
            }
            //cc.log("======= card id: " + card.battleId);
        }
        /*
        for(let i = 0; i < cardList.length; ++i){
            let card = cardList[i];
            if(card.battleId == id){
                Helper.removeFromArray(cardList, card);
                return card;
            }
        }

         */
        return null;
    }, 
    getNextCard:function(playerIdx = 0){
        return  this.players[playerIdx].cardList[GC.BATTLE.CARD_IN_HAND];

        /*
        this.curCardIdx++;
        let card = this.players[0].cardList[this.curCardIdx];
        while(this.isProperCard(card) == false){
            //todo
        }
        return card;

         */
    },

    getTypeMonsterNextRound:function(){
        if(this.curRound < 0 || this.curRound >= 20) return null;
        return this.systemMonsterTypes[this.curRound];
    },

    getNextStartRoundTick:function (){
        return this.startRoundTick + GC.BATTLE.TICK_PER_SECOND * GC.BATTLE.SECOND_PER_ROUND;
    },
    getNextReleaseTick:function (){
      return this.startRoundTick + this.curSystemMonsterNum * GC.BATTLE.TICK_PER_MONSTER;
    },
    sendFindMatch: function (){
        testnetwork.connector.sendFindMatch();
    },
    sendCancelFindMatch:function (){
        testnetwork.connector.sendCancelFindMatch();
    },
    onFindMatch:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            for(let i = 0; i < 2; ++i){
                this.players.push(Player.parse(packet.players[i]));
                this.players[i].setBattleController(this);
            }
            this.players[0].setIsMyMap(true);
            this.players[1].setIsMyMap(false);
            let user = gv.mainController.user;
            this.players[0].setInfo(user.name, user.avatar, user.trophy);
            this.players[1].setInfo(packet.name, packet.avatar, packet.trophy);
            this.setSystemMonsterTypes(packet.systemMonsterTypes);
            //fr.view(BattleScene);
            this.battleLayer = new BattleScene();
            this.battleLayer.setName("BattleLayer");
            this.battleLayer.retain();
            this.onRunScene(this.battleLayer);
            this.startRound();
            this.curTick = -1;
        }
        else{
            packet = packet.status;
            for(let i = 0; i < 2; ++i){
                let player = packet.players[i];
                this.players.push(Player.parse(player));
                this.players[i].setBattleController(this);
                this.players[i].setInfo(player.name, player.avatar, player.trophy);
            }
            this.players[0].setIsMyMap(true);
            this.players[1].setIsMyMap(false);

            this.setSystemMonsterTypes(packet.systemMonsterTypes);
            this.setBattleStatus(packet);
            //fr.view(BattleScene);
            this.battleLayer = new BattleScene();
            this.battleLayer.setName("BattleLayer");
            this.battleLayer.retain();
            this.onRunScene(this.battleLayer);
        }
    },
    onCancelFindMatch:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            gv.mainController.onRunScene(gv.mainController.mainLayer);
        }
    },
    sendPlaceSpell:function(cardId, i, j){
        testnetwork.connector.sendPlaceSpell(this.curTick, cardId, i, j);
    },
    onPlaceSpell:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.updateBattleStatus(packet);
        }
    },
    addSpell:function (spell, playerIdx){
        if(this.decreaseEnergy(0, spell.energy)){
            this.players[playerIdx].spellInMapList.push(spell);
            return true;
        }
        return false;
    },
    onPlaceOpponentSpell:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            // cc.log("BattleController onPlaceOpponentSpell: " + packet.battleId);
            // cc.log("Current tick = " + this.curTick);
            /*let card = this.popCardById(1, packet.battleId);
            let spell = card.object;
            spell.curPos = cc.p(packet.i, packet.j);
            let isMyMap = spell.map;
            this.players[1 - isMyMap].spellInMapList.push(spell);
            this.battleLayer.unscheduleUpdate();
            let pos = Helper.convertLogicPointToMapPixel(cc.p(packet.i, packet.j), isMyMap);
            this.battleLayer.addSpell(spell, pos, isMyMap);*/
            this.updateBattleStatus(packet);
        }
    },
    updateBattleStatus:function (packet){
        this.battleLayer.unscheduleUpdate();
        let nextTick = this.curTick;
        this.setBattleStatus(packet.status);
        this.updateToTick(this.curTick, nextTick);
        this.battleLayer.scheduleUpdate();
    },
    updateToTick:function (curTick, nextTick){
        for(let i = curTick + 1; i <= nextTick; ++i){
            this.updatePerTick();
        }
    },
    sendPlaceTower:function(tick, cardId, i, j){
        testnetwork.connector.sendPlaceTower(tick, cardId, i, j);
    },
    onPlaceTower:function(packet){
        //TODO something
        let error = packet.getError();
        cc.log("BattleController: "+error);
        if(error == GC.ERROR.SUCCESS || error == GC.ERROR.ERROR) {
            this.updateBattleStatus(packet);
        }
    },
    onPlaceOpponentTower:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            // cc.log("BattleController onPlaceOpponentTower: " + packet.battleId);
            /*
            let card = this.popCardById(1, packet.battleId);
            var tower = TowerFactory.create(card.object.type);
            var map = gv.battleController.players[1].virtualMap;
            var cellPoint = Helper.convertLogicCellToMapCell(cc.p(packet.i,packet.j),false);
            var cell = map.cellMatrix[cellPoint.x][cellPoint.y];
            Tower.addTower(packet.battleId,tower,map,cell,this.curTick,this.curTick + GC.TOWER.TICK_ACTIVE,card);
            this.decreaseEnergy(1,tower.energy)

             */


            this.updateBattleStatus(packet);
        }
    },
    sendDropTower:function(tick, i, j){
        testnetwork.connector.sendDropTower(tick, i, j);
    },
    onDropTower:function(packet){
        //TODO something
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS || error == GC.ERROR.ERROR) {
            this.updateBattleStatus(packet);
        }
    },
    onDropOpponentTower:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            // cc.log("BattleController onDropOpponentTower: " + "(" +packet.i+ "," + packet.j + ")");
            var map = gv.battleController.players[1].virtualMap;
            var cellPoint = Helper.convertLogicCellToMapCell(cc.p(packet.i,packet.j),false);
            var cell = map.cellMatrix[cellPoint.x][cellPoint.y];
            var tower = cell.obstacle;
            if (tower != null){
                tower.dropInMap(true);
            }
            this.updateBattleStatus(packet);
        }
    },
    sendUpgradeTower:function(tick, cardId, i, j){
        testnetwork.connector.sendUpgradeTower(tick, cardId, i, j);
    },
    onUpgradeTower:function(packet){
        //TODO something
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS || error == GC.ERROR.ERROR) {
            this.updateBattleStatus(packet);
        }
    },
    onUpgradeOpponentTower:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            // cc.log("BattleController onUpgradeOpponentTower: " + packet.battleId);
            let card = this.popCardById(1, packet.battleId);
            var tower = TowerFactory.create(card.object.type);
            var map = gv.battleController.players[1].virtualMap;
            var cellPoint = Helper.convertLogicCellToMapCell(cc.p(packet.i,packet.j),false);
            var cell = map.cellMatrix[cellPoint.x][cellPoint.y];
            Tower.addTower(packet.battleId,tower,map,cell,this.curTick,this.curTick + GC.TOWER.TICK_ACTIVE,card);
            this.updateBattleStatus(packet);
        }
    },

    // Place monster
    sendPlaceMonster:function(battleId){
        testnetwork.connector.sendPlaceMonster(this.curTick, battleId);
    },
    onPlaceMonster:function(packet){
        // Do something
    },
    
    onPlaceOpponentMonster:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            let card = this.popCardById(1, packet.battleId);
            this.updateBattleStatus(packet);
        }
    },

    // Gesture
    sendGesture:function(monsterId){
        testnetwork.connector.sendGesture(this.curTick, monsterId);
    },

    onReceiveGesture:function(packet){
        // Do something
    },

    onReceiveOpponentGesture:function(packet) {
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.updateBattleStatus(packet);
            this.players[0].setGesture(packet.battleId);
        }
    },

    onRunScene: function(layer, transitionTime){
        var scene = new cc.Scene();
        scene.addChild(layer);
        if(!transitionTime)
        {
            transitionTime = 1.2;
        }
        cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
    },

    setBattleStatus:function (packet){
        this.curTick = packet.tick;

        this.curRound = packet.round;
        this.battleLayer.setRoundString(this.curRound);

        this.startRoundTick = packet.startRoundTick;
        this.curSystemMonsterNum = packet.curSystemMonsterNum;
        this.systemMonsterTypes = packet.systemMonsterTypes;

        for(let i = 0; i < 2; ++i){
            let player = this.players[i];
            let cardList = Player.parseCardList(packet.players[i]);
            player.setCardList(cardList);
            player.setMap(packet.players[i].map);
            player.setCurHp(packet.players[i].curHp);
            player.setCurEnergy(packet.players[i].curEnergy);
            //SystemMonsterId and PlaceMonsterId
            player.generatedSystemMonsterId = packet.players[i].systemMonsterId;
            player.generatedPlacedMonsterId = packet.players[i].placeMonsterId;
            // set system monster - todo-Phong
            player.recreateSystemMonster(packet.players[i].systemMonsters);
            // set place monster - todo-Phong
            player.recreatePlaceMonster(packet.players[i].placeMonsters);
            // parse buffs todo-Hanh
            player.setBuffInMapList(packet.players[i].buffInMapList);
            // parse monsters todo-Phong
            player.setMonsterInMapList(packet.players[i].monsterInMapList);
            // parse spells todo-LA
            player.setSpellInMapList(packet.players[i].spellInMapList);
            // parse towers todo-Hanh
            player.setTowerInMapList(packet.players[i].towerInMapList);
            // parse bullets todo-Hanh
            player.setBulletInMapList(packet.players[i].bulletInMapList);
            // parse cells todo-Hanh
            player.setCellInMapList(packet.players[i].cellInMapList);
            // player.setMonsterInMapList(packet.players[i].monsterInMapList);

            // Tìm đường lại
            
            player.setTrappedMonsters(packet.players[i].trappedMonsters);
            /*
            //Add double By HanhND2
            player.setTowerInMapList(packet.players[i].towerInMapList);
            // parse bullets todo-Hanh
            player.setBulletInMapList(packet.players[i].bulletInMapList);
            // parse bullets todo-Hanh

             */

        }
    },

    decreaseEnergy:function (playerIdx, delta){
        if(this.players[playerIdx].curEnergy - delta >= 0){
            this.players[playerIdx].curEnergy -= delta;
            if (playerIdx == 0){
                gv.battleController.battleLayer.setEnerny(this.players[playerIdx].curEnergy);
            }
            return true;
        }
        return false;
    },

    canStartRound:function (){
        for(let i = 0; i < 2; ++i){
            if(this.players[i].systemMonsters.length > 0) return false;
        }
        if(this.players[0].monsterInMapList.length > 0 && this.players[1].monsterInMapList.length > 0) return false;
        return true;
    },
    onReceiveBattleReward:function(packet) {
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            //Todo something
            let user = gv.mainController.user;
            user.updateTrophy(packet.trophy);
            if (packet.isHaveChest){
                let chest = Chest.parse(packet.chest);
                user.chests.push(chest);
                Helper.getLayer("lobby").setChests(user);
            }
        }
    },
    sendStartBattle:function(){
        testnetwork.connector.sendStartBattle();
    },
});