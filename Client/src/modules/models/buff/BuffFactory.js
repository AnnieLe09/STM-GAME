var BuffFactory = cc.Class.extend({
});
BuffFactory.create = function(buffType, buffTypeOrder){
    cc.log("-------------------- "+buffType+" "+GC.TOWERBUFF.ID+"------------------------------");
    if (buffType == GC.TOWERBUFF.ID){
        cc.log("---------------------AAAA------------------------------");
        if (buffTypeOrder < 3){
            return new TowerCellBuff(buffTypeOrder);
        }
        else{

            return new TowerBuff(buffTypeOrder);
        }
    }
    if (buffType == GC.TOWERBUFF.ID){
        return new SpellTowerBuff(buffTypeOrder);
    }
    if (buffType == GC.TARGETBUFF.ID){
        return new TargetBuff(buffTypeOrder);
    }

    return null;
}