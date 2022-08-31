var PowerSpell = Spell.extend({
    ctor:function(){
        //Spell.prototype.ctor(3).call();
        //this.init(5);
        this._super(5);
        this.effectTick = 15 * GC.BATTLE.TICK_PER_SECOND / 10;
        this.range = 0.6;
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    update:function (monsters, towers){
        //cc.log("SpeedUpSpell update:" + this.leftTick);
        if(this.leftTick > 0){
            for(let i = 0; i < towers.length; ++i){
                let tower = towers[i];
                if (Helper.getDistance(this.curPos, tower.logicPoint) <= this.range && tower.isBuffBySpell(this) == false) {
                    tower.addSpell(this);
                    tower.increaseDamage(this.battleId, 1.5);
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
        object.removeDamage(this.battleId);
    },
    doAction:function (object){

    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    doEffect:function (tower){
        tower.increaseDamage(this.battleId, 1.5);
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