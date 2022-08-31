var ShopLayer = BaseLayer.extend({
    ctor:function(context){
        this._super(context, res.JSON_SHOP_LAYER);

        this.itemList = [];

        gv.shopController.sendShopInfo(this);

        this.initShopGold();
    },

    initShopLoginItem:function(shop){
        this.time = shop.time;
        var timeHMS = Helper.convertHMS(this.time);
        this.txt_time.setString(timeHMS.hours + 'h ' + timeHMS.minutes + 'm');

        this.schedule(this.updateTime, 60);

        var numItem = shop.numChest + shop.numCard;
        var i = 0;

        // Init chest
        while(i < shop.numChest){
            var item = new ShopItemUI(this,  SHOP_ITEM.CHEST, shop.chestList[i].obj, shop.chestList[i].isReceived, shop.chestList[i].price);
            this.ItemList.addChild(item);
            item.setNormalizedPosition(GC.SHOP.ITEM_POSITION.X[numItem-1][i], GC.SHOP.ITEM_POSITION.Y);
            i++
        }

        // Init cards
        i=0;
        while(i < shop.numCard){
            var item = new ShopItemUI(this, SHOP_ITEM.CARD, shop.cardList[i].obj, shop.cardList[i].isReceived, shop.cardList[i].price);
            this.ItemList.addChild(item);
            item.setNormalizedPosition(GC.SHOP.ITEM_POSITION.X[numItem-1][i+shop.numChest], GC.SHOP.ITEM_POSITION.Y);
            i++
        }   
    },

    initShopGold:function(){
        for(var i = 0; i < 3; i++){
            this['txt_gold_value_' + i].setString(Helper.convertToDecimalString(GC.SHOP.GOLD[i.toString()].VALUE.toString()));
            this['txt_gold_price_' + i].setString(GC.SHOP.GOLD[i].PRICE.toString());
            this['gold_slot_' + i].addTouchEventListener(this.buyGold, this)
        }
    },
 
    buyGold:function(sender, type){
        if (type == ccui.Widget.TOUCH_ENDED){
            var buyItemLayer = new BuyItemLayer(sender, SHOP_ITEM.GOLD);
            buyItemLayer.setPosition(cc.p(0, 0));
            gv.mainController.mainLayer.addChild(buyItemLayer, GC.CARD_INFO.Z_ORDER);
        }
    },

    updateTime:function(dt){
        this.time = this.time - 60;

        if(this.time <= 0){
            gv.shopController.sendShopInfo(this);
        }
        
        if (this.time >= 0){
            var timeHMS = Helper.convertHMS(this.time);
            this.txt_time.setString(timeHMS.hours + 'h ' + timeHMS.minutes + 'm');
        }
    }
});