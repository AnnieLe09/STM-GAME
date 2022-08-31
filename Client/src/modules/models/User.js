var User = cc.Class.extend({
    ctor:function(avatar, name, trophy, level, exp, gold, gem, inventory, chests){
        this.avatar = avatar;
        this.name = name;
        this.trophy = trophy;
        this.level = level;
        this.exp = exp;
        this.gold = gold;
        this.gem = gem;
        this.battleCards = [];
        this.collectionCards = [];
        this.chests = chests;
        this.goldObservers = [];
        this.gemObservers = [];
        this.trophyObservers = [];
    },
    registerUserGold:function(object){
        this.goldObservers.push(object);
    },
    updateGold:function(gold){
        this.gold = gold;
        for(let i = 0; i < this.goldObservers.length; ++i){
            this.goldObservers[i].changeUserGold(gold);
        }
    },
    registerUserGem:function(object){
        this.gemObservers.push(object);
    },
    updateGem:function(gem){
        this.gem = gem;
        for(let i = 0; i < this.gemObservers.length; ++i){
            this.gemObservers[i].changeUserGem(gem);
        }
    },
    registerUserTrophy:function(object){
        this.trophyObservers.push(object);
    },
    updateTrophy:function(trophy){
        this.trophy = trophy;
        for(let i = 0; i < this.trophyObservers.length; ++i){
            this.trophyObservers[i].changeUserTrophy(trophy);
        }
    },
    removeChest:function(chest){
        chest.removeSelf();
        Helper.removeFromArray(this.chests, chest);
    },
    switchCards:function(battleIdx, collectionIdx){
        let tmp = this.battleCards[battleIdx];
        this.battleCards[battleIdx] = this.collectionCards[collectionIdx];
        this.collectionCards[collectionIdx] = tmp;
        Helper.getLayer("inventory").changeCards();
    }
});
User.parse = function (packet){
    let user = new User();
    user.userID = packet.userID;
    user.name = packet.name;
    user.avatar = packet.avatar;
    user.trophy = packet.trophy;
    user.level = packet.level;
    user.exp = packet.exp;
    user.gold = packet.gold;
    user.gem = packet.gem;
    //user.battleCards = [new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12), new Card(0, 1, 12)];
    //user.collectionCards = [new Card(0, 2, 5), new Card(0, 7, 123), new Card(0, 1, 12)];
    user.chests = null;
    return user;
}