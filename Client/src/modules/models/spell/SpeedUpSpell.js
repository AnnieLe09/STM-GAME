var SpeedUpSpell = Spell.extend({
    ctor:function(){
        //Spell.prototype.ctor(3).call();
        //this.init(3);
        this._super(3);
        this.effectTick = 4 * GC.BATTLE.TICK_PER_SECOND;
        this.range = 0.8;
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    update:function (monsters, towers){
        //cc.log("SpeedUpSpell update:" + this.leftTick);
        if(this.leftTick > 0){
            for(let i = 0; i < monsters.length; ++i){
                let monster = monsters[i];
                if (Helper.getDistance(this.curPos, monster.curPos) <= this.range && monster.isBuffBySpell(this) == false) {
                    monster.addSpell(this);
                    monster.speedUp(1.5);
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
        object.speedUp(1 / 1.5);
    },
    doAction:function (object){

    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    doEffect:function (monster){
        monster.speedUp(1.5);
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