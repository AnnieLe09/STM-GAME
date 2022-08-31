var CardUpgradeLayer = BaseLayer.extend({
    ctor: function (context, card) {
      this._super(context, res.JSON_CARD_UPGRADE_LAYER);
      this.initScale();
      this.upgradeLevel(card);
      this.setInfo(card);
      this.initBtns(card);
    },
    initScale:function(){
      this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
      this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
    },
    upgradeLevel:function(card){
      let nextLevel = Helper.getNextLevel(card.level);
      let user = gv.mainController.user;
      //card.exp = card.exp - nextLevel.fragments;
      //card.level++;
      //card.updateLevel(card.level, card.exp);
      user.updateGold(user.gold - nextLevel.gold);
    },
    setInfo:function(card){
      this.card = card;
      this.setCard(card);
      let object = card.object;
      this.nameText.string = object.name;
      let displayFields = object.displayFields;
      let num = displayFields.length;
      let col = 1;
      let row = Math.ceil(num / col);
      let width = (this.powerPanel.width - 10 * (col - 1)) / col;
      let height = (this.powerPanel.height - 10 * (row - 1)) / row;
      let powerView = new GridView(col, row, cc.size(width, height), 10, true);
     
      for(let i = 0; i < num; ++i){
        let field = Object.keys(displayFields[i])[0];
        let icon = GC.CARD_INFO.ICON_PATH + GC.CARD_INFO.ICON[field];
        let nameText = displayFields[i][field];
        let value = "" + object.stat["" + card.stat][field];
        let upgradeText = "";
        let cell = new CardInfoCell(this, cc.size(width, height), icon, nameText, value, upgradeText);
        powerView.insertCell(cell);
      }
      powerView.setAnchorPoint(cc.p(0, 0));
      powerView.setPosition(cc.p(0, 0));
      this.powerPanel.addChild(powerView);
      
    },
    setCard:function(card){
      this.cardNode = new CardUI(this, cc.size(this.cardPanel.width, this.cardPanel.height), card);
      this.cardPanel.addChild(this.cardNode);
      this.cardNode.setAnchorPoint(cc.p(0, 0));
      this.cardNode.setPosition(cc.p(0, 0));
      this.cardNode.setTouchEnabled(false);
    },
    initBtns:function(){
      this.btn.addTouchEventListener(function(sender, type){
          if(type == ccui.Widget.TOUCH_ENDED){
              this.card.unregisterCardLevel(this.cardNode);
              gv.mainController.onRunScene(gv.mainController.mainLayer);
          }
      }, this);
    }
  });
  