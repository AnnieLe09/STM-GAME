var Shop = cc.Class.extend({
    ctor:function(time, numChest, numCard, chestListPacket, cardListPacket){
        this.time = time;
        this.numChest = numChest;
        this.numCard = numCard;
        this.chestList = [];
        this.cardList = []; // {id: , amountOfCard: , isBoughtCard: }

        for(var i = 0; i < this.numChest; i++){
            this.chestList.push({});
            this.chestList[i].obj = new Chest(chestListPacket[i].id, chestListPacket[i].type, GC.CHEST.STATUS.SHOP, chestListPacket[i].price, chestListPacket[i].gold, chestListPacket[i].cardList);
            this.chestList[i].isReceived = chestListPacket[i].isReceived;
            this.chestList[i].price = chestListPacket[i].price;
        }

        for(var i = 0; i < this.numCard; i++){
            this.cardList.push({});
            this.cardList[i].obj = {id: cardListPacket[i].id, amountOfCard: cardListPacket[i].amountOfCard}
            this.cardList[i].isReceived = cardListPacket[i].isBoughtCard;
            this.cardList[i].price = cardListPacket[i].amountOfCard*GC.SHOP.PRICE.CARD;
        }
    },
});