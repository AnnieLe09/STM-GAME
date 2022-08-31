var TowerCellBuff = TowerBuff.extend({
    ctor: function (towerBuffType, cell) {
        this._super(towerBuffType,1);
        this.cell = cell;
        this.battleId = "TowerCellBuff_" + this.towerBuffType;
    },
    updateBuff: function (dt){
        this.isActive = true;
    }
})