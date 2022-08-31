var ShopItemUI = BaseImage.extend({
    // Type is chest or card
    ctor:function(context, type, dataObj, isReceived, price){
        this._super(context, res.JSON_ITEM_SLOT_NODE);
        this.initAttributes(this.node);

        this.dataObj = dataObj;
        this.price = price;
        this.txt_price.setString(price);

        if(type == SHOP_ITEM.CHEST){
            this.img_chest.loadTexture(res.CHEST_SPRITE);
            this.img_chest.setVisible(true);
            this.item_shop_slot.addTouchEventListener(this.openChest, this);
            this.dataObj.registerChestStatus(this);
            // data is chestList[i] of PacketUser
            // this.chest = new Chest(data.id, 0, GC.CHEST.STATUS.FINISHED, 0,data.gold , data.cardList);
        }
        else if(type == SHOP_ITEM.CARD){
            var cardNode = new GeneralCardUI(this, this.pnl_card.getSize(), this.dataObj.id);

            cardNode.setNormalizedPosition(0.5,0.5);

            this.pnl_card.addChild(cardNode);
            this.pnl_card.setVisible(true);
            this.txt_left.setString('x'+dataObj.amountOfCard);
            this.txt_left.setVisible(true);
            cardNode.setTouchEnabled(false);
            this.item_shop_slot.addTouchEventListener(this.buyItem, this);
        }

        this.changeItemStatus(isReceived);
    },

    openChest: function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                var openChestLayer = new OpenChestLayer(this, this.dataObj);
                openChestLayer.setPosition(cc.p(0, 0));
                gv.mainController.mainLayer.addChild(openChestLayer, GC.CARD_INFO.Z_ORDER);
                break;
            case ccui.Widget.TOUCH_CANCELLED:
                break;
        }
    },

    buyItem:function(sender, type){
        if (type == ccui.Widget.TOUCH_ENDED){
            var buyItemLayer = new BuyItemLayer(this, SHOP_ITEM.CARD);
            buyItemLayer.setPosition(cc.p(0, 0));
            gv.mainController.mainLayer.addChild(buyItemLayer, GC.CARD_INFO.Z_ORDER);
        }
    },

    changeItemStatus:function(status){
        if (status == 1){
            this.item_shop_slot.setTouchEnabled(false);
            this.pnl_bought.setVisible(true);
            this.btn_buy.setVisible(false);
        }
    }
});