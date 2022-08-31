var TrapSpell = Spell.extend({
    ctor:function(){
        this._super(4);
        this.effectTick = 30;
        this.range = 0.2;
        this.leftTick = 30;
        this.animTick = 1;
    },
    setUI:function (spellUI){
        this.ui = spellUI;
    },
    update:function (monsters, towers){
        cc.log("TrapSpell update:" + this.leftTick + ", curpos: " + this.curPos.x + " " + this.curPos.y);
        if(this.leftTick > 0){
            if(this.animTick > 0){
                for(let i = 0; i < monsters.length; ++i){
                    let monster = monsters[i];
                    if(!monster.isFlying){
                        if (Helper.getDistance(this.curPos, monster.curPos) <= this.range && monster.isBuffBySpell(this) == false) {
                            monster.addSpellWithTick(this, this.leftTick + this.effectTick);
                            this.doEffect(monster);
                            this.animTick--;
                            break;
                        }
                    }
                }
            }
            else{
                for(let i = 0; i < monsters.length; ++i){
                    let monster = monsters[i];
                    if(!monster.isFlying){
                        if (Helper.getDistance(this.curPos, monster.curPos) <= this.range && monster.isBuffBySpell(this) == false) {
                            monster.addSpellWithTick(this, this.leftTick - 1 + this.effectTick);
                            this.doEffect(monster);
                        }
                    }
                }
                if(this.leftTick >= 30){
                    this.anim.runAction(this.createAnimation(0, 10));
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
        object.flyToStartPos();
    },
    doAction:function (object){
        if(object.getEffectTick(this) == this.effectTick){
            object.setFlyingStatus(this.effectTick);
        }
    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    doEffect:function (monster){
        //monster.setFlyingStatus(this.effectTick);
        monster.hitBullet(20);
    },
    initAnim:function (){
        this.anim = cc.Sprite.create(this.animPath + "image0000.png");
        this.anim.setAnchorPoint(cc.p(0.5, 0.5));
        this.anim.setScale(0.5);
        return this.anim;
    },
    createAnimation:function(startIdx, endIdx){
        cc.spriteFrameCache.addSpriteFrames(this.animPath + "trap_anim.plist");
        let animFrames = [];
        let str = "";
        let frame;
        for(let i = startIdx; i <= endIdx; ++i){
            str = "image00" + (i < 10 ? ("0" + i) : i) + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        return cc.animate(new cc.Animation(animFrames, this.effectTick / 60));
    },
});