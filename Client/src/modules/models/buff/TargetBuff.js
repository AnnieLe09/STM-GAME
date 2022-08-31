var TargetBuff = Buff.extend({
    ctor: function (targetBuffType,numEffect = 3) {
        this._super(GC.TARGETBUFF.ID,targetBuffType);
        this.towerBuffType = targetBuffType;
        ConfigLoader.load(this, GC.TARGETBUFF.LIST[targetBuffType]);
        this.readTargetBuff(numEffect);
        this.stat = 1;   //rewrite
        this.battleId = ""; //rewrite
    },
    readTargetBuff: function (numEffect){
        for(let i = 1; i <= numEffect; i++){
            this.name = "";
            this.type = "";
            this.value = 0;
            ConfigLoader.load(this, this.effects["" + i]);
            //cc.log("TargetBuff "+this.name + " " +this.type + " "+this.value);
            //cc.log("TargetBuff "+this.durationType);
            //cc.log("TargetBuff "+this.effects[i] + " 99 " + this.effects[i]);
            let effect = new Effect(this.name,this.type,this.value)
            this.addEffect(effect);
        }
    },
    getDuration: function (stat = 1){
        return this.duration[""+stat];
    },
    setStat: function (stat){
        this.stat = stat;
    },
    startTimeRemaining: function (){
        this.timeRemaining = this.duration[""+this.stat] * 1.0 / 1000;
    },

    updateBuff: function (){
        var dt = 1/GC.BATTLE.TICK_PER_SECOND;
        if (this.timeRemaining < dt){
            this.timeRemaining = 0;
            this.isActive = false;
        }
        else {
            this.timeRemaining -= dt;
        }
    },

})