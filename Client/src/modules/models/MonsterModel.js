var MonsterModel = cc.Class.extend({
    ctor: function(id){
        this.type = id;
        ConfigLoader.load(this, GC.MONSTER.monster[id]);
    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
});