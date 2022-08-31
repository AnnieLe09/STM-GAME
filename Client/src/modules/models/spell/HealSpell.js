var HealSpell = Spell.extend({
    ctor:function(){
        this._super(2);
        this.effectTick = 4 * GC.BATTLE.TICK_PER_SECOND;
        this.range = 0.8;
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    update:function (monsters, towers){
        //cc.log("HealSpell update: " + this.curPos.x + " " + this.curPos.y);
        if(this.leftTick > 0){
            for(let i = 0; i < monsters.length; ++i){
                let monster = monsters[i];
                if (Helper.getDistance(this.curPos, monster.curPos) <= this.range && monster.isBuffBySpell(this) == false) {
                    monster.addSpell(this);
                }
            }
            this.leftTick -= 1;
            return true;
        }
        else {
            if(this.ui){
                this.ui.removeFromParent();
            }
            return false;
        }
    },
    removeEffect:function (object){

    },
    doAction:function (object){
        if(object.getEffectTick(this) % 6 == 0){
            object.heal(2);
        }
    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    doEffect:function (monster){

    },
    initAnim:function (){
        let path = this.animPath;
        this.anim = new sp.SkeletonAnimation(path + ".json", path + ".atlas");
        this.anim.setAnchorPoint(cc.p(0.5, 0.5));
        this.anim.setPosition(cc.p(0, 0));
        this.anim.setAnimation(0, this.animArr[0], true);
        this.anim.update(0.0);
        return this.anim;
    }
});
