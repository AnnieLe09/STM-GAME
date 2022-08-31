var MainController = cc.Class.extend({
    ctor: function(){
        this.loginLayer = LoginLayer;
        fr.view(this.loginLayer);
        //let layer = new EndMatchLayer(null, 1);
        //this.onRunScene(layer);
    },
    onConnect: function (){
        gv.gameClient.connect();
    },
    onConnectSuccess:function()
    {
        cc.log("Connect Success!")
    },
    onConnectFail:function(text)
    {
        cc.log("Connect fail: " + text);
    },
    onFinishLogin:function()
    {

    },
    onDisconnected: function (){
        cc.log("Maincontroller + Disconnect!")
        cc.game.run();
    },
    onUserInfo:function(packet)
    {
        this.user = User.parse(packet);
        testnetwork.connector.sendInventoryInfo();

    },
    onInventoryInfo:function(packet){
        this.user.battleCards = Helper.parseArray(Card, packet.battleCards, packet.battleNum);
        this.user.collectionCards = Helper.parseArray(Card, packet.collectionCards, packet.collectionNum);
        testnetwork.connector.sendGetLobbyChestInfo();
    },
    onChestInfo:function(packet)
    {
        this.user.chests = Helper.parseArray(Chest, packet.chestList, packet.amountOfChest);
        this.mainLayer = new MainLayer();
        this.mainLayer.setName("MainLayer");
        this.mainLayer.retain();
        this.onRunScene(this.mainLayer);
    },
    onSelectChest_Info:function(sender)
    {
        testnetwork.connector.sendGetLobbyChestInfo();
    },
    onRunScene: function(layer, transitionTime){
        var scene = new cc.Scene();
        scene.addChild(layer);
        if(!transitionTime)
        {
            transitionTime = 1.2;
        }
        cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
    },
    sendResetUserInfo: function (){
        testnetwork.connector.sendResetUserInfo();
        //cc.game.run();
    }
});
