var Spell = cc.Class.extend({
    ctor: function (id) {
        cc.log("====Spell");
        this.init(id);
    },
    init:function (id){
        this.type = id;
        this.statNum = 1;
        this.curStat = 1;
        this.curDir = 0;
        this.isActive = false;
        cc.log("id = "+id);
        ConfigLoader.load(this, GC.SPELL.LIST["" + id]);
        ConfigLoader.load(this, GC.SPELL.LIST["" + id].action);
        this.range = 2;
        this.duration /= 1000;
        this.leftTick = this.duration * GC.BATTLE.TICK_PER_SECOND;
        cc.log("duration: " + this.duration);
        cc.log("leftTick: " + this.leftTick);
        this.effectTick = 0;
        this.curPos = cc.p(0, 0);
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    removeEffect:function (object){

    },
    update: function (monsters, towers){
        cc.log("Spell update");
        return false;
    },
    doAction:function (object){

    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    }
});