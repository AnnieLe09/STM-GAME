var Card = cc.Class.extend({
    ctor:function(id, level, exp){
        this.id = id; // index cua mang 3 loai
        this.name = GC.CARD.NAMES[id]; // id cuc bo cua tung loai
        this.type = GC.CARD.TYPES[id]; // loai TOWER MONSTER SPELL
        this.object = Helper.createObject(this.type, this.name);
        this.level = level;
        this.exp = exp;
        this.stat = Helper.findStat(level);
        this.levelObservers = [];
    },
    registerCardLevel:function(object){
        this.levelObservers.push(object);
    },
    unregisterCardLevel:function(object){
        Helper.removeFromArray(this.levelObservers, object);
    },
    updateLevel:function(level, exp){
        if(level <= GC.CARD.MAX_LEVEL && exp >= 0) {
            this.level = level;
            this.exp = exp;
            for (let i = 0; i < this.levelObservers.length; ++i) {
                this.levelObservers[i].changeCardLevel(level, exp);
            }
        }
    },
    setBattleId:function(id){
        this.battleId = id;
        this.object.setBattleId(id);
    }
});
Card.parse = function(packet){
    return new Card(packet.id, packet.level, packet.exp);
};