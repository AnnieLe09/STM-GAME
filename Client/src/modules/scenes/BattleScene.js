// var MainScene = ccs.load(res.ui_battle_scene_json).node;

var BattleScene = cc.Layer.extend({
    battleUI: null,
    enemyMap: null,
    myMap: null,
    amountOfCard: 4,

    ctor: function () {
        this._super();
        //Game Speed
        this.vituralTick = 0;
        this.gameSpeedSlow = 1;
        // Load battle scene
        this.battleUI = ccs.load(res.ui_battle_scene_json).node;
        this.setScale(this.width / this.battleUI.width, this.height / this.battleUI.height);

        this.battleUI.setAnchorPoint(cc.p(0.5, 0.5));
        this.battleUI.setNormalizedPosition(0.5, 0.5);

        this.cacheSpriteFrame();
        // Set attribute for child of battle scene
        // this.battleUI.getChildByName("enemy_house").zIndex = 100;
        // this.battleUI.getChildByName("my_house").zIndex = 100;

        // this.battleUI.getChildByName("enemy_monster_gate").zIndex = 100;
        // this.battleUI.getChildByName("my_monster_gate").zIndex = 100;

        // this.battleUI.getChildByName("my_card_deck").zIndex = 100;


        var spineRiverFlow = new sp.SkeletonAnimation(res.river_spine_json, res.river_spine_atlas);
        spineRiverFlow.setAnimation(0, 'animation', true);
        // spineRiverFlow.setAnchorPoint(0, 0);
        spineRiverFlow.setNormalizedPosition(-0.87, 0.17);
        var riverSource = this.battleUI.getChildByName("map_river_source");
        riverSource.addChild(spineRiverFlow);


        this.enemyMap = new Map(false);
        this.myMap = new Map(true);


        // this.enemyMap.setBuffCells(0);
        // if(this.checkEqualListBuff()){
        //     this.myMap.setBuffCells(1);
        // }
        // else{
        //     this.myMap.setBuffCells(0);
        // }

        this.myMapUI = this.battleUI.getChildByName("pnl_my_map");
        this.enemyMapUI = this.battleUI.getChildByName("pnl_enemy_map");
        this.enemyMapUI.addChild(this.enemyMap);
        this.myMapUI.addChild(this.myMap);

        this.enemyCicle = new sp.SkeletonAnimation(res.enemy_cicle_spine_json, res.enemy_cicle_spine_atlas);
        this.enemyMapUI.addChild(this.enemyCicle);
        this.enemyCicle.setNormalizedPosition(0.5,0.5);
        this.enemyCicle.setAnimation(0, 'field_green', true);
        this.enemyCicle.setVisible(false);

        // if ('mouse' in cc.sys.capabilities) {
        //     cc.eventManager.addListener({
        //         event: cc.EventListener.MOUSE,
        //         onMouseDown: function (event) {
        //             var pos = event.getLocation(), target = event.getCurrentTarget();
        //             if (event.getButton() === cc.EventMouse.BUTTON_LEFT)
        //                 target.getTouchedCell(pos);
        //             // cc.log("onRightMouseDown at: " + pos.x + " " + pos.y )
        //         },
        //     }, this);
        // } else {
        //     cc.log("MOUSE Not supported");
        // }


        cc.log("Hello JavaScript 1");


        this.addChild(this.battleUI);
        cc.log("Hello JavaScript 2");
        this.initCardDeck();
        cc.log("Hello JavaScript 3");
        // var path = Helper.getCurvePoint(Helper.bfsShortedPath(this.myMap.startPosition, this.myMap.endPosition, this.myMap.cellMatrix));
        // for(var i = 0; i < path.length; i++){
        //     var a = new Monster(0);
        //     a.setNormalizedPosition(0.5,0.5);
        //     path[i].addChild(a);
        // }
        // this.initMonsterPosition();

        this.timerSprite = new cc.ProgressTimer(new cc.Sprite(res.timer_sprite));
        this.timerSprite.setNormalizedPosition(0.5,0.5);
        this.timerSprite.type = cc.ProgressTimer.TYPE_RADIAL;
        // timerSprite.runAction(cc.progressFromTo(20, 0, 100).repeatForever());
        this.battleUI.getChildByName("battle_timer_background").addChild(this.timerSprite);
        this.isSetTimer = false;
        this.setTimer();

        // set nextcard
        this.nextCardPanel = this.battleUI.getChildByName("my_card_deck").getChildByName("next_card");
        this.setEnerny(gv.battleController.players[0].curEnergy);
        this.setNextCard();
        this.scheduleUpdate();

            // var renderField = new RenderTextureLayer();
            // // renderField.setNormalizedPosition(-10, -10);
            // this.addChild(renderField);

        /*
        this.callGame = this.schedule(function() {
            // Here this refers to component
            this.update(1.0/60);
        }, 1.0/60);

         */
        //setInterval(this.update(1.0/60), 1000.0/60);
        this.winSize = cc.director.getWinSize();
        this.toast = new Toast();
        this.toast.setPosition(cc.p(this.winSize.width / 2, 50));
        this.addChild(this.toast,10000);


        this.slot = [];
        this.nextBox = this.battleUI.getChildByName("next_box");
        this.nextBoxArrow = this.battleUI.getChildByName("next_box_arrow");
        this.listPoint = [cc.p(0.23,0.33), cc.p(0.52,0.33), cc.p(0.81,0.33)];

        this.nextCounter = 0;

        this.nextBox.addTouchEventListener(function(sender, type){
            if(type==ccui.Widget.TOUCH_ENDED){
                this.hideNextMonster();
            }
        }, this);

        this.nextBoxArrow.addTouchEventListener(function(sender, type){
            if(type==ccui.Widget.TOUCH_ENDED){
                if(this.nextCounter == 0) {
                    this.showNextMonster();
                }
            }
        }, this);

    },

    updateShowNextMonster:function(){
        if(this.nextCounter > 0) {
            this.nextCounter--;
            if(this.nextCounter == 0) {
                this.hideNextMonster();
            }
        }
        else {
            if (gv.battleController.curTick - gv.battleController.startRoundTick == 1080) {
                this.showNextMonster();
            }    
        }
    },

    showNextMonster:function(){
        var types = gv.battleController.getTypeMonsterNextRound();

        if(!types) return;

        this.nextCounter = 120;

        this.nextBoxArrow.setVisible(false);
        this.nextBox.setVisible(true);

        for (var i = 0; i < this.slot.length; i++){
            this.nextBox.removeChild(this.slot[i]);
        }

        this.slot = [];

        for(var i = 0; i < types.length; i++){
            if(types[i] >= 0){
                var monsterSprite = new cc.Sprite(res.NEXT_AVT[types[i]]);
                monsterSprite.setScale(0.18, 0.18);
                monsterSprite.setNormalizedPosition(this.listPoint[i]);
                this.nextBox.addChild(monsterSprite);
                this.slot.push(monsterSprite);
            }
        }
        
    },

    hideNextMonster:function(){
        this.nextCounter = 0;
        this.nextBox.setVisible(false);
        this.nextBoxArrow.setVisible(true);
    },
    
    setRoundString:function(round){
        this.battleUI.getChildByName("txt_time").setString(round.toString() + "/20");
    },

    setTimeString:function(tick){
        this.timerSprite.setPercentage(tick/12);
    },

    update:function (dt){

        this.vituralTick +=1;
        if (this.vituralTick < this.gameSpeedSlow){
            return;
        }
        this.vituralTick = 0;
        if (this.gameSpeedSlow < 0){
            for(let i = 0; i < this.gameSpeedSlow*(-1) - 1;i++){
                gv.battleController.updatePerTick();
            }
        }

        gv.battleController.updatePerTick();

        this.updateShowNextMonster();
        this.setTimeString(gv.battleController.curTick - gv.battleController.startRoundTick);
    },
    cacheSpriteFrame: function () {
        for (var i = 0; i <= 12; i++) {
            cc.spriteFrameCache.addSpriteFrames(resFrame.MONSTER_SPRITE[i].PLIST, resFrame.MONSTER_SPRITE[i].PNG);
        }
    },

    checkEqualListBuff: function () {
        var myListBuff = this.myMap.listBuff;
        var enemyListBuff = this.enemyMap.listBuff;
        for (var i = 0; i < myListBuff.length; i++) {
            if (!Helper.equalPoint(myListBuff[i], enemyListBuff[i])) return false;
        }
        return true;
    },

    initCardDeck: function () {
        this.spells = [];
        this.towerIdx = 0;
        this.cardDeck = this.battleUI.getChildByName("my_card_deck");
        let height = 8 * this.cardDeck.height / 10;
        let width = GC.CARD.WIDTH * height / GC.CARD.HEIGHT;
        this.cardList = new GridView(4, 1, cc.size(width, height), 5, true);
        this.cardDeck.addChild(this.cardList);
        for (let i = 0; i < this.amountOfCard; ++i) {
            //let cardNode = new CardUI(this, cc.size(width, height), new Card((i + 16) % 18, 1, 12));
            let card = gv.battleController.players[0].cardList[i];
            let cardNode = new CardUI(this, cc.size(width, height), card);
            cardNode.progressBg.setVisible(false);
            cardNode.addTouchEventListener(this.dragCard, this);

            var numMonster = gv.battleController.players[0].getNumPlaceMonster();            
            if(card.type == "MONSTER"){
                cardNode.numMonster.setVisible(true);
                cardNode.numMonster.setString("x" + numMonster);
                cardNode.energyText.setString(numMonster);
            }

            this.cardList.insertCell(cardNode);
        }
        this.cardList.setAnchorPoint(cc.p(0.5, 0.5));
        this.cardList.setPosition(cc.p(this.cardDeck.width / 2, this.cardDeck.height / 2));

        // this.updateMonsterNum();
    },

    dragCard: function (sender, type){
      if(type == ccui.Widget.TOUCH_BEGAN){
          let cardAction = cc.MoveBy.create(0.1, cc.p(0, 50)).easing(cc.easeBackOut(0.5));
          sender.runAction(cardAction);
      }
      this.dragObject(sender, type);
      if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
          sender.y -= 50
      }
    },
    dragObject:function (sender, type){
        switch (sender.card.type) {
            case "TOWER":
                this.dragTower(sender, type);
                break;
            case "SPELL":
                this.dragSpell(sender, type);
                break;
            case "MONSTER":
                this.dragMonster(sender, type);
                break;
        }
    },
    dragTower: function (sender, type) {
        let card = sender.card;
        let object = card.object;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.towerUI = new TowerUI(object);
                this.addChild(this.towerUI);
                this.towerUI.setScale(10 * this.myMap.getCellSize() / 10 / this.towerUI.width);
                this.towerUI.setPosition(this.convertToNodeSpace(sender.getTouchBeganPosition()));

                this.rangeUI = new RangeUI(2 * this.myMap.getCellSize() * 2);
                this.rangeUI.setPosition(this.convertToNodeSpace(sender.getTouchBeganPosition()));
                this.addChild(this.rangeUI);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.towerUI.setPosition(this.convertToNodeSpace(sender.getTouchMovePosition()));
                this.rangeUI.setPosition(this.convertToNodeSpace(sender.getTouchMovePosition()));
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.towerUI.removeFromParent();
                this.rangeUI.removeFromParent();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                let cell = this.getTouchedCell(this.convertToWorldSpace(this.towerUI.getPosition()));
                if (cell) {
                    var realTower = TowerFactory.create(this.towerUI.tower.type);
                    this.towerUI.setVisible(false);

                    let playerIdx = 0;

                    if (gv.battleController.decreaseEnergy(playerIdx,realTower.energy)){
                        if (Tower.addTower(card.battleId,realTower,this.myMap,cell,gv.battleController.curTick,
                                gv.battleController.curTick + GC.TOWER.TICK_ACTIVE,card)){
                            this.moveCards(sender);
                        }
                        else {
                            this.toast.setString("Không thể đặt tháp ở ô này!");
                            this.toast.display(1);
                            gv.battleController.decreaseEnergy(playerIdx,realTower.energy * (-1));
                            this.myMap.dropTower(cell,Tower);
                        }
                    }
                    else {
                        this.toast.setString("Không đủ năng lượng đặt tháp");
                        this.toast.display(1);
                    }


                    this.removeChild(this.towerUI);
                    this.rangeUI.removeFromParent();
                } else {
                    this.towerUI.removeFromParent();
                    this.rangeUI.removeFromParent();
                }
                break;
        }
    },
    dragSpell: function (sender, type) {
        let card = sender.card;
        let spell = card.object;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.dragedSpell = spell;
                this.rangeUI = new RangeUI(spell.range * this.myMap.getCellSize() * 2);
                this.rangeUI.setPosition(this.convertToNodeSpace(sender.getTouchBeganPosition()));
                this.addChild(this.rangeUI);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.rangeUI.setPosition(this.convertToNodeSpace(sender.getTouchMovePosition()));
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.rangeUI.removeFromParent();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                let spellMap = this.dragedSpell.map;
                let cell = this.getCellByPosition(this.convertToWorldSpace(this.rangeUI.getPosition()), spellMap);
                if (cell && gv.battleController.addSpell(this.dragedSpell, this.dragedSpell.map)) {
                    this.moveCards(sender);
                    let isMyMap = 1 - spellMap;
                    let posInMap = cell.posInMap;
                    let pos = Helper.convertPoint2Pixel(posInMap, isMyMap);
                    cc.log("PosInMap: " + posInMap.x + " " + posInMap.y);
                    this.addSpell(this.dragedSpell, pos, isMyMap);
                    this.dragedSpell.curPos = Helper.convertMapPixelToLogicPoint(pos, isMyMap);
                    cc.log("CurPos: " + this.dragedSpell.curPos.x + " " + this.dragedSpell.curPos.y);
                    gv.battleController.sendPlaceSpell(card.battleId, this.dragedSpell.curPos.x, this.dragedSpell.curPos.y); //test
                }
                this.rangeUI.removeFromParent();
                break;
        }
    },
    getCellByPosition:function (pos, map){
        if(map == 0){
            return this.getTouchedCell(pos);
        }
        return this.getTouchedEnemyCell(pos);
    },
    dragMonster: function (sender, type) {
        let card = sender.card;
        let object = card.object;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.enemyCicle.setVisible(true);
                this.monsterUI = new MonsterUI(object);
                this.addChild(this.monsterUI);
                this.monsterUI.setScale(10 * this.myMap.getCellSize() / 10 / this.monsterUI.width);
                this.monsterUI.setPosition(this.convertToNodeSpace(sender.getTouchBeganPosition()));
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.monsterUI.setPosition(this.convertToNodeSpace(sender.getTouchMovePosition()));
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.enemyCicle.setVisible(false);
                this.monsterUI.removeFromParent();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.enemyCicle.setVisible(false);
                if (this.getInEnemyMap(this.convertToWorldSpace(this.monsterUI.getPosition()))){
                    gv.battleController.sendPlaceMonster(object.battleId);
                    gv.battleController.players[1].createPlaceMonster(object.type);
                    this.moveCards(sender);
                }
                this.monsterUI.removeFromParent();
                break;
        }
    },

    
    addSpell: function (spell, pos, isMyMap) {
        let spellUI = new SpellUI(spell);
        //spellUI.setPosition(cell.getPosition());
        spellUI.setCustomScale(this.myMap.getCellSize() * this.myMap.scale);
        this.spells.push(spellUI);
        if (isMyMap) {
            //pos = Helper.convertPoint2Pixel(this.myMap.getTouchedCell(pos).posInMap, true);
            cc.log("add spell pos: "+pos.x + " "+pos.y);
            this.myMap.addChild(spellUI, 1000);
        } else {
            //pos = Helper.convertPoint2Pixel(this.enemyMap.getTouchedCell(pos).posInMap, false);
            this.enemyMap.addChild(spellUI, 1000);
        }
        spellUI.setPosition(pos);
        spell.setUI(spellUI);
        //this.dragedSpell.curPos = Helper.convertMapPixelToLogicPoint(cell.getPosition(), true);
    },
    removeSpell: function (i) {
        let spell = this.spells[i];
        Helper.removeFromArray(this.spells, spell);
        spell.removeFromParent();

    },
    showDropCardFont: function (sender, type){
        this.dropCard(sender);
    },
    dropCard: function (sender){
        this.moveCards(sender);
    },
    moveCards: function (sender) {
        sender.y -= 50;
        sender.setVisible(false);
        let prevPos = sender.getPosition();
        let lastPos = this.cardList.getCellPosition(0, 3);
        for (let i = sender.indexJ + 1; i < 4; ++i) {
            let action = cc.MoveTo.create(0.2, prevPos);
            let card = this.cardList._cells[0][i];
            prevPos = card.getPosition();
            card.indexJ = i - 1;
            this.cardList._cells[0][i - 1] = card;
            card.runAction(action);
        }
        sender.indexJ = 3;
        sender.setPosition(lastPos);
        this.cardList._cells[0][3] = sender;


        gv.battleController.popCardById(0, sender.card.battleId);
        this.nextCard.setInfo(gv.battleController.getNextCard());
        this.cardDeck.removeChild(this.cardList);
        this.initCardDeck();

        /*
        this.scheduleOnce(function() {
            sender.setVisible(true);
        }, 0.2);

         */

    },
    setNextCard:function (){
        let height = this.nextCardPanel.height * 8 / 10;
        let width = GC.CARD.WIDTH * height / GC.CARD.HEIGHT;
        this.nextCard = new CardUI(this, cc.size(width, height), gv.battleController.getNextCard());
        this.nextCard.setPosition(cc.p(this.nextCardPanel.width / 2, this.nextCardPanel.height / 2 - 20));
        this.nextCard.progressBg.setVisible(false);
        this.nextCardPanel.addChild(this.nextCard);
    },
    getTouchedCell: function (pos) {
        var startX = (this.myMapUI.x - this.myMapUI.width / 2) * this.getScaleX();
        var startY = (this.myMapUI.y - this.myMapUI.height / 2) * this.getScaleY();

        var x = Math.floor((pos.x - startX) / (GC.MAP.CELL.P_WIDTH * this.getScaleX()));
        var y = Math.floor((pos.y - startY) / (GC.MAP.CELL.P_HEIGHT * this.getScaleY()));

        if (x >= 0 && x < GC.MAP.WIDTH && y >= 0 && y < GC.MAP.HEIGHT) {
            var cell = this.myMap.cellMatrix[x][y];
            return cell;
        }
    },

    getTouchedEnemyCell:function(pos){
        var startX = (this.enemyMapUI.x - this.myMapUI.width / 2) * this.getScaleX();
        var startY = (this.enemyMapUI.y - this.myMapUI.height / 2) * this.getScaleY();

        var x = GC.MAP.WIDTH - 2 - Math.floor((pos.x - startX) / (GC.MAP.CELL.P_WIDTH * this.getScaleX()));
        var y = GC.MAP.HEIGHT - 2 - Math.floor((pos.y - startY) / (GC.MAP.CELL.P_HEIGHT * this.getScaleY()));

        if (x >= 0 && x < GC.MAP.WIDTH && y >= 0 && y < GC.MAP.HEIGHT) {
            var cell = this.enemyMap.cellMatrix[x][y];
            return cell;
        }
    },

    getInEnemyMap: function(pos) {
        var startX = (this.enemyMapUI.x - this.myMapUI.width / 2) * this.getScaleX();
        var startY = (this.enemyMapUI.y - this.myMapUI.height / 2) * this.getScaleY();

        var endX = startX + GC.MAP.CELL.P_WIDTH * this.getScaleX() * (GC.MAP.WIDTH - 1);
        var endY = startY + GC.MAP.CELL.P_WIDTH * this.getScaleX() * (GC.MAP.HEIGHT - 1);

        if(pos.x >= startX && pos.x <= endX && pos.y >= startY && pos.y <= endY){
            return true;
        }
        
        return false;
    },

    setPlayerHp:function(playerIdx, score){ // playerIdx 0 is my, 1 is enemy
        if (playerIdx == 0){
            this.battleUI.getChildByName("txt_my_score").setString(score);
        }
        else {
            this.battleUI.getChildByName("txt_enemy_score").setString(score);
        }

    },

    setEnerny:function(energy){
        this.battleUI.getChildByName("my_card_deck").getChildByName("energy_panel").getChildByName("energy_text").setString(energy);
    },

    setTimer: function () {
        let timer = this.battleUI.getChildByName("battle_timer_background");
        this.isSetTimer = true;
    }
});