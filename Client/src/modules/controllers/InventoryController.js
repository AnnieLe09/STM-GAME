var InventoryController = cc.Class.extend({
    ctor:function(){
        this.user = gv.mainController.user;
    },
   sendInventoryChangeCard:function(collectionIdx, battleIdx){
       this.collectionIdx = collectionIdx;
       this.battleIdx = battleIdx;
       this.user = gv.mainController.user;
       testnetwork.connector.sendInventoryChangeCard(this.user.collectionCards[collectionIdx].id, this.user.battleCards[battleIdx].id);
   },
    sendInventoryUpLevelCard:function(card){
        this.card = card;
        testnetwork.connector.sendInventoryUpLevelCard(card.id);
    },
   onInventoryChangeCard:function(packet){
       let error = packet.getError();
       if(error == GC.ERROR.SUCCESS) {
            this.user.switchCards(this.battleIdx, this.collectionIdx);
       }
   },
    onInventoryUpLevelCard:function (packet){
        this.card.updateLevel(packet.level, packet.exp);
        let upgradeLayer = new CardUpgradeLayer(gv.mainController.mainLayer, this.card);
        gv.mainController.onRunScene(upgradeLayer);
    },
    findCardById:function(id){
        this.user = gv.mainController.user;
        let battleCards = this.user.battleCards;
        for(let i = 0; i < battleCards.length; ++i){
            cc.log(battleCards[i].id);
            if(battleCards[i].id == id)
                return battleCards[i];
        }
        let collectionCards = this.user.collectionCards;
        for(let i = 0; i < collectionCards.length; ++i){
            cc.log(collectionCards[i].id);
            if(collectionCards[i].id == id)
                return collectionCards[i];
        }
        cc.log(s);
        return null;
    }
});