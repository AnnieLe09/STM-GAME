var CheatController = cc.Class.extend({
    sendCheatUpG:function (gem){
        testnetwork.connector.sendCheatUpG(gem);
    },
    sendCheatUpGold:function (gold){
        testnetwork.connector.sendCheatUpGold(gold);
    },
    sendCheatUpTrophy:function (trophy){
        testnetwork.connector.sendCheatUpTrophy(trophy);
    },
    sendCheatUpExpCard:function (card, exp){
      this.card = card;
      testnetwork.connector.sendCheatUpExpCard(card.id, exp);
    },
    sendCheatUpLevelCard:function (card, level){
        this.card = card;
        testnetwork.connector.sendCheatUpLevelCard(card.id, level);
    },
    sendCheatUpLobbyChest:function (sender){
        this.chestUI = sender;
        testnetwork.connector.sendCheatUpLobbyChest();
    },
    sendCheatReduceLobbyChestTime:function (chest, time){
        this.chest = chest;
        testnetwork.connector.sendCheatReduceLobbyChestTime(chest.id, time);
    },
    onCheatUpG:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            gv.mainController.user.updateGem(packet.gem);
        }
    },
    onCheatUpGold:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            gv.mainController.user.updateGold(packet.gold);
        }
    },
    onCheatUpTrophy:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            gv.mainController.user.updateTrophy(packet.trophy);
        }
    },
    onCheatUpExpCard:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.card.updateLevel(this.card.level,packet.exp);
        }
    },
    onCheatUpLevelCard:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.card.updateLevel(packet.level, 0);
        }
    },
    onCheatUpLobbyChest:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            let chest = Chest.parse(packet);
            gv.mainController.user.chests.push(chest);
            this.chestUI.setChest(chest);
        }
    },
    onCheatReduceLobbyChestTime:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.chest.updateTime(packet.time);
        }
    },
});