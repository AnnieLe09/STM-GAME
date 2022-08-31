var ChestController = cc.Class.extend({
    sendChestOpen:function(chest){
        this.chest = chest;
        testnetwork.connector.sendChestOpen(chest.id);
    },
    sendChestReceive:function(chest){
        this.chest = chest;
        testnetwork.connector.sendChestReceive(chest.id);
    },
    sendChestReceiveNow:function (chest){
        this.chest = chest;
        testnetwork.connector.sendChestReceiveNow(chest.id, chest.price);
    },
    onChestOpen:function(packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS){
            //this.chest.status = (this.chest.status + 1) % GC.CHEST.NUM;
            this.chest.updateStatus(GC.CHEST.STATUS.OPENING);
        }
    },
    onChestReceive:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            this.chest.updateStatus(GC.CHEST.STATUS.FINISHED);
            this.getChestReward();
        }
    },
    onChestReceiveNow:function (packet){
        let error = packet.getError();
        if(error == GC.ERROR.SUCCESS) {
            let user = gv.mainController.user;
            user.updateGem(user.gem - packet.gem)
            this.chest.updateStatus(GC.CHEST.STATUS.FINISHED);
            this.getChestReward();
        }
    },
    getChestReward:function(){
        let getChestLayer = new GetChestLayer(null, this.chest);
        getChestLayer.setPosition(cc.p(0, 0));
        gv.mainController.mainLayer.addChild(getChestLayer, GC.CARD_INFO.Z_ORDER);
    }
});