/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD ||{};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.RESET_USER_INFO = 1002;
gv.CMD.MOVE = 2001;

gv.CMD.LOBBY_CHEST_INFO = 3002;
gv.CMD.CHEST_OPEN = 3003;
gv.CMD.CHEST_RECEIVE = 3004;
gv.CMD.CHEST_RECEIVE_NOW = 3005;

gv.CMD.SEND_SHOP_INFO = 4001;
gv.CMD.SHOP_CHEST_BUYING = 4002;
gv.CMD.SHOP_CARD_BUYING = 4003;
gv.CMD.SHOP_GOLD_BUYING = 4004;

gv.CMD.INVENTORY_INFO = 5001;
gv.CMD.INVENTORY_CHANGE_CARD = 5002;
gv.CMD.INVENTORY_UP_EXP_CARD = 5003;
gv.CMD.INVENTORY_UP_LEVEL_CARD = 5004;

gv.CMD.CHEAT_UP_G = 6001;
gv.CMD.CHEAT_UP_GOLD = 6002;
gv.CMD.CHEAT_UP_TROPHY = 6003;
gv.CMD.CHEAT_UP_EXP_CARD = 6004;
gv.CMD.CHEAT_UP_LEVEL_CARD = 6005;
gv.CMD.CHEAT_UP_LOBBY_CHEST = 6006;
gv.CMD.CHEAT_REDUCE_LOBBY_CHEST_TIME = 6007;

gv.CMD.FIND_MATCH = 9001;
gv.CMD.CANCEL_FIND_MATCH = 9002;

gv.CMD.PLACE_TOWER = 10001;
gv.CMD.PLACE_OPPONENT_TOWER = 10002;
gv.CMD.PLACE_SPELL = 10003;
gv.CMD.PLACE_OPPONENT_SPELL = 10004;
gv.CMD.PLACE_MONSTER = 10005;
gv.CMD.PLACE_OPPONENT_MONSTER = 10006

gv.CMD.START_ROUND = 10007;
gv.CMD.END_MATCH = 10008;

gv.CMD.DROP_TOWER = 10009;
gv.CMD.DROP_OPPONENT_TOWER = 10010;
gv.CMD.UPGRADE_TOWER = 10011;
gv.CMD.UPGRADE_OPPONENT_TOWER = 10012;


gv.CMD.START_OPPONENT_ROUND = 10013;

gv.CMD.GESTURE = 10014;
gv.CMD.OPPONENT_GESTURE = 10015;
gv.CMD.BATTLE_REWARD = 10016;

gv.CMD.START_BATTLE = 11000;



testnetwork = testnetwork||{};
testnetwork.packetMap = {};

/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)
CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendLogin = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack:function(/*userName,*/ userID){
            this.packHeader();
            //this.putString(userName);
            this.putInt(userID);
            this.updateSize();
        }
    }
)

CmdSendResetUserInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.RESET_USER_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendMove = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE);
        },
        pack:function(direction){
            this.packHeader();
            this.putShort(direction);
            this.updateSize();
        }
    }
)
CmdSendLobbyChestInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.LOBBY_CHEST_INFO);
        },
        pack:function(direction){
            this.packHeader();
            this.updateSize();
        }
    }
)
CmdSendChestOpen = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEST_OPEN);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id);
            this.updateSize();
        }
    }
)
CmdSendChestReceive = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEST_RECEIVE);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id);
            this.updateSize();
        }
    }
)
CmdSendChestReceiveNow = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEST_RECEIVE_NOW);
        },
        pack:function(id, g){
            this.packHeader();
            this.putInt(id);
            this.putInt(g);
            this.updateSize();
        }
    }
)
CmdSendInventoryInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.INVENTORY_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)
CmdSendInventoryChangeCard = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.INVENTORY_CHANGE_CARD);
        },
        pack:function(collectionId, battleId){
            this.packHeader();
            this.putInt(collectionId);
            this.putInt(battleId);
            this.updateSize();
        }
    }
)
CmdSendInventoryUpLevelCard = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.INVENTORY_UP_LEVEL_CARD);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id);
            this.updateSize();
        }
    }
)
CmdSendCheatUpG = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_G);
        },
        pack:function(g){
            this.packHeader();
            this.putInt(g);
            this.updateSize();
        }
    }
)
CmdSendCheatUpGold = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_GOLD);
        },
        pack:function(gold){
            this.packHeader();
            this.putInt(gold);
            this.updateSize();
        }
    }
)
CmdSendCheatUpTrophy = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_TROPHY);
        },
        pack:function(trophy){
            this.packHeader();
            this.putInt(trophy);
            this.updateSize();
        }
    }
)
CmdSendCheatUpExpCard = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_EXP_CARD);
        },
        pack:function(id, exp){
            this.packHeader();
            this.putInt(id);
            this.putInt(exp);
            this.updateSize();
        }
    }
)
CmdSendCheatUpLevelCard = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_LEVEL_CARD);
        },
        pack:function(id, level){
            this.packHeader();
            this.putInt(id);
            this.putInt(level);
            this.updateSize();
        }
    }
)
CmdSendCheatUpLobbyChest = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_UP_LOBBY_CHEST);
        },
        pack:function(id, time){
            this.packHeader();
            this.updateSize();
        }
    }
)
CmdSendCheatReduceLobbyChestTime = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CHEAT_REDUCE_LOBBY_CHEST_TIME);
        },
        pack:function(id, time){
            this.packHeader();
            this.putInt(id);
            this.putInt(time);
            this.updateSize();
        }
    }
)

//SHOP
CmdSendShopInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.SEND_SHOP_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)
CmdSendShopChestBuying = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.SHOP_CHEST_BUYING);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id)
            this.updateSize();
        }
    }
)
CmdSendShopCardBuying = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.SHOP_CARD_BUYING);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id)
            this.updateSize();
        }
    }
)
CmdSendShopGoldBuying = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.SHOP_GOLD_BUYING);
        },
        pack:function(id){
            this.packHeader();
            this.putInt(id)
            this.updateSize();
        }
    }
)

CmdSendFindMatch = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.FIND_MATCH);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendCancelFindMatch = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.CANCEL_FIND_MATCH);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendPlaceSpell = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.PLACE_SPELL);
        },
        pack:function(tick, cardId, i, j){
            this.packHeader();
            this.putInt(tick);
            this.putString(cardId);
            this.putDouble(i);
            this.putDouble(j);
            cc.log("Hanh send continue "+ i + " " + j);
            this.updateSize();
        }
    }
)
CmdSendPlaceTower = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.PLACE_TOWER);
        },
        pack:function(tick, cardId, i, j){
            this.packHeader();
            this.putInt(tick);
            this.putString(cardId);
            this.putInt(i);
            this.putInt(j);
            this.updateSize();
        }
    }
)

CmdSendDropTower = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.DROP_TOWER);
        },
        pack: function (tick, i, j) {
            this.packHeader();
            this.putInt(tick);
            this.putInt(i);
            this.putInt(j);
            this.updateSize();
        },
    })

CmdSendPlaceMonster = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.PLACE_MONSTER);
    },
    pack: function(tick, battleId){
        this.packHeader();
        this.putInt(tick);
        this.putString(battleId);
        this.updateSize();
    }
})

CmdSendGesture = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.GESTURE);
    },
    pack: function(tick, monsterId){
        this.packHeader();
        this.putInt(tick);
        this.putString(monsterId);
        this.updateSize();
    }
})



CmdSendStartRound = fr.OutPacket.extend(

    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.START_ROUND);

        },

        pack:function(tick){
            this.packHeader();
            this.putInt(tick);
            this.updateSize();
        }
    }
)

CmdSendUpgradeTower = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.UPGRADE_TOWER);
        },
        pack:function(tick, cardId, i, j){
            this.packHeader();
            this.putInt(tick);
            this.putString(cardId);
            this.putInt(i);
            this.putInt(j);
            this.updateSize();
        }

    })

CmdSendEndMatch = fr.OutPacket.extend({
    ctor:function()
    {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.END_MATCH);
    },

        pack:function(tick){
            this.packHeader();
            this.putInt(tick);
            this.updateSize();
        }
    }
)
CmdSendStartBattle = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.START_BATTLE);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)
/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);


testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.userID = this.getInt();
            this.name = this.getString();
            this.avatar = this.getInt();
            this.trophy = this.getInt();
            this.level = this.getInt();
            this.exp = this.getInt();
            this.gold = this.getInt();
            this.gem = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.LOBBY_CHEST_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.amountOfChest = this.getInt();

            this.chestList = [];
            for(let i = 0; i < this.amountOfChest;i++){
                this.chestList.push({});
                this.chestList[i].id = this.getInt();
                this.chestList[i].type = this.getString();
                this.chestList[i].isOpen = this.getByte();
                this.chestList[i].isReceive = this.getByte();
                this.chestList[i].timeRemaining = this.getInt();

                this.chestList[i].gold = this.getInt();
                this.chestList[i].amountOfTypeCard = this.getInt();
                this.chestList[i].cardList = [];
                for(let j=0;j<this.chestList[i].amountOfTypeCard;j++){
                    this.chestList[i].cardList.push({});
                    this.chestList[i].cardList[j].id = this.getInt();
                    this.chestList[i].cardList[j].amountOfCard = this.getInt();
                }


            }


        }
    }
);

testnetwork.packetMap[gv.CMD.INVENTORY_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function() {
            this.battleNum = this.getInt();
            this.battleCards = [];
            for (let i = 0; i < this.battleNum; ++i) {
                this.battleCards.push({});
                this.battleCards[i].id = this.getInt();
                this.battleCards[i].level = this.getInt();
                this.battleCards[i].exp = this.getInt();
            }

            this.collectionNum = this.getInt();
            this.collectionCards = [];
            for (let i = 0; i < this.collectionNum; ++i) {
                this.collectionCards.push({});
                this.collectionCards[i].id = this.getInt();
                this.collectionCards[i].level = this.getInt();
                this.collectionCards[i].exp = this.getInt();
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.INVENTORY_CHANGE_CARD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function() {
            this.collectionId = this.getInt();
            this.battleId = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.INVENTORY_UP_LEVEL_CARD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
            this.level = this.getInt();
            this.exp = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.CHEST_OPEN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.chestId = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEST_OPEN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.chestId = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEST_RECEIVE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.chestId = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEST_RECEIVE_NOW] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.chestId = this.getInt();
            this.gem = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_G] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.gem = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_GOLD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.gold = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_TROPHY] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.trophy = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_EXP_CARD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
            this.exp = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_LEVEL_CARD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
            this.level = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_UP_LOBBY_CHEST] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            cc.log("error:" + this.getError());
            if(this.getError() == GC.ERROR.SUCCESS){
                this.id = this.getInt();
                this.type = this.getString();
                this.isOpen = false;
                this.isReceive = false;
                this.timeRemaining = 3 * 60 * 60;
                this.gold = this.getInt();
                this.amountOfTypeCard = this.getInt();
                this.cardList = [];
                for (let j = 0; j < this.amountOfTypeCard; j++) {
                    this.cardList.push({});
                    this.cardList[j].id = this.getInt();
                    this.cardList[j].amountOfCard = this.getInt();
                }
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.CHEAT_REDUCE_LOBBY_CHEST_TIME] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
            this.time = this.getInt();
        }
    }
);

// SHOP
testnetwork.packetMap[gv.CMD.SEND_SHOP_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.time = this.getInt();
            this.amountOfChest = this.getInt();
            this.chestList = [];
            for(var i = 0; i < this.amountOfChest; i++){
                this.chestList.push({});
                this.chestList[i].id = this.getInt();
                this.chestList[i].type = this.getString();
                this.chestList[i].isReceived = this.getByte();
                this.chestList[i].price = this.getInt();
                this.chestList[i].gold = this.getInt();
                this.chestList[i].amountOfTypeCards = this.getInt();
                this.chestList[i].cardList = [];
                for(var j=0; j<this.chestList[i].amountOfTypeCards; j++){
                    this.chestList[i].cardList.push({});
                    this.chestList[i].cardList[j].id = this.getInt();
                    this.chestList[i].cardList[j].amountOfCard = this.getInt();
                }
            }

            this.amountOfTypeCard = this.getInt();
            this.cardList = [];

            for(let i=0; i<this.amountOfTypeCard; i++){
                this.cardList.push({});
                this.cardList[i].id = this.getInt();
                this.cardList[i].amountOfCard = this.getInt();
                this.cardList[i].isBoughtCard = this.getByte();
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.SHOP_CHEST_BUYING] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.SHOP_CARD_BUYING] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.SHOP_GOLD_BUYING] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.id = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.FIND_MATCH] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            let error = this.getError();
            if(error == GC.ERROR.SUCCESS) {
                this.avatar = this.getInt();
                this.name = this.getString();
                this.trophy = this.getInt();
                this.systemMonsterTypes = [];
                for(let i = 0; i < 20; ++i){
                    let round = new Array(3);
                    for(let j = 0; j < 3; ++j){
                        round[j] = this.getInt();
                    }
                    this.systemMonsterTypes.push(round);
                }
                this.cardNum = this.getInt();
                this.players = [];
                for(let i = 0; i < 2; ++i){
                    let player = {};
                    player.cardList = new Array(this.cardNum);
                    for(let j = 0; j < this.cardNum; ++j){
                        player.cardList[j] = {};
                        player.cardList[j].battleId = this.getString();
                        player.cardList[j].objectId = this.getInt();
                    }
                    player.map = [];
                    for(let j = 0; j < 6; ++j){
                        let tmp = new Array(8);
                        for(let k = 0; k < 8; ++k){
                            tmp[k] = this.getInt();
                        }
                        player.map.push(tmp);
                    }

                    this.players.push(player);
                }
            }
            else{
                this.status = BattleStatus.readBattleStatus(this);
            }

        }
    }
);
testnetwork.packetMap[gv.CMD.CANCEL_FIND_MATCH] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){

        }
    }
);
testnetwork.packetMap[gv.CMD.PLACE_SPELL] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getDouble();
            this.j = this.getDouble();
            this.status = BattleStatus.readBattleStatus(this);
        }
    }
);
testnetwork.packetMap[gv.CMD.PLACE_OPPONENT_SPELL] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getDouble();
            this.j = this.getDouble();
            this.status = BattleStatus.readBattleStatus(this);
        }
    }
);
testnetwork.packetMap[gv.CMD.PLACE_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getInt();
            this.j = this.getInt();
            if (this.getError() == GC.ERROR.SUCCESS|| this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.PLACE_OPPONENT_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getInt();
            this.j = this.getInt();
            if (this.getError() == GC.ERROR.SUCCESS|| this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }

        }
    }
);

testnetwork.packetMap[gv.CMD.DROP_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){

            this.tick = this.getInt();
            this.i = this.getInt();
            this.j = this.getInt();
            if (this.getError() == GC.ERROR.SUCCESS|| this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.PLACE_MONSTER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
        }
    }
);
testnetwork.packetMap[gv.CMD.PLACE_OPPONENT_MONSTER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.status = BattleStatus.readBattleStatus(this);
        }
    }
);

testnetwork.packetMap[gv.CMD.GESTURE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.monsterId = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.OPPONENT_GESTURE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.status = BattleStatus.readBattleStatus(this);
        }
    }
);

testnetwork.packetMap[gv.CMD.START_ROUND] = fr.InPacket.extend(

    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            //this.tick = this.getInt();
        }
    }
);
testnetwork.packetMap[gv.CMD.DROP_OPPONENT_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){

            this.tick = this.getInt();
            this.i = this.getInt();
            this.j = this.getInt();
            cc.log("Packet User This.getError(): "+this.getError());
            if (this.getError() == GC.ERROR.SUCCESS || this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }

);
testnetwork.packetMap[gv.CMD.END_MATCH] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.hp0 = this.getInt();
            this.hp1 = this.getInt();
            if (this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.UPGRADE_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getInt();
            this.j = this.getInt();
            if (this.getError() == GC.ERROR.SUCCESS || this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.UPGRADE_OPPONENT_TOWER] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.battleId = this.getString();
            this.i = this.getInt();
            this.j = this.getInt();
            if (this.getError() == GC.ERROR.SUCCESS || this.getError() == GC.ERROR.ERROR){
                this.status = BattleStatus.readBattleStatus(this);
            }
        }
    }
);
testnetwork.packetMap[gv.CMD.START_OPPONENT_ROUND] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.tick = this.getInt();
            this.status = BattleStatus.readBattleStatus(this);
        }
    }
);
testnetwork.packetMap[gv.CMD.START_BATTLE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);
testnetwork.packetMap[gv.CMD.BATTLE_REWARD] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.trophy = this.getInt();
            this.isHaveChest = this.getInt();
            this.chest = {};
            if (this.isHaveChest == 1){
                this.chest.isOpen = false;
                this.chest.id = this.getInt();
                this.chest.type = this.getString();
                this.chest.timeRemaining = this.getInt();
                cc.log("this.timeRemaining: "+this.timeRemaining);
                this.chest.gold = this.getInt();
                this.chest.amountOfTypeCards = this.getInt();
                this.chest.cardList = [];
                for(var j=0; j<this.chest.amountOfTypeCards; j++){
                    this.chest.cardList.push({});
                    this.chest.cardList[j].id = this.getInt();
                    this.chest.cardList[j].amountOfCard = this.getInt();
                }

            }

        }
    }
);

