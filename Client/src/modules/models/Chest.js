var Chest = cc.Class.extend({
    ctor:function(id, type, status, remainingTime, gold, cards){ // With chest in shop, remainingTime is price of chest
        this.id = id;
        this.type = type;
        this.status = status;
        this.remainingTime = remainingTime;
        this.price = this.getPrice();
        this.gold = gold;
        this.cards = cards;
        this.statusObservers = [];
        this.timeObservers = [];
        let config = GC.CHEST.TREASURES[type];
        ConfigLoader.load(this, config);
    },
    getPrice:function(){
        return Math.ceil(this.remainingTime / GC.CHEST.SECOND_PER_COIN);
    },
    registerChestStatus:function(object){
        this.statusObservers.push(object);
    },
    unregisterChestStatus:function(object){
        Helper.removeFromArray(this.statusObservers, object);
    },
    registerChestTime:function(object){
        this.timeObservers.push(object);
    },
    unregisterChestTime:function(object){
        Helper.removeFromArray(this.timeObservers, object);
    },
    updateItemStatusBought:function(){
        for(let i = 0; i < this.statusObservers.length; ++i){
            this.statusObservers[i].changeItemStatus(1);
        }
    },
    updateStatus:function(status){
        this.status = status;
        for(let i = 0; i < this.statusObservers.length; ++i){
            this.statusObservers[i].changeChestStatus(status);
        }
    },
    updateTime:function(time){
        if(time == 0){
            this.updateStatus(GC.CHEST.STATUS.FINISHED);
        }
        this.price = this.getPrice();
        if(time >= 0){
            this.remainingTime = time;
            for(let i = 0; i < this.timeObservers.length; ++i){
                this.timeObservers[i].changeChestTime(time);
            }
        }
    },
    removeSelf:function(){
        for(let i = 0; i < this.statusObservers.length; ++i){
            this.statusObservers[i].removeChest();
        }
    },

});
Chest.parse = function(packet){
    let status = 0;
    let remainingTime = packet.timeRemaining;
    cc.log("remaining Time"+packet.timeRemaining + " " +  remainingTime);
    if(packet.isOpen){
        if(remainingTime == 0){
            status = GC.CHEST.STATUS.FINISHED;
        }
        else{
            status = GC.CHEST.STATUS.OPENING;
        }
    }
    else{
        status = GC.CHEST.STATUS.WAITING;
    }
    return new Chest(packet.id, "0", status, remainingTime, packet.gold, packet.cardList);
}