var Buff = cc.Class.extend({
    ctor:function(buffType, buffTypeOrder){
        this.buffType = buffType;
        this.buffTypeOrder = buffTypeOrder;
        this.isActive = true;
        this.battleId = null;  //rewrite
        this.effectList = [];
        this.effectList.push(null);
        this.timeRemaining = 1000000000;
        this.stat = 1;
    },
    addEffect:function (effect){
        this.effectList.push(effect);
    },
    updateBuff: function (){

        //abstract
    },
    setActive: function (flag){
        this.isActive = flag;
    },
    setBattleId: function(battleId){
        this.battleId = battleId;
    },
    getName: function (){
        return this.effectList[this.stat].name;
    },
    getValue: function (){
        return this.effectList[this.stat].value;
    },
    parse: function (buffPk){
        this.buffType = buffPk.buffType;
        this.buffTypeOrder = buffPk.buffTypeOrder;
        this.isActive = buffPk.isActive;
        this.effectList = buffPk.effectList;
        this.timeRemaining = buffPk.timeRemaining;
        this.stat = buffPk.stat;
    }
});
