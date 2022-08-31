var WalkMonster = Monster.extend({
    ctor: function(id, isMyMap, hpRate, isSystemMonster, battleObjectId){
        this._super(id, isMyMap, hpRate, isSystemMonster, battleObjectId);
        //Add By HanhND2--------
        this.isAlive = true;
        //-------------------

        //LA
        this.isFlying = 0;


        if (id == 5){
            this.attackType = GC.BOSS.ATTACK.ONLY;
        }

        else if(id == 6){
            this.bossSkill = GC.BOSS.SKILL.DEMON_TREE;
            this.counter = 60;

            this.fx.zIndex = -1;
        }

        else if(id == 7){
            this.bossSkill = GC.BOSS.SKILL.DESERT_KING;
            this.counter = 0;

            var desert_king_fx = new sp.SkeletonAnimation(res.JSON_DESERT_KING, res.ATLAS_DESERT_KING);
            this.addChild(desert_king_fx);
            desert_king_fx.setNormalizedPosition(0.5,0.5);
            desert_king_fx.setAnimation(0, 'fx_back', true);
            desert_king_fx.zIndex = -1;
        }

        else if(id == 9){
            this.bossSkill = GC.BOSS.SKILL.GOLEM;
        }

        else if (id == 11) {
            this.bossSkill = GC.BOSS.SKILL.MOC_TINH;
            this.counter = 0;

            this.moc_tinh_fx = new sp.SkeletonAnimation(res.JSON_MOC_TINH, res.ATLAS_MOC_TINH);
            this.addChild(this.moc_tinh_fx);
            this.moc_tinh_fx.setNormalizedPosition(0.5, 0.5);
            this.moc_tinh_fx.setAnimation(0, 'fx_back', true);
            this.moc_tinh_fx.zIndex = -1;
        }
    },

    getCurrPos:function(){
        if(this.isMyMap){
            var x = Math.floor(Math.round(this.posX*1000/GC.MAP.CELL.P_WIDTH)/1000);
            var y = Math.floor(Math.round(this.posY*1000/GC.MAP.CELL.P_HEIGHT)/1000);
        }
        else{
            var x = Math.floor(Math.round(((GC.MAP.WIDTH-1)*GC.MAP.CELL.P_WIDTH - this.posX)*1000/GC.MAP.CELL.P_WIDTH)/1000);
            var y = Math.floor(Math.round(((GC.MAP.HEIGHT-1)*GC.MAP.CELL.P_HEIGHT - this.posY)*1000/GC.MAP.CELL.P_HEIGHT)/1000);
        }
        return cc.p(x,y);
    },

    findPath: function(){
        var startPos = this.getCurrPos();
        this.path = Helper.getCurvePoint(Helper.bfsShortedPath(startPos, this.endPosition, this.cellMatrix, this.curr_direction));

        // for(var i = 0; i < this.path.length; i++){
        //     this.path[i].addChild(new Assasin());
        // };

        this.next_cell = 0;
        this.next_pos = this.path[this.next_cell].posInMap;

        /*if (this.next_cell < this.path.length - 1){
            var next_dir = this.getDirection(this.next_pos, this.path[this.next_cell+1].posInMap);
            if(next_dir != this.curr_direction){
                this.makeDeltaMove(next_dir);
            }
        }*/
    },

    makeDeltaMove: function(next_dir){
        var point = Helper.convertPoint2Pixel(this.next_pos, this.isMyMap);

        if(this.curr_direction == GC.MONSTER.DIRECTION.DOWN){
            if(this.posY < point.y){
                this.changeAnim(GC.MONSTER.DIRECTION.UP);
                
            }
            else if(next_dir == GC.MONSTER.DIRECTION.UP){
                this.changeAnim(next_dir)
                this.next_cell++;
                this.next_pos = this.path[this.next_cell].posInMap;
            }
        }
        else if(this.curr_direction == GC.MONSTER.DIRECTION.UP){
            if(this.posY > point.y){
                this.changeAnim(GC.MONSTER.DIRECTION.DOWN);
            }
            else if(next_dir == GC.MONSTER.DIRECTION.DOWN){
                this.changeAnim(next_dir)
                this.next_cell++;
                this.next_pos = this.path[this.next_cell].posInMap;
            }
        }
        else if(this.curr_direction == GC.MONSTER.DIRECTION.LEFT){
            if(this.posY < point.x){
                this.changeAnim(GC.MONSTER.DIRECTION.RIGHT);
            }
            else if(next_dir == GC.MONSTER.DIRECTION.RIGHT){
                this.changeAnim(next_dir)
                this.next_cell++;
                this.next_pos = this.path[this.next_cell].posInMap;
            }
        }
        else if(this.curr_direction == GC.MONSTER.DIRECTION.RIGHT){
            if(this.posX > point.x){
                this.changeAnim(GC.MONSTER.DIRECTION.LEFT);
            }
            else if(next_dir == GC.MONSTER.DIRECTION.LEFT){
                this.changeAnim(next_dir)
                this.next_cell++;
                this.next_pos = this.path[this.next_cell].posInMap;
            }
        }
    },

    updateBossSkill:function(){
        if(this.bossSkill == GC.BOSS.SKILL.DEMON_TREE){
            this.counter--;
            if(this.counter == 0){
                var monsterList = this.player.monsterInMapList;

                for(var i = 0; i < monsterList.length; i++){
                    var monster = monsterList[i];
                    if(monster != this){
                        if (Helper.getDistance(this.getLogicPoint(), monster.getLogicPoint()) <= GC.BOSS.DEMON_TREE.RANGE) {
                            monster.healing(GC.BOSS.DEMON_TREE.HP_RATE);
                        }
                    }
                    else {
                        this.fx.setAnimation(0, 'fx_back', false);
                    }
                    
                }
                this.counter = 60;
            }
        }
        
        else if(this.bossSkill == GC.BOSS.SKILL.DESERT_KING) {
            this.counter++;

            var monsterList = this.player.monsterInMapList;

            if (this.counter % 10 == 0){
                for(var i = 0; i < monsterList.length; i++){
                    var monster = monsterList[i];
                    if(monster != this){
                        if (Helper.getDistance(this.getLogicPoint(), monster.getLogicPoint()) <= GC.BOSS.DEMON_TREE.RANGE) {
                            monster.counter = -1;
                        }
                        else {
                            monster.counter = 0;
                        }
                    }
                    
                }            
            }
        }

        else if(this.bossSkill == GC.BOSS.SKILL.MOC_TINH) {
            if (this.counter <= GC.BOSS.MOC_TINH.MAX_MINION*GC.BOSS.MOC_TINH.TIME_TO_RELEASE)
            this.counter++;

        }
    }
});