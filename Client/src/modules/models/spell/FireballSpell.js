var FireballSpell = Spell.extend({
    ctor:function(){
        //Spell.prototype.ctor(3).call();
        //this.init(3);
        this._super(0);
        this.effectTick = 1;
        this.range = 0.8;
        this.leftTick = 1;
        this.animTick = 30;
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    update:function (monsters, towers){
        cc.log("FireballSpell update:" + this.leftTick + ", curpos: " + this.curPos.x + " " + this.curPos.y);
        if(this.leftTick > 0){
            if(this.animTick > 0){
                this.animTick--;
            }
            else{
                for(let i = 0; i < monsters.length; ++i){
                    let monster = monsters[i];
                    if (Helper.getDistance(this.curPos, monster.curPos) <= this.range && monster.isBuffBySpell(this) == false) {
                        monster.addSpell(this);
                        this.doEffect(monster);
                    }
                }
                this.leftTick -= 1;
            }

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

    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    doEffect:function (monster){
        monster.hitBullet(50);
    },
    initAnim:function (){
        let path = this.animPath;
        this.anim = new sp.SkeletonAnimation(path + ".json", path + ".atlas");
        this.anim.setAnchorPoint(cc.p(0.5, 0.5));
        this.anim.setPosition(cc.p(0, 100));
        //this.anim.setAnimation(0, "animation_ice_ball", false);
        this.anim.addAnimation(0,"animation_fireball", false, 0);
        this.anim.addAnimation(0,"animation_full", true, 0.3);
        this.anim.update(0.0);
        let action = cc.MoveBy.create(0.3, cc.p(0, -100));
        this.anim.runAction(action);
        /*this.anim.scheduleOnce(function(){
            this.setAnimation(0, "animation_bottom", true);
        }, 0.5);*/
        return this.anim;
    }
});