var BuyItemLayer = BaseLayer.extend({
    ctor:function(sender, itemType){
        this._super(gv.mainController.mainLayer, res.JSON_BUY_ITEM_LAYER);
        this.initScale();
        this.sender = sender;
        this.setInfo(itemType);
        this.itemType = itemType;
        this.initBtns();
    },
    initScale:function(){
        this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
        this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
    },
    initBtns:function(){
        this.exitBtn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                if (this.itemType == SHOP_ITEM.CARD){
                    this.card.unregisterCardLevel(this.cardUI);
                }
                this.removeFromParent();
            }
        }, this);
        this.openBtn.addTouchEventListener(this.buyItem, this);
    },
    buyItem:function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            switch (this.itemType) {
                case SHOP_ITEM.CARD:
                    gv.shopController.sendShopCardBuying(this.card, this.sender.dataObj.amountOfCard, this.sender.price, this.sender);
                    break;
                case SHOP_ITEM.GOLD:
                    gv.shopController.sendShopGoldBuying(this, this.sender.getTag());
                    break;
            }
        }
    },
    setInfo:function(itemType){
        switch (itemType) {
            case SHOP_ITEM.CARD:
                this.card = gv.inventoryController.findCardById(this.sender.dataObj.id);
                var cardSize = cc.size(110,150);
                this.cardUI = new CardUI(this, cardSize, this.card);
                this.cardUI.progressBg.setPositionY(280);
                this.cardUI.progressBg.setScale(2,2);
                this.cardUI.energyIcon.setVisible(false);
                this.cardUI.levelBg.setVisible(false);
                this.itemsPanel.addChild(this.cardUI);
                this.cardUI.setNormalizedPosition(0.5, 0.43);

                this.txt_price.setString(this.sender.price);
                this.txt_amount.setString('x' + this.sender.dataObj.amountOfCard)
                break;
            case SHOP_ITEM.GOLD:
                this.pnl_gold.setVisible(true);
                this.pnl_gold.addTouchEventListener(function(sender, type){
                    if(type == ccui.Widget.TOUCH_ENDED){
                        this.pnl_tool_tip.setVisible(!this.pnl_tool_tip.isVisible());
                    }
                }, this);
               this.txt_price.setString(GC.SHOP.GOLD[this.sender.getTag()].PRICE);
               this.txt_amount.setString(Helper.convertToDecimalString(GC.SHOP.GOLD[this.sender.getTag()].VALUE.toString()));
               this.img_icon.loadTexture(res.ICON_GEM);
                break;
        }
    }
});