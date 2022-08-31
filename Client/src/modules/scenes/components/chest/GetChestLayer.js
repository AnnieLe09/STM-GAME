var ANIMATION_TYPE = {      
  ANIMATION_START:      0,		
  ANIMATION_END:        1,		
  ANIMATION_COMPLETE:   2,
  ANIMATION_EVENT:      3
};
var GetChestLayer = BaseLayer.extend({
    ctor: function(sender, chest) {
        this._super(gv.mainController.mainLayer, res.JSON_GET_CHEST_LAYER);
        this.initScale();
        this.initAnim(chest);
        this.sender = sender;
        this.setInfo(chest);
        this.initBtns();
      },
      initScale:function(){
        this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
        this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
      },
      initAnim:function(chest){
        let path = chest.anim;
        this.anim = new sp.SkeletonAnimation(path + ".json", path + ".atlas");
        this.animArr = ["init", "opening", "opening"];
        this.idxAnim = 0;
        this.anim.setAnchorPoint(cc.p(0.5, 0));
        this.anim.setPosition(cc.p(this.winSize.width / 2, 0));
        this.anim.setScale(0.7);
        this.anim.setAnimation(0, "init", false);
        this.anim.setAnimationListener(this, this.animationStateEvent);
        this.addChild(this.anim);
      },
      animationStateEvent: function(obj, trackIndex, type, event, loopCount) {
                var entry = this.anim.getCurrent();
                var animationName = (entry && entry.animation) ? entry.animation.name : 0;
                switch(type)
                {
                    case ANIMATION_TYPE.ANIMATION_START:
                        break;
                    case ANIMATION_TYPE.ANIMATION_END:
                        break;
                    case ANIMATION_TYPE.ANIMATION_EVENT:
                        break;
                    case ANIMATION_TYPE.ANIMATION_COMPLETE:
                        ++this.idxAnim;
                        this["reward" + this.idxAnim].setVisible(true);
                        if(this.idxAnim < this.animArr.length){
                          this.anim.setAnimation(0, this.animArr[this.idxAnim], false);
                        }
                        break;
                    default :
                        break;
                }
            },
        
      setInfo:function(chest){
        this.chest = chest;
        for(let i = 1; i <= 2; ++i){
          let reward = this["reward" + i];
          let card = chest.cards[i - 1];
          let name = GC.CARD.NAMES[card.id];
          let type = GC.CARD.TYPES[card.id];
          let num = card.amountOfCard;
          //let object = GC[type].LIST[name];
            let object = Helper.createObject(type, name);
          reward.getChildByName("avatar").loadTexture(CARD_PATH + object.AVATAR + ".png");
          reward.getChildByName("text").string = "x" + num;
        }
        this.reward3.getChildByName("text").string = "" + chest.gold;

      },
      initBtns:function(){
        this.btn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                let user = gv.mainController.user;
                user.updateGold(user.gold + this.chest.gold);
                let cards = this.chest.cards;
                for(let i = 0; i < cards.length; ++i){
                    let card = gv.inventoryController.findCardById(cards[i].id);
                    card.updateLevel(card.level, card.exp + cards[i].amountOfCard);
                }
                if (this.sender == null) {
                  user.removeChest(this.chest);
                }
                this.removeFromParent();
              }
        }, this);
      },
});