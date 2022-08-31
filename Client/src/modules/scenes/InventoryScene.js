var InventoryLayer = BaseLayer.extend({
    ctor: function (context) {
      this._super(context, res.JSON_INVENTORY_LAYER);
      this.user = gv.mainController.user;
      this.initBattleCards();
      this.initCardCollection();
    },
    initBattleCards:function(){
        let colNum = GC.INVENTORY.BATTLE_CARDS.COL;
        let maxNum = GC.INVENTORY.BATTLE_CARDS.NUM;
        let battleArr = this.user.battleCards;
        let num = battleArr.length;
        let rowNum = num / colNum;
        let gap = GC.INVENTORY.BATTLE_CARDS.GAP;
        let width = GC.CARD.WIDTH;
        let height = GC.CARD.HEIGHT;
        this.battleCardList = new GridView(colNum, rowNum, cc.size(width, height), gap, true);
        this.battleCardsPanel.addChild(this.battleCardList);
        for(let i = 0; i < num; ++i){
            let cardNode = new CardUI(this, cc.size(GC.CARD.WIDTH, GC.CARD.HEIGHT), battleArr[i], "BATTLE");
            this.battleCardList.insertCell(cardNode);
        }
        this.battleCardList.setAnchorPoint(cc.p(0.5, 1));
        this.battleCardList.setPosition(cc.p(this.battleCardsPanel.width / 2, 6 * this.battleCardsPanel.height / 7));
    },
    initCardCollection:function(){
        let colNum = GC.INVENTORY.COLLECTION_CARDS.COL;
        //let maxNum = GC.INVENTORY.COLLECTION_CARDS.NUM;
        let collectionArr = this.user.collectionCards;
        let num = collectionArr.length;
        let rowNum = num / colNum;
        let gap = GC.INVENTORY.COLLECTION_CARDS.GAP;
        let width = GC.CARD.WIDTH;
        let height = GC.CARD.HEIGHT;
        this.cardCollectionList = new GridView(colNum, rowNum, cc.size(width, height), gap, true);
        this.cardCollectionPanel.addChild(this.cardCollectionList);
      for(let i = 0; i < num; ++i){
          let cardNode = new CardUI(this, cc.size(GC.CARD.WIDTH, GC.CARD.HEIGHT), collectionArr[i], "COLLECTION");
          this.cardCollectionList.insertCell(cardNode);
      }
      this.cardCollectionList.setAnchorPoint(cc.p(0.5, 1));
      var x = this.cardCollectionPanel.width / 2;
      var y = this.cardCollectionPanel.height - this.cardCollectionBanner.height - 10;
      this.cardCollectionList.setPosition(cc.p(x, y));
    },
    switchCards:function(sender){
      this.cardCollectionPanel.setVisible(false);
      this.selectCardPanel.setVisible(true);
      this.collectionCard = sender;
      let x = this.selectCardPanel.width / 2;
      let y = this.selectLabel.y + 10;
      let cardUI = new CardUI(this, sender.scaleSize, sender.card);
      this.selectCardPanel.addChild(cardUI);
      cardUI.progressBg.setVisible(false);
      cardUI.setAnchorPoint(cc.p(0.5, 0));
      cardUI.setPosition(cc.p(x, y));
      cardUI.setTouchEnabled(false);
      CardUI.touchType = "SWITCH_CARDS";
    },
    endSwitchCards:function(sender){
        this.battleCard = sender;
        let collectionIdx = this.collectionCard.indexI * GC.INVENTORY.COLLECTION_CARDS.COL + this.collectionCard.indexJ;
        let battleIdx = this.battleCard.indexI * GC.INVENTORY.BATTLE_CARDS.COL + this.battleCard.indexJ;
        gv.inventoryController.sendInventoryChangeCard(collectionIdx, battleIdx);
      /*this.cardCollectionPanel.setVisible(true);
      this.selectCardPanel.setVisible(false);
      let tmpCard = this.switchedCard.card;
      this.switchedCard.setInfo(sender.card);
      sender.setInfo(tmpCard);
      let collectionIdx = this.switchedCard.indexI * GC.INVENTORY.COLLECTION_CARDS.COL + this.switchedCard.indexJ;
      let battleIdx = sender.indexI * GC.INVENTORY.BATTLE_CARDS.COL + sender.indexJ;
      this.user.switchCards(battleIdx, collectionIdx);*/
      /*this.switchedCard.parent = null;
      sender.parent = null;
      let iSender = sender.indexI;
      let jSender = sender.indexJ;
      this.cardCollectionList.insertCellWithIdx(sender, this.switchedCard.indexI, this.switchedCard.indexJ);
      this.battleCardList.insertCellWithIdx(this.switchedCard, iSender, jSender);*/
      /*let battlePos = sender.getPosition();
      let collectionPos = this.switchedCard.getPosition();
      let globalBattlePos = sender.parent.convertToWorldSpace(battlePos);
      let globalCollectionPos = this.switchedCard.parent.convertToWorldSpace(collectionPos);
      let battleMove = cc.MoveTo.create(0.5, battlePos);
      let collectionMove = cc.MoveTo.create(0.5, collectionPos);
      
      this.switchedCard.parent = null;
      sender.parent = null;
      let layer = new cc.Layer();
      layer.setAnchorPoint(cc.p(0.5, 1));
      layer.addChild(this.switchedCard);
      layer.addChild(sender);
      this.switchedCard.setPosition(layer.convertToNodeSpace(globalCollectionPos));
      sender.setPosition(layer.convertToNodeSpace(globalBattlePos));
      //this.switchedCard.runAction(battleMove);
      //sender.runAction(collectionMove);
      //this.battleCardList.addChild(this.switchedCard);
      //this.cardCollectionList.addChild(sender);
      
      cc.log(globalBattlePos.x +" "+globalBattlePos.y);
      cc.log(globalCollectionPos.x +" "+globalCollectionPos.y);*/
    },
    changeCards:function(){
        this.cardCollectionPanel.setVisible(true);
        this.selectCardPanel.setVisible(false);
        let tmpCard = this.collectionCard.card;
        this.collectionCard.setInfo(this.battleCard.card);
        this.battleCard.setInfo(tmpCard);
    }
  });
  