var TowerBuff = Buff.extend({
    ctor: function (towerBuffType,numEffect = 3) {
        this._super(GC.TOWERBUFF.ID,towerBuffType);
        this.towerBuffType = towerBuffType;
        ConfigLoader.load(this, GC.TOWERBUFF.LIST[towerBuffType]);
        this.readTowerBuff(numEffect);
    },
    readTowerBuff: function (numEffect){
        for(let i = 1; i <= numEffect; i++){
            this.name = "";
            this.type = "";
            this.value = 0;
            ConfigLoader.load(this, this.effects["" + i]);
            //cc.log("TowerBuff "+this.name + " " +this.type + " "+this.value);
            //cc.log("TowerBuff "+this.durationType);
            //cc.log("TowerBuff "+this.effects[i] + " 99 " + this.effects[i]);
            let effect = new Effect(this.name,this.type,this.value)
            this.addEffect(effect);
        }
    }
})