var SpellTowerBuff = Buff.extend({
    ctor: function (spellTowerBuffType) {
        this._super(GC.SPELLTOWERBUFF.ID);
        this.spellTowerBuffType = spellTowerBuffType;
        //ConfigLoader.load(this, GC.TOWERBUFF.LIST[towerBuffType]);
    },
})