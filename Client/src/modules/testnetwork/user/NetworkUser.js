/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv||{};
var testnetwork = testnetwork||{};

testnetwork.Connector = cc.Class.extend({
    ctor:function(gameClient)
    {
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userName = "username";
    },
    onReceivedPacket:function(cmd, packet)
    {
        cc.log("onReceivedPacket:", cmd);
        switch (cmd)
        {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest();
                break;
            case gv.CMD.USER_LOGIN:
                this.sendGetUserInfo();
                //fr.getCurrentScreen().onFinishLogin();
                gv.mainController.onFinishLogin();
                break;
            case gv.CMD.USER_INFO:
                //fr.getCurrentScreen().onUserInfo(packet);
                gv.mainController.onUserInfo(packet);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                //fr.getCurrentScreen().updateMove(packet.x, packet.y);
                gv.mainController.updateMove(packet.x, packet.y);
                break;
            case gv.CMD.LOBBY_CHEST_INFO:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.mainController.onChestInfo(packet);
                break;
            case gv.CMD.CHEST_OPEN:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.chestController.onChestOpen(packet);
                break;
            case gv.CMD.CHEST_RECEIVE:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.chestController.onChestReceive(packet);
                break;
            case gv.CMD.CHEST_RECEIVE_NOW:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.chestController.onChestReceiveNow(packet);
                break;
            case gv.CMD.INVENTORY_INFO:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.mainController.onInventoryInfo(packet);
                break;
            case gv.CMD.INVENTORY_CHANGE_CARD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.inventoryController.onInventoryChangeCard(packet);
                break;
            case gv.CMD.INVENTORY_UP_EXP_CARD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.mainController.onInventoryUpExpCard(packet);
                break;
            case gv.CMD.INVENTORY_UP_LEVEL_CARD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.inventoryController.onInventoryUpLevelCard(packet);
                break;
            case gv.CMD.CHEAT_UP_G:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpG(packet);
                break;
            case gv.CMD.CHEAT_UP_GOLD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpGold(packet);
                break;
            case gv.CMD.CHEAT_UP_TROPHY:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpTrophy(packet);
                break;
            case gv.CMD.CHEAT_UP_EXP_CARD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpExpCard(packet);
                break;
            case gv.CMD.CHEAT_UP_LEVEL_CARD:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpLevelCard(packet);
                break;
            case gv.CMD.CHEAT_UP_LOBBY_CHEST:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatUpLobbyChest(packet);
                break;
            case gv.CMD.CHEAT_REDUCE_LOBBY_CHEST_TIME:
                //fr.getCurrentScreen().onChestInfo(packet);
                gv.cheatController.onCheatReduceLobbyChestTime(packet);
                break;

            // Shop
            case gv.CMD.SEND_SHOP_INFO:
                gv.shopController.onReceiveShopInfo(packet);
                break;
            case gv.CMD.SHOP_CHEST_BUYING:
                gv.shopController.onReceiveShopChestBuying(packet);
                break;
            case gv.CMD.SHOP_CARD_BUYING:
                gv.shopController.onReceiveShopCardBuying(packet);
                break;
            case gv.CMD.SHOP_GOLD_BUYING:
                gv.shopController.onReceiveShopGoldBuying(packet);
                break;

            // Battle
            case gv.CMD.FIND_MATCH:
                gv.battleController.onFindMatch(packet);
                break;
            case gv.CMD.CANCEL_FIND_MATCH:
                gv.battleController.onCancelFindMatch(packet);
                break;
            case gv.CMD.PLACE_SPELL:
                gv.battleController.onPlaceSpell(packet);
                break;
            case gv.CMD.PLACE_OPPONENT_SPELL:
                gv.battleController.onPlaceOpponentSpell(packet);
                break;
            case gv.CMD.PLACE_TOWER:
                gv.battleController.onPlaceTower(packet);
                break;
            case gv.CMD.PLACE_OPPONENT_TOWER:
                gv.battleController.onPlaceOpponentTower(packet);
                break;
            case gv.CMD.DROP_TOWER:
                gv.battleController.onDropTower(packet);
                break;
            case gv.CMD.DROP_OPPONENT_TOWER:
                gv.battleController.onDropOpponentTower(packet);
                break;
            case gv.CMD.UPGRADE_TOWER:
                gv.battleController.onUpgradeTower(packet);
                break;
            case gv.CMD.UPGRADE_OPPONENT_TOWER:
                gv.battleController.onUpgradeOpponentTower(packet);
                break;
            case gv.CMD.PLACE_MONSTER:
                gv.battleController.onPlaceMonster(packet);
                break;
            case gv.CMD.PLACE_OPPONENT_MONSTER:
                gv.battleController.onPlaceOpponentMonster(packet);
                break;
            case gv.CMD.GESTURE:
                gv.battleController.onReceiveGesture(packet);
                break;
            case gv.CMD.OPPONENT_GESTURE:
                gv.battleController.onReceiveOpponentGesture(packet);
                break;
            case gv.CMD.START_ROUND:
                gv.battleController.onStartRound(packet);
                break;
            case gv.CMD.END_MATCH:
                gv.battleController.onEndMatch(packet);
                break;
            case gv.CMD.START_OPPONENT_ROUND:
                gv.battleController.onStartOpponentRound(packet);
                break;
            case gv.CMD.BATTLE_REWARD:
                gv.battleController.onReceiveBattleReward(packet);
                break;
            case gv.CMD.START_BATTLE:
                break;
        }
    },
    sendGetUserInfo:function()
    {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendResetUserInfo:function()
    {
        cc.log("sendResetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendResetUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendLoginRequest: function () {
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        //pk.pack(this._userName);
        pk.pack(gv.gameClient.userId);
        this.gameClient.sendPacket(pk);
    },
    sendMove:function(direction){
        cc.log("SendMove:" + direction);
        var pk = this.gameClient.getOutPacket(CmdSendMove);
        pk.pack(direction);
        this.gameClient.sendPacket(pk);
    },
    sendGetLobbyChestInfo:function()
    {
        cc.log("sendGetLobbyChestInfo");
        var pk = this.gameClient.getOutPacket(CmdSendLobbyChestInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendChestOpen:function(id){
        cc.log("sendChestOpen");
        var pk = this.gameClient.getOutPacket(CmdSendChestOpen);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendChestReceive:function(id){
        cc.log("sendChestReceive");
        var pk = this.gameClient.getOutPacket(CmdSendChestReceive);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendChestReceiveNow:function(id, g){
        cc.log("sendChestReceiveNow");
        var pk = this.gameClient.getOutPacket(CmdSendChestReceiveNow);
        pk.pack(id, g);
        this.gameClient.sendPacket(pk);
    },
    sendInventoryInfo:function(){
        cc.log("sendInventoryInfo");
        var pk = this.gameClient.getOutPacket(CmdSendInventoryInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendInventoryChangeCard:function(collectionId, battleId){
        cc.log("sendInventoryChangeCard");
        var pk = this.gameClient.getOutPacket(CmdSendInventoryChangeCard);
        pk.pack(collectionId, battleId);
        this.gameClient.sendPacket(pk);
    },
    sendInventoryUpExpCard:function(id, exp){
        cc.log("sendInventoryUpExpCard");
        var pk = this.gameClient.getOutPacket(CmdSendInventoryUpExpCard);
        pk.pack(id, exp);
        this.gameClient.sendPacket(pk);
    },
    sendInventoryUpLevelCard:function(id){
        cc.log("sendInventoryUpLevelCard");
        var pk = this.gameClient.getOutPacket(CmdSendInventoryUpLevelCard);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpG:function(g){
        cc.log("sendCheatUpG");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpG);
        pk.pack(g);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpGold:function(gold){
        cc.log("sendCheatUpGold");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpGold);
        pk.pack(gold);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpTrophy:function(trophy){
        cc.log("sendCheatUpTrophy");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpTrophy);
        pk.pack(trophy);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpExpCard:function(id, exp){
        cc.log("sendCheatUpExpCard");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpExpCard);
        pk.pack(id, exp);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpLevelCard:function(id, level){
        cc.log("sendCheatUpLevelCard");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpLevelCard);
        pk.pack(id, level);
        this.gameClient.sendPacket(pk);
    },
    sendCheatUpLobbyChest:function(){
        cc.log("sendCheatUpLobbyChest");
        var pk = this.gameClient.getOutPacket(CmdSendCheatUpLobbyChest);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendCheatReduceLobbyChestTime:function(id, time){
        cc.log("sendCheatReduceChestTime");
        var pk = this.gameClient.getOutPacket(CmdSendCheatReduceLobbyChestTime);
        pk.pack(id, time);
        this.gameClient.sendPacket(pk);
    },

    // Shop
    sendShopInfo:function(){
        cc.log("sendShopInfo");
        var pk = this.gameClient.getOutPacket(CmdSendShopInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendShopChestBuying:function(id){
        cc.log("sendShopChestBuying");
        var pk = this.gameClient.getOutPacket(CmdSendShopChestBuying);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendShopCardBuying:function(id){
        cc.log("sendShopCardBuying");
        var pk = this.gameClient.getOutPacket(CmdSendShopCardBuying);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendShopGoldBuying:function(id){
        cc.log("sendShopGoldBuying");
        var pk = this.gameClient.getOutPacket(CmdSendShopGoldBuying);
        pk.pack(id);
        this.gameClient.sendPacket(pk);
    },
    sendFindMatch:function(){
        cc.log("sendFindMatch");
        var pk = this.gameClient.getOutPacket(CmdSendFindMatch);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendPlaceSpell:function(tick, cardId, i, j){
        cc.log("sendPlaceSpell");
        var pk = this.gameClient.getOutPacket(CmdSendPlaceSpell);
        pk.pack(tick, cardId, i, j);
        this.gameClient.sendPacket(pk);
    },
    sendPlaceTower:function(tick, cardId, i, j){
        cc.log("sendPlaceTower");
        var pk = this.gameClient.getOutPacket(CmdSendPlaceTower);
        pk.pack(tick, cardId, i, j);
        this.gameClient.sendPacket(pk);
    },

    sendDropTower:function(tick, i, j){
        cc.log("sendDropTower");
        var pk = this.gameClient.getOutPacket(CmdSendDropTower);
        pk.pack(tick, i, j);
        this.gameClient.sendPacket(pk);
    },
    sendUpgradeTower:function(tick, cardId, i, j) {
        cc.log("sendUpgradeTower");
        var pk = this.gameClient.getOutPacket(CmdSendUpgradeTower);
        pk.pack(tick, cardId, i, j);
        this.gameClient.sendPacket(pk);
    },

    // Drop monster
    sendPlaceMonster:function(tick, battleId){
        cc.log("sendPlaceMonster");
        var pk = this.gameClient.getOutPacket(CmdSendPlaceMonster);
        pk.pack(tick, battleId);
        this.gameClient.sendPacket(pk);
    },

    sendGesture:function(tick, monsterId){
        cc.log("sendGesture");
        var pk = this.gameClient.getOutPacket(CmdSendGesture);
        pk.pack(tick, monsterId);
        this.gameClient.sendPacket(pk);
    },

    sendStartRound:function(tick){
        cc.log("sendStartRound");
        var pk = this.gameClient.getOutPacket(CmdSendStartRound);
        pk.pack(tick);
        this.gameClient.sendPacket(pk);
    },
    sendEndMatch:function(tick){
        cc.log("sendEndMatch");
        var pk = this.gameClient.getOutPacket(CmdSendEndMatch);
        pk.pack(tick);
        this.gameClient.sendPacket(pk);
    },
    sendCancelFindMatch:function(){
        cc.log("sendCancelFindMatch");
        var pk = this.gameClient.getOutPacket(CmdSendCancelFindMatch);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendStartBattle:function(){
        cc.log("sendStartBattle");
        var pk = this.gameClient.getOutPacket(CmdSendStartBattle);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
});



