var SpellUI = cc.Sprite.extend({
    ctor:function(spell){
        this._super();
        this.spell = spell;
        this.initAnim(spell);
    },
    initAnim:function(spell){
        /*let path = spell.animPath;
        this.anim = new sp.SkeletonAnimation(path + ".json", path + ".atlas");
        this.anim.setAnchorPoint(cc.p(0.5, 0.5));
        this.anim.setPosition(cc.p(0, 0));
        this.anim.setAnimation(0, spell.animArr[0], true);
        this.anim.update(0.0);
        this.addChild(this.anim);*/
        this.anim = spell.initAnim();
        this.addChild(this.anim);
        //this.width = this.anim.width;
        //this.height = this.anim.height;
    },
    setCustomScale:function (cellSize){
        cc.log("cell size: " + cellSize);
        this.anim.setScale(this.spell.range * cellSize * 2 * 4  / 3 / this.anim.getBoundingBox().width); // can sua
        //this.anim.y += cellSize;
    }
});