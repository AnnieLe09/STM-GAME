var TowerFactory = cc.Class.extend({
});
TowerFactory.create = function(id){
    cc.log("TowerFactory: create tower id");
    var tower = new Tower(id);
    if (tower.archetype == GC.TOWER.TYPES.DAMAGE || tower.archetype == GC.TOWER.TYPES.MAGIC){
        return new AttackTower(id);
    }
    if (tower.archetype == GC.TOWER.TYPES.SUPPORT){
        return new SupportTower(id);
    }
    return null;
}