var OpenChestLayer = BaseLayer.extend({
    ctor: function(sender, chest) {
        this._super(gv.mainController.mainLayer, res.JSON_OPEN_CHEST_LAYER);
        this.initScale();
        this.sender = sender;
        chest.registerChestStatus(this);
        chest.registerChestTime(this);
        this.setInfo(chest);
        this.initBtns();
        this.setCheats();
      },
      initScale:function(){
        this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
        this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
      },
      setInfo:function(chest){
        this.chest = chest;
        this.user = gv.mainController.user;
        this.nameLabel.string = chest.name;
        this.chestImg.loadTexture(chest.image);
        this.timeValue.string = Helper.convertHMDisplay(chest.remainingTime);
        this.goldValue.string = chest.rewards[0].minGold + "-" + chest.rewards[0].maxGold;
        this.cardValue.string = chest.rewards[0].minFragment + "-" + chest.rewards[0].maxFragment;
        this.changeChestStatus(chest.status);
      },
      initBtns:function(){
        this.exitBtn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                this.exitLayer();
            }
        }, this);
        this.openBtn.addTouchEventListener(this.openChest, this);
      },
      exitLayer:function(){
          this.removeFromParent();
          this.chest.unregisterChestTime(this);
          this.chest.unregisterChestStatus(this);
      },
      openChest:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
          switch(this.chest.status){
            case GC.CHEST.STATUS.WAITING:
                gv.chestController.sendChestOpen(this.chest);
              break;

            case GC.CHEST.STATUS.OPENING:
              if(this.user.gem >= this.chest.price){
                  gv.chestController.sendChestReceiveNow(this.chest);
              }
              break;

            case GC.CHEST.STATUS.FINISHED:
                gv.chestController.sendChestReceive(this.chest);
              break;
              case GC.CHEST.STATUS.SHOP:
                gv.shopController.sendShopChestBuying(this.chest);
                break;
          }
            this.exitLayer();
        }
      },

      changeChestStatus:function(status){
        switch(status){
          case GC.CHEST.STATUS.WAITING:
                this.openLabel.string = "Mở khóa";
                this.chestValue.string = Helper.convertHMDisplay(this.chest.remainingTime);
                this.gemIcon.setVisible(false);
                break;
          case GC.CHEST.STATUS.OPENING:
                this.openLabel.string = "Mở ngay";
                this.chestValue.string = this.chest.price;
                this.gemIcon.setVisible(true);
                break;
            case GC.CHEST.STATUS.FINISHED:
                this.openLabel.string = "Mở ngay";
                this.openLabel.y = this.openBtn.height / 2;
                this.chestValue.setVisible(false);
                this.gemIcon.setVisible(false);
                break;
            case GC.CHEST.STATUS.SHOP:
                this.openLabel.setVisible(false);
                this.chestValue.setString(this.chest.remainingTime);
                this.gemIcon.loadTexture(res.ICON_GOLD);
                this.chestValue.setPositionY(this.openBtn.height / 2);
                this.gemIcon.setPositionY(this.openBtn.height / 2);
                this.timeBg.setVisible(false);
                var currSize = this.openBtn.getSize();
                this.openBtn.loadTextures(res.ORANGE_BTN,res.ORANGE_BTN);
                this.openBtn.setSize(currSize);
                break;

        }
    },

    changeChestTime:function(time){
        this.timeValue.string = Helper.convertHMDisplay(time);
        this.chestValue.string = this.chest.price;
    },
    setCheats:function (){
        this.timeBg.setTouchEnabled(true);
        this.timeBg.addTouchEventListener(function (sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                if(this.chest.status == GC.CHEST.STATUS.OPENING){
                    gv.cheatController.sendCheatReduceLobbyChestTime(this.chest, 3600);
                }
            }
        }, this);
    }
});