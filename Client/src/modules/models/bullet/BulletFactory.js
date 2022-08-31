var BulletFactory = cc.Class.extend({
});
BulletFactory.create = function(tower){
    if (tower.archetype == GC.TOWER.TYPES.MAGIC){
        return new MagicBullet(tower);
    }
    if (tower.bulletType == GC.TOWER.BULLET_TYPES.CHASING){
        return new ChasingBullet(tower);
    }
    if (tower.bulletType == GC.TOWER.BULLET_TYPES.BOOMERANG){
        return new BoomerangBullet(tower);
    }
    if (tower.bulletType == GC.TOWER.BULLET_TYPES.POSITION){
        return new PositionBullet(tower);
    }
    return null;
}