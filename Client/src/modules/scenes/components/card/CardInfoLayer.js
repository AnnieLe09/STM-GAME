var CardInfoLayer = BaseLayer.extend({
    ctor: function(sender, card, category) {
      this._super(gv.mainController.mainLayer, res.JSON_CARD_INFO_LAYER);
      this.initScale();
      this.sender = sender;
      this.category = category;
      this.curStat = 1;
      this.initToast();
      card.registerCardLevel(this);
      this.setInfo(card, this.curStat);
      this.setCard(card);
      this.initBtns(card);
      this.setNoStat(card);
      this.setCheats();
    },
    initToast:function (){
        this.toast = new Toast();
        this.toast.setPosition(cc.p(this.winSize.width / 2, 50));
        this.addChild(this.toast);
    },
    initScale:function(){
      this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
      this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
    },
    setInfo:function(card, stat){
      this.card = card;
      let object = card.object;
      this.nameText.string = object.name;
      this.evolutionText.string = "Tiến hóa " + stat;
      let displayFields = object.displayFields;
      let num = displayFields.length;
      let col = 2;
      let row = 2;
      let width = (this.powerPanel.width - 10 * (col - 1)) / col;
      let height = (this.powerPanel.height - 10 * (row - 1)) / row;
      let powerView = new GridView(col, row, cc.size(width, height), 10, true);
     
      for(let i = 0; i < num; ++i){
        let field = Object.keys(displayFields[i])[0];
        let icon = GC.CARD_INFO.ICON_PATH + GC.CARD_INFO.ICON[field];
        let nameText = displayFields[i][field];
        let value = "" + object.stat["" + stat][field];
        let upgradeText = "";
        let cell = new CardInfoCell(this, cc.size(width, height), icon, nameText, value, upgradeText);
        powerView.insertCell(cell);
      }
      powerView.setAnchorPoint(cc.p(0, 0));
      powerView.setPosition(cc.p(0, 0));
      this.powerPanel.addChild(powerView);
      this.avatarImage.loadTexture(Helper.getTowerImage(object.statPath, stat));
    },
    setCard:function(card){
      this.cardNode = new CardUI(this, cc.size(this.cardPanel.width, this.cardPanel.height), card);
      this.cardPanel.addChild(this.cardNode);
      this.cardNode.setAnchorPoint(cc.p(0, 0));
      this.cardNode.setPosition(cc.p(0, 0));
      this.cardNode.setTouchEnabled(false);
    },
    initBtns:function(card){
      this.exitBtn.addTouchEventListener(this.exitLayer, this);
      if(card.level < GC.CARD.MAX_LEVEL){
          let nextLevel = Helper.getNextLevel(card.level);
          this.upgradeBtn.getChildByName("value").string = nextLevel.gold;
          this.upgradeBtn.addTouchEventListener(this.upgradeCard, this);
      }
      else{
          this.upgradeBtn.setBright(false);
      }
      if(this.category == "COLLECTION"){
          this.selectBtn.addTouchEventListener(this.selectCard, this);
      }
      else if(this.category == "BATTLE") {
          this.selectBtn.setVisible(false);
          let margin = 50;
          this.upgradeBtn.setAnchorPoint(cc.p(0, 0));
          this.upgradeBtn.x = margin;
          this.skillBtn.x = this.buttons.width - margin;
      }
      this.setStatBtns();
    },
    setStatBtns:function (){
        this.leftBtn.addTouchEventListener(function (sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                if(this.curStat > 1){
                    this.curStat--;
                    this.setInfo(this.card, this.curStat);
                }
            }
        }, this);
        this.rightBtn.addTouchEventListener(function (sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                if(this.curStat < 3){
                    this.curStat++;
                    this.setInfo(this.card, this.curStat);
                }
            }
        }, this);
    },
    exitLayer:function(sender, type){
      if(type == ccui.Widget.TOUCH_ENDED){
          this.card.unregisterCardLevel(this.cardNode);
          this.card.unregisterCardLevel(this);
          this.removeFromParent();
      }
    },
    changeCardLevel:function(level, exp){
        if(level < GC.CARD.MAX_LEVEL) {
            this.upgradeBtn.getChildByName("value").string = Helper.getNextLevel(level).gold;
        }
    },
    upgradeCard:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            if(this.card.level >= GC.CARD.MAX_LEVEL - 1){
                this.toast.setString("Đã đạt cấp tối đa!");
                this.toast.display(1);
                return;
            }
          this.nextLevel = Helper.getNextLevel(this.card.level);
          let user = gv.mainController.user;
          if(this.card.exp < this.nextLevel.fragments){
              this.toast.setString("Không đủ thẻ!");
              this.toast.display(1);
          }
          else if(user.gold < this.nextLevel.gold){
              this.toast.setString("Không đủ vàng!");
              this.toast.display(1);
          }
          else{
              gv.inventoryController.sendInventoryUpLevelCard(this.card);
            //let upgradeLayer = new CardUpgradeLayer(this, this.card);
            //gv.mainController.onRunScene(upgradeLayer);
          }
      }
    },
    selectCard:function(sender, type){
      if(type == ccui.Widget.TOUCH_ENDED){
          //gv.mainController.mainLayer["layer" +  GC.TAB.inventoryBtn].switchCards(this.sender);
          Helper.getLayer("inventory").switchCards(this.sender);
          this.removeFromParent();
      }
    },
    setNoStat:function (card){
        let object = card.object;
        if(object.type != "TOWER"){
            this.evolutionText.string = "Tiến hóa";
            this.avatarImage.loadTexture(Helper.getTowerImage(object.statPath, -1));
            this.leftBtn.setVisible(false);
            this.rightBtn.setVisible(false);
        }
    },
    setCheats:function (){
        this.nameText.setTouchEnabled(true);
        this.evolutionText.setTouchEnabled(true);
        this.nameText.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpLevelCard(this.card, 1);
            }
        }, this);
        this.evolutionText.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpExpCard(this.card, 100);
            }
        }, this);
    }
  });
  