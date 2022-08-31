var SpellFactory = cc.Class.extend({
});
SpellFactory.classes =  [FireballSpell, FrozenSpell, HealSpell, SpeedUpSpell, TrapSpell, PowerSpell];
SpellFactory.create = function(id){
    cc.log("SpellFactory: create spell id");
    return new (this.classes[id])();
};
SpellFactory.parse = function (packet){
    let spell = SpellFactory.create(packet.objectId);
    spell.setBattleId(packet.battleId);
    let curPos = packet.curPos;
    spell.curPos = cc.p(curPos.x, curPos.y);
    spell.leftTick = packet.leftTick;
    return spell;
};