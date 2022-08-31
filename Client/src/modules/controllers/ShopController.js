var ShopController = cc.Class.extend({
    ctor:function(){
        this.listItemUI = [];
    },
    sendShopInfo:function(sender){
        this.shopUI = sender;
        testnetwork.connector.sendShopInfo();
        
    },

    sendShopChestBuying:function(chest){
        this.chest = chest;
        testnetwork.connector.sendShopChestBuying(chest.id);
    },

    sendShopCardBuying:function(card, exp, price, itemSlotUI){
        this.card = card;
        this.exp = exp;
        this.price = price;
        this.itemSlotUI = itemSlotUI;
        testnetwork.connector.sendShopCardBuying(card.id);
    },

    sendShopGoldBuying:function(sender, id){
        this.goldID = id;
        this.buyGoldUI = sender;
        testnetwork.connector.sendShopGoldBuying(id);
    },

    onReceiveShopChestBuying:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            let user = gv.mainController.user;
            user.updateGold(user.gold - this.chest.remainingTime);
            this.chest.updateItemStatusBought();
            let getChestLayer = new GetChestLayer(this, this.chest);
            getChestLayer.setPosition(cc.p(0, 0));
            gv.mainController.mainLayer.addChild(getChestLayer, GC.CARD_INFO.Z_ORDER);
        }
    },

    onReceiveShopCardBuying:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.card.updateLevel(this.card.level, this.card.exp + this.exp);
            let user = gv.mainController.user;
            user.updateGold(user.gold - this.price);
            this.itemSlotUI.changeItemStatus(1);
        }
    },

    onReceiveShopGoldBuying:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            let user = gv.mainController.user;
            user.updateGold(user.gold + GC.SHOP.GOLD[this.goldID.toString()].VALUE);
            user.updateGem(user.gem - GC.SHOP.GOLD[this.goldID.toString()].PRICE);
            this.buyGoldUI.removeFromParent();
        }
    },

    onReceiveShopInfo:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.shop = new Shop(packet.time, packet.amountOfChest, packet.amountOfTypeCard, packet.chestList, packet.cardList);
            this.shopUI.initShopLoginItem(this.shop);
        }
    },
});