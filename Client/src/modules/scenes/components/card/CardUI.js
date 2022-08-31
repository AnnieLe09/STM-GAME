var CardUI = BaseImage.extend({
  ctor:function(context, size, card, category){
      this._super(context, res.JSON_CARD_NODE);
      this.initAttributes(this.node);
      this.scaleSize = size;
      this.category = category;
      this.setLevelAnim();
      this.setInfo(card);
      card.registerCardLevel(this);
      this.setTouchListener();
      this.setSize(size);
  },
  setSize:function(size){
      this.children = this.node.getChildren();
      let height = this.bg.height + this.progressBg.height + 35;
      let width = this.bg.width + 35;
      this.setScaleY(size.height / height);
      this.setScaleX(size.width / width);
      this.setContentSize(cc.size(width, height));
  },
  setLevelAnim:function (){
    let upgradeAnim = new sp.SkeletonAnimation(res.JSON_CARD_UPGRADE, res.ATLAS_CARD_UPGRADE);
    let width = this.greater.width;
    let height = this.greater.height;
    upgradeAnim.setPosition(cc.p(width / 2, height / 2));
    upgradeAnim.setScaleX(width / 120);
    upgradeAnim.setAnimation(0, "card_upgrade_ready", true);
    this.greater.addChild(upgradeAnim);
  },
    setTouchListener:function (){
        this.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                switch(CardUI.touchType){
                    case "VIEW_INFO":
                        this.viewInfo(this.category);
                        break;
                    case "SWITCH_CARDS":
                        this.switchCards();
                        break;
                }
            }
        }, this);
    },
  viewInfo:function(category){
    let cardInfoLayer = new CardInfoLayer(this, this.card, category);
    cardInfoLayer.setPosition(cc.p(0, 0));
    gv.mainController.mainLayer.addChild(cardInfoLayer, GC.CARD_INFO.Z_ORDER);
  },
  switchCards:function(){
    CardUI.touchType = "VIEW_INFO";
    Helper.getLayer("inventory").endSwitchCards(this);
  },
  setInfo:function(card){
    this.card = card;
    let object = card.object;
    this.avatar.loadTexture(CARD_PATH + object.avatar);
    this.energyText.string = "" + object.energy;
    this.changeCardLevel(card.level, card.exp);
  },
  changeCardLevel:function(level, exp){
    this.levelText.string = "Lv." + level;
    this.setProgressBar(level, exp);
  },
  setProgressBar:function(level, exp){
    if(level < 10){
      let nextLevel = Helper.getNextLevel(level);
      let fragments = nextLevel.fragments;
  
      if(exp < nextLevel.fragments){
        this.smaller.setVisible(true);
        this.greater.setVisible(false);
        this.expText.string = "" + exp + "/" + fragments;
        this.smaller.setScaleX(exp / fragments);
      }
      else if(level >= 9){
        this.max.setVisible(true);
        this.smaller.setVisible(false);
        this.expText.string = "MAX";
      }
      else{
        this.greater.setVisible(true);
        this.smaller.setVisible(false);
        this.expText.string = "" + exp + "/" + fragments;
      }
    }
    else{
      this.max.setVisible(true);
      this.smaller.setVisible(false);
      this.expText.string = "MAX";
    }
  },
});
CardUI.touchType = "VIEW_INFO";