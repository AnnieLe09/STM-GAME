var TowerStat = cc.Class.extend({
    ctor: function (id, statNum) {
        //ConfigLoader.load(this, GC.TOWER.LIST[id]);
        ConfigLoader.load(this, GC.TOWER.LIST[id].stat["" + statNum]);
    },
});