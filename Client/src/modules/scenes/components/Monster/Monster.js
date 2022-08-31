var Monster = cc.Sprite.extend({
    ctor:function(id, isMyMap, hpRate, isSystemMonster, battleObjectId){
        this._super();

        ConfigLoader.load(this, GC.MONSTER.monster[id]);

        // init Heal
        var healBg = new cc.Sprite(res.HP_BACK_GROUND);
        healBg.setAnchorPoint(0.5, 0.5);
        healBg.setNormalizedPosition(0.5, 0.95);
        healBg.setScaleX(0.5)
        this.addChild(healBg);
        this.healSprite = new cc.ProgressTimer(new cc.Sprite(res.HP_SPRITE));
        this.healSprite.midPoint = cc.p(0, 0);
        this.healSprite.barChangeRate = cc.p(1, 0);
        this.healSprite.setNormalizedPosition(0.5,0.5);
        this.healSprite.type = cc.ProgressTimer.TYPE_BAR;
        this.healSprite.setPercentage(100);
        healBg.addChild(this.healSprite);

        // Check drop monster
        if (!isSystemMonster){
            var enemyCircle = new sp.SkeletonAnimation(res.enemy_cicle_spine_json, res.enemy_cicle_spine_atlas);
            this.addChild(enemyCircle);
            enemyCircle.setScale(0.5);
            enemyCircle.setNormalizedPosition(0.5,0.5);
            enemyCircle.zIndex = -1;
            
            if(isMyMap){
                enemyCircle.setAnimation(0, 'enemy_circle', true);
            }
            else {
                enemyCircle.setAnimation(0, 'user_circle', true);
            }
        }


        this.battleObjectId = battleObjectId;

        this.isMyMap = isMyMap;
        this.isAlive = true;
        this.wentHome = false;

        this.type = id; 

        if(hpRate){
            this.hp = this.hp * hpRate;
        }
        
        if (isSystemMonster){
            this.isSystemMonster = true;
        }
        else {
            this.isSystemMonster = false;
        }

        this.currHp = this.hp;
        this.curSpeed = this.speed

        this.setAnchorPoint(0.5,0.5);

        this.animationList = [];
        this.initAnimationList(id);

        //Set player
        if(this.isMyMap){
            this.player = gv.battleController.players[0];
        }
        else{
            this.player = gv.battleController.players[1];
        }
        // this.speed = this.speed*GC.MAP.CELL.P_WIDTH;
        // this.delay_per_frame = this.speed;

        this.path = null;

        //LA
        this.spells = [];
        this.curPos = cc.p(0.5, 0.5);
        this.isActive = true;
        this.status = GC.MONSTER.STATUS.NORMAL;
        this.collistionVec = {v: -1, t: -1, d: -1};
        //this.collisionRadius = this.hitRadius / 2;
        this.collisionMonster = null;
        this.passingPoint = null;
        this.eps = 0.0001;
        //HA
        this.buffs = [];
        this.slowByBuff = 1.0;

        // Type
        this.attackType = GC.BOSS.ATTACK.NORMAL;
        this.bossSkill = GC.BOSS.SKILL.NO_SKILL;
        this.counter = 0;

        this.fx = new sp.SkeletonAnimation(res.JSON_DEMON_TREE, res.ATLAS_DEMON_TREE);
        this.addChild(this.fx);
        this.fx.setNormalizedPosition(0.5,0.5);

        // this.addBalloon(5);
        this.balloon = null;
    },


    setMonsterPosition:function(x, y){
        this.posX = x;
        this.x = x;
        
        this.posY = y;
        this.y = y;
        
    },

    initAnimationList: function(id){
        // 0 is up, 1 is down, 2 is right, 3 is top-right, 4 is bottom-right.
        var frames = [];
        for(var i = resFrame.MONSTER_SPRITE[id].UP.BEGIN; i <= resFrame.MONSTER_SPRITE[id].UP.END; i++){
            var sprite = resFrame.MONSTER_SPRITE[id].PREFIX + Helper.pad4(i) + resFrame.MONSTER_SPRITE[id].POSTFIX;
            frames.push(cc.spriteFrameCache.getSpriteFrame(sprite));
        }
        this.animationList.push(frames);

        frames = [];
        for(var i = resFrame.MONSTER_SPRITE[id].DOWN.BEGIN; i <= resFrame.MONSTER_SPRITE[id].DOWN.END; i++){
            var sprite = resFrame.MONSTER_SPRITE[id].PREFIX + Helper.pad4(i) + resFrame.MONSTER_SPRITE[id].POSTFIX;
            frames.push(cc.spriteFrameCache.getSpriteFrame(sprite));
        }
        this.animationList.push(frames);

        frames = [];
        for(var i = resFrame.MONSTER_SPRITE[id].RIGHT.BEGIN; i <= resFrame.MONSTER_SPRITE[id].RIGHT.END; i++){
            var sprite = resFrame.MONSTER_SPRITE[id].PREFIX + Helper.pad4(i) + resFrame.MONSTER_SPRITE[id].POSTFIX;
            frames.push(cc.spriteFrameCache.getSpriteFrame(sprite));
        }
        this.animationList.push(frames);

        frames = [];
        for(var i = resFrame.MONSTER_SPRITE[id].RIGHT_UP.BEGIN; i <= resFrame.MONSTER_SPRITE[id].RIGHT_UP.END; i++){
            var sprite = resFrame.MONSTER_SPRITE[id].PREFIX + Helper.pad4(i) + resFrame.MONSTER_SPRITE[id].POSTFIX;
            frames.push(cc.spriteFrameCache.getSpriteFrame(sprite));
        }
        this.animationList.push(frames);

        frames = [];
        for(var i = resFrame.MONSTER_SPRITE[id].RIGHT_DOWN.BEGIN; i <= resFrame.MONSTER_SPRITE[id].RIGHT_DOWN.END; i++){
            var sprite = resFrame.MONSTER_SPRITE[id].PREFIX + Helper.pad4(i) + resFrame.MONSTER_SPRITE[id].POSTFIX;
            frames.push(cc.spriteFrameCache.getSpriteFrame(sprite));
        }
        this.animationList.push(frames);
    },
    getLogicDirection:function (dir){
        if(this.isMyMap) return dir;
        return this.getOppositeDirection(dir);
    },
    findPath:function(){
        // Abstract class
    },
    // setPlayer:function (player){
    //   this.player = player;
    // },
    setState: function(monster){
        this.hp = monster.hp;
        this.currHp = monster.currHp;
        this.healSprite.setPercentage(this.currHp/this.hp*100);
        
        this.speed = monster.speed;
        this.curSpeed = monster.curSpeed;

        this.counter = monster.counter;
        //LA
        // this.player = player;
        this.status = monster.status;
        this.isActive = monster.isActive;
        this.collistionVec = monster.collistionVec;
        this.passingPoint = monster.passingPoint;
        // log("BEFORE ==================== (" + this.x + ', ' + this.y);
        var monsterP = cc.p(monster.x, monster.y);
        var monsterP2 = Helper.convertLogicPointToMapPixel(monsterP, this.isMyMap);
        this.setMonsterPosition(Math.round(monsterP2.x * 1000)/1000, Math.round(monsterP2.y*1000)/1000);
        this.curPos.x = monster.x;
        this.curPos.y = monster.y;
        // log("AFTER ==================== (" + this.x + ', ' + this.y);

        if(this.isMyMap){
            if (this.curr_direction != monster.curDir){
                this.changeAnim(monster.curDir);
            }
        }
        else{
            var dir = Helper.reverseDir(monster.curDir)
            if (this.curr_direction != dir){
                this.changeAnim(dir);
            }
        }

        // log("BEFORE ==================== (");
        // for(var i = 0; i < this.path.length; i++){
        //     log([this.path[i].posInMap.x, this.path[i].posInMap.y])
        // }
        // log("Next pos: " + this.next_pos.x + ', ' + this.next_pos.y);
        // log("Dir: " + this.curr_direction);

        var pathStr = monster.path.split(':')
        var path = [];
        for(var i = 0 ; i < pathStr.length - 1; i++){
            var pStr = pathStr[i].split(',');
            var p = cc.p(Number(pStr[0]), Number(pStr[1]));
            var p2 = Helper.convertLogicCellToMapCell(p, this.isMyMap);
            path.push(this.cellMatrix[p2.x][p2.y]);
        }
        this.path = path;
        this.next_cell = 0;
        this.next_pos = this.path[0].posInMap;

        // log("AFTER ==================== (");
        // for(var i = 0; i < this.path.length; i++){
        //     log([this.path[i].posInMap.x, this.path[i].posInMap.y])
        // }
        // log("Next pos: " + this.next_pos.x + ', ' + this.next_pos.y);
        // log("Dir: " + this.curr_direction);

        let spells = [];
        for(let k = 0; k < monster.spellNum; ++k){
            let spellPk = monster.spells[k];
            let spell = this.player.findSpellByBattleId(this.player.spellInMapList, spellPk.battleId);
            if(spell != null){
                spells.push(spell);
            }
        }
        this.spells = spells;
        // for(let k = 0; k < monster.spellNum; ++k){
        //     let spellPk = monster.spells[k];
        //     let spell = player.findSpellByBattleId(player.spellInMapList, spellPk.battleId);
        //     if(spell != null){
        //         this.addSpellWithTick(spell, spellPk.tick);
        //         spell.doEffect(this);
        //     }
        // }

        //HA
        this.slowByBuff = monster.slowByBuff;
        let buffs =[];
        for(let k = 0; k < monster.buffNum; k++){
            let buffBattleId = monster.buffsBattleId[k];
            let buff = this.player.findBuffByBattleId(buffBattleId);
            if (buff != null){
                buffs.push(buff);
            }
        }
        this.buffs = buffs;

    },

    update:function(){
        // cc.log("monster " + this.battleObjectId + ", prev hp: " + this.currHp + ", cur speed: " + this.curSpeed + ", cur pos:" + this.curPos.x + " " + this.curPos.y + ", status: " + this.status);
        if(this.status == GC.MONSTER.STATUS.COLLISION){
            this.handleCollisionStatus();
        }
        else if(this.status == GC.MONSTER.STATUS.PASSING){
            this.handlePassingStatus();
        }
        else if(this.status == GC.MONSTER.STATUS.WAITING){
            this.handleWaitingStatus();
        }
        else if(this.status == GC.MONSTER.STATUS.NORMAL){
            this.handleNormalStatus();
        }
        else if(this.status == GC.MONSTER.STATUS.FLYING){
            this.handleFlyingStatus();
        }
        this.updateBuffPerTick();
        this.updateBossSkill();
        this.updateSpellPerTick();

        // Checking went home
        this.checkMonsterWentHome();
    },

    checkMonsterWentHome:function() {
        var p = Helper.convertMapPixelToLogicPoint(cc.p(this.posX, this.posY), this.isMyMap);
        if(p.x >= 5 && p.y >= 7) {
            this.isAlive = false;
            this.wentHome = true;
        }
    },

    handleCollisionStatus:function (){
        //cc.log("COLLISION STATUS " + this.collistionVec.t);
        this.move(this.collistionVec.d, this.collistionVec.v);
        this.collistionVec.t--;
        if(this.collistionVec.t <= 0){
            if(this.collisionMonster == null){
                this.status = GC.MONSTER.STATUS.NORMAL;
            }
            else{
                this.status = GC.MONSTER.STATUS.PASSING;
                this.getNextPassingPoint(this.curPos, this.collisionMonster.curr_direction);
                this.changeAnimOnly(this.collistionVec.d);
            }

        }
        //this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY), this.isMyMap);
    },
    handlePassingStatus:function (){
        if(!this.checkPassingPoint(this.collistionVec.d, this.passingPoint)){
            this.move(this.collistionVec.d, this.curSpeed);
            //this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY), this.isMyMap);
        }
        else{
            //cc.log("Dang state 2 passing");
            //this.makeMove(1 / 60,this.curr_direction);
            let pos = Helper.convertLogicPointToMapPixel(this.passingPoint, this.isMyMap)
            this.setMonsterPosition(pos.x, pos.y);
            this.status = GC.MONSTER.STATUS.NORMAL;
            this.collisionMonster = null;
            this.changeAnimOnly(this.curr_direction);
        }
    },
    handleWaitingStatus:function (){
        //if(this.checkNextMove(this.curr_direction, this.curSpeed)){
        this.status = GC.MONSTER.STATUS.NORMAL;
        this.collisionMonster = null;
        //}
    },
    handleNormalStatus:function (){
        this.makeMove(1 / 60,this.curr_direction);
        //this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY), this.isMyMap);
    },
    handleFlyingStatus:function (){
        if(this.flyingA != 0){
            let x = this.posX + this.flyingDelta;
            this.setMonsterPosition(x, this.flyingA * x * x + this.flyingB * x + this.flyingC);
        }
        else{
            this.setMonsterPosition(this.posX, this.posY + this.flyingDelta);
        }
    },
    getNextPassingPoint:function (curPos, d){
        let deltas = [0.9, 0.5, 0.1];
        if(d == GC.MONSTER.DIRECTION.UP || d == GC.MONSTER.DIRECTION.DOWN){
            for(let i = 0; i < deltas.length; ++i){
                if(this.player.isEmptyPos(cc.p(curPos.x, Math.floor(curPos.y) + deltas[i]), this.collisionRadius,  null)){
                    this.passingPoint = cc.p(curPos.x, Math.floor(curPos.y) + deltas[i]);
                    //cc.log("PASSING POINT: " + this.passingPoint.x + " " + this.passingPoint.y);
                    if((curPos.y < this.passingPoint.y && this.isMyMap) || (curPos.y > this.passingPoint.y && !this.isMyMap)){
                        this.collistionVec.d = GC.MONSTER.DIRECTION.RIGHT;
                    }
                    else if((curPos.y > this.passingPoint.y && this.isMyMap) || (curPos.y < this.passingPoint.y && !this.isMyMap)){
                        this.collistionVec.d = GC.MONSTER.DIRECTION.LEFT;
                    }
                    return;
                }
            }
        }
        else if(d == GC.MONSTER.DIRECTION.LEFT || d == GC.MONSTER.DIRECTION.RIGHT){
            for(let i = 0; i < deltas.length; ++i){
                if(this.player.isEmptyPos(cc.p(Math.floor(curPos.x) + deltas[i], curPos.y), this.collisionRadius, null)){
                    this.passingPoint = cc.p(Math.floor(curPos.x) + deltas[i], curPos.y);
                    //cc.log("PASSING POINT: " + this.passingPoint.x + " " + this.passingPoint.y);
                    if((curPos.x < this.passingPoint.x && this.isMyMap) || (curPos.x > this.passingPoint.x && !this.isMyMap)){
                        this.collistionVec.d = GC.MONSTER.DIRECTION.DOWN;
                    }
                    else if((curPos.x > this.passingPoint.x && this.isMyMap) || (curPos.x < this.passingPoint.x && !this.isMyMap)){
                        this.collistionVec.d = GC.MONSTER.DIRECTION.UP;
                    }
                    return;
                }
            }
        }
        this.status = GC.MONSTER.STATUS.WAITING;
    },
    checkPassing:function () {
        //cc.log("check Passing: " + this.curr_direction + " " + this.curPos.x + " " + this.curPos.y + " " + this.collisionMonster.curPos.x + " " + this.collisionMonster.curPos.y);
        if (this.curr_direction == GC.MONSTER.DIRECTION.UP && this.curPos.x > this.collisionMonster.curPos.x) return false;
        if (this.curr_direction == GC.MONSTER.DIRECTION.DOWN && this.curPos.x < this.collisionMonster.curPos.x) return false;
        if (this.curr_direction == GC.MONSTER.DIRECTION.RIGHT && this.curPos.y < this.collisionMonster.curPos.y) return false;
        if (this.curr_direction == GC.MONSTER.DIRECTION.LEFT && this.curPos.y > this.collisionMonster.curPos.y) return false;
        return true;
    },
    checkPassingPoint:function (d, pos){
        let logicDir = this.getLogicDirection(d);
        if(logicDir == GC.MONSTER.DIRECTION.UP){
            if(this.curPos.x - this.eps <= pos.x){
                return true;
            }
            return false;
        }
        else if(logicDir == GC.MONSTER.DIRECTION.DOWN){
            if(this.curPos.x + this.eps >= pos.x){
                return true;
            }
            return false;
        }
        else if(logicDir == GC.MONSTER.DIRECTION.LEFT){
            if(this.curPos.y - this.eps <= pos.y){
                return true;
            }
            return false;
        }
        else if(logicDir == GC.MONSTER.DIRECTION.RIGHT){
            if(this.curPos.y + this.eps >= pos.y){
                return true;
            }
            return false;
        }
    },
    checkNextMove:function (d, v){
        let dt = 1/60;
        let logicDir = this.getLogicDirection(d);
        if(logicDir == GC.MONSTER.DIRECTION.UP){
            return this.player.isEmptyPos(cc.p(Helper.roundTo3(this.curPos.x - v * dt) / 1000, this.curPos.y), this.collisionRadius, this.getRealDirection());
        }
        else if(logicDir == GC.MONSTER.DIRECTION.DOWN){
            return this.player.isEmptyPos(cc.p(Helper.roundTo3(this.curPos.x + v * dt) / 1000, this.curPos.y), this.collisionRadius, this.getRealDirection());
        }
        else if(logicDir == GC.MONSTER.DIRECTION.LEFT){
            return this.player.isEmptyPos(cc.p(this.curPos.x, Helper.roundTo3(this.curPos.y - v * dt) / 1000), this.collisionRadius, this.getRealDirection());
        }
        else if(logicDir == GC.MONSTER.DIRECTION.RIGHT){
            return this.player.isEmptyPos(cc.p(this.curPos.x, Helper.roundTo3(this.curPos.y + v * dt) / 1000), this.collisionRadius, this.getRealDirection());
        }
        return true;
    },
    move:function (d, v){
        //if(!this.checkNextMove(d, v)) return;
        if(this.isActive){
            let dt = 1 / 60;
            if(d == GC.MONSTER.DIRECTION.UP){
                if(this.curPos.x - v * dt + this.eps >= 0){
                    this.posY = Helper.roundTo3(this.posY/GC.MAP.CELL.P_WIDTH + v*dt)*GC.MAP.CELL.P_WIDTH/1000;
                }

            }
            else if(d == GC.MONSTER.DIRECTION.DOWN){
                if(this.curPos.x + v * dt - this.eps <= 6){
                    this.posY = Helper.roundTo3(this.posY/GC.MAP.CELL.P_WIDTH - v*dt)*GC.MAP.CELL.P_WIDTH/1000;
                }

            }
            else if(d == GC.MONSTER.DIRECTION.LEFT){
                if(this.curPos.y - v * dt + this.eps >= 0){
                    this.posX = Helper.roundTo3(this.posX/GC.MAP.CELL.P_WIDTH - v*dt)*GC.MAP.CELL.P_WIDTH/1000;
                }

            }
            else if(d == GC.MONSTER.DIRECTION.RIGHT){
                if(this.curPos.y + v * dt - this.eps <= 7){
                    this.posX = Helper.roundTo3(this.posX/GC.MAP.CELL.P_WIDTH + v*dt)*GC.MAP.CELL.P_WIDTH/1000;
                }

            }
            this.y = this.posY;
            this.x = this.posX;
            this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY), this.isMyMap);
        }

    },
    run:function(cellMatrix, endPosition, curr_direction = null){
        this.cellMatrix = cellMatrix;
        this.endPosition = endPosition;

        if (!curr_direction) {
            if(this.isMyMap){
                this.changeAnim(GC.MONSTER.DIRECTION.DOWN);
            }
            else {
                this.changeAnim(GC.MONSTER.DIRECTION.UP);
            }
        }
        else {
            this.changeAnim(curr_direction);
        }
        
        this.findPath();
        // this.scheduleUpdate();
    },

    getDirection:function(curr_pos, next_pos){
        if(curr_pos.y == next_pos.y && next_pos.x - curr_pos.x > 0){ // y bang nhau thi di sang phai (doi voi my map)
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.RIGHT;
            }
            else{
                return GC.MONSTER.DIRECTION.LEFT;
            }
        }
        else if (curr_pos.y == next_pos.y && next_pos.x - curr_pos.x < 0){ // Sang trai
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.LEFT;
            }
            else{
                return GC.MONSTER.DIRECTION.RIGHT;
            }
        }
        else if (curr_pos.x == next_pos.x && next_pos.y - curr_pos.y > 0){ // Len tren
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.UP;
            }
            else{
                return GC.MONSTER.DIRECTION.DOWN;
            }
        }
        else if (curr_pos.x == next_pos.x && next_pos.y - curr_pos.y < 0){ // Xuong duoi
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.DOWN;
            }
            else{
                return GC.MONSTER.DIRECTION.UP;
            }
        }
        else if (next_pos.x - curr_pos.x > 0 && next_pos.y - curr_pos.y > 0){ // Len tren sang phai
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.TOP_RIGHT;
            }
            else{
                return GC.MONSTER.DIRECTION.BOTTOM_LEFT;
            }
        }
        else if (next_pos.x - curr_pos.x < 0 && next_pos.y - curr_pos.y > 0){ // Len tren sang trai
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.TOP_LEFT;
            }
            else{
                return GC.MONSTER.DIRECTION.BOTTOM_RIGHT;
            }
        }
        else if (next_pos.x - curr_pos.x > 0 && next_pos.y - curr_pos.y < 0){ // Xuong duoi sang phai
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.BOTTOM_RIGHT;
            }
            else{
                return GC.MONSTER.DIRECTION.TOP_LEFT;
            }
        }
        else if (next_pos.x - curr_pos.x < 0 && next_pos.y - curr_pos.y < 0){ // Xuong duoi sang trai
            if (this.isMyMap){
                return GC.MONSTER.DIRECTION.BOTTOM_LEFT;
            }
            else{
                return GC.MONSTER.DIRECTION.TOP_RIGHT;
            }
        }
    },

    changeAnim:function(direction){
        this.setScaleX(Math.abs(this.getScaleX()));
        
        this.curr_direction = direction;
        this.stopAllActions();

        if (direction == GC.MONSTER.DIRECTION.LEFT){ // Left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        }
        else if (direction == GC.MONSTER.DIRECTION.TOP_LEFT){ // Top-left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.TOP_RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        }
        else if (direction == GC.MONSTER.DIRECTION.BOTTOM_LEFT){ // Bottom-left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.BOTTOM_RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        } 
        else{ // up, down, right, top-right, bottom-right direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[direction],this.delay_per_frame)).repeatForever());
        }
    },
    changeAnimOnly:function(direction){
        this.setScaleX(Math.abs(this.getScaleX()));
        this.stopAllActions();

        if (direction == GC.MONSTER.DIRECTION.LEFT){ // Left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        }
        else if (direction == GC.MONSTER.DIRECTION.TOP_LEFT){ // Top-left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.TOP_RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        }
        else if (direction == GC.MONSTER.DIRECTION.BOTTOM_LEFT){ // Bottom-left direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[GC.MONSTER.DIRECTION.BOTTOM_RIGHT],this.delay_per_frame)).repeatForever());
            this.setScaleX(this.getScaleX()*-1);
        }
        else{ // up, down, right, top-right, bottom-right direction
            this.runAction(cc.animate(new cc.Animation(this.animationList[direction],this.delay_per_frame)).repeatForever());
        }
    },

    changeDirection:function(){
        if (this.next_cell == this.path.length - 1){ // Toi nha roi !!!
            // this.destroy();
            this.isAlive = false;
            this.wentHome = true;
        }
        else {
            var curr_pos = this.next_pos;
            this.next_cell++;
            this.next_pos = this.path[this.next_cell].posInMap;

            var next_dir = this.getDirection(curr_pos, this.next_pos);
            if (this.curr_direction != next_dir){
                this.changeAnim(next_dir);
            }
        }
    },

    makeMove:function(dt, direction){
        if(this.isActive) {
            var point = Helper.convertPoint2Pixel(this.next_pos, this.isMyMap);
            //cc.log("direction heoheo: " +direction);
            if (direction == GC.MONSTER.DIRECTION.UP) {
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x - this.curSpeed * dt) / 1000;
                // this.y += this.speed*dt;
                if (this.posY >= point.y) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.DOWN) {
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x + this.curSpeed * dt) / 1000;
                // this.y -= this.speed*dt;
                if (this.posY <= point.y) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.LEFT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                //this.curPos.y = Helper.roundTo3(this.curPos.y - this.curSpeed * dt) / 1000;
                // this.x -= this.speed*dt;
                if (this.posX <= point.x) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.RIGHT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                //this.curPos.y = Helper.roundTo3(this.curPos.y + this.curSpeed * dt) / 1000;
                // this.x += this.speed*dt;
                if (this.posX >= point.x) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.TOP_LEFT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x - this.curSpeed * dt) / 1000;
                //this.curPos.y = Helper.roundTo3(this.curPos.y - this.curSpeed * dt) / 1000;
                // this.y += this.speed*dt;
                // this.x -=  this.speed*dt;
                if (this.posX <= point.x && this.posY >= point.y) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.TOP_RIGHT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x - this.curSpeed * dt) / 1000;
                //this.curPos.y = Helper.roundTo3(this.curPos.y + this.curSpeed * dt) / 1000;
                // this.y += this.speed*dt;
                // this.x +=  this.speed*dt;
                if (this.posX >= point.x && this.posY >= point.y) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.BOTTOM_LEFT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x + this.curSpeed * dt) / 1000;
                //this.curPos.y = Helper.roundTo3(this.curPos.y - this.curSpeed * dt) / 1000;
                // this.y -= this.speed*dt;
                // this.x -=  this.speed*dt;
                if (this.posX <= point.x && this.posY <= point.y) {
                    this.changeDirection();
                }
            } else if (direction == GC.MONSTER.DIRECTION.BOTTOM_RIGHT) {
                this.posX = Helper.roundTo3(this.posX / GC.MAP.CELL.P_WIDTH + this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.posY = Helper.roundTo3(this.posY / GC.MAP.CELL.P_WIDTH - this.curSpeed * dt) * GC.MAP.CELL.P_WIDTH / 1000;
                this.x = this.posX;
                this.y = this.posY;
                //this.curPos.x = Helper.roundTo3(this.curPos.x + this.curSpeed * dt) / 1000;
                //this.curPos.y = Helper.roundTo3(this.curPos.y + this.curSpeed * dt) / 1000;
                // this.y -= this.speed*dt;
                // this.x +=  this.speed*dt;
                if (this.posX >= point.x && this.posY <= point.y) {
                    this.changeDirection();
                }
            }
            this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX, this.posY), this.isMyMap);
        }
    },

    destroy:function(){
        if(this.balloon != null){
            this.player.unsetBalloonMonster();
        }
        this.isAlive = false;
        Helper.removeFromArray(this.player.monsterInMapList, this);
        this.removeFromParent(true);
    },

    // spell
    getCurHp:function(){
        return this.hp;
    },
    getObjectId:function(){
        return this.objectId;
    },
    isBuffBySpell:function(spell){
        for(let i = 0; i < this.spells.length; ++i){
            if(spell.battleId == this.spells[i].spell.battleId){
                return true;
            }
        }
        return false;
    },
    getSpeed:function (){
        return this.speed;
    },
    getEffectTick:function (spell){
        for(let i = 0; i < this.spells.length; ++i){
            if(spell.battleId == this.spells[i].spell.battleId){
                return this.spells[i].tick;
            }
        }
        return -1;
    },
    speedUp:function (rate){
        this.curSpeed *= rate;
    },
    heal:function (delta){
        this.currHp += delta;
        this.healSprite.setPercentage(this.currHp/this.hp*100);
    },
    freeze:function (isActive){
        if(this.isActive == isActive) return;
        this.isActive = isActive;
        if(isActive){
            this.changeAnim(this.curr_direction);
        }
        else{
            this.stopAllActions();
        }
    },
    addSpell:function (spell){
        this.spells.push({
            "spell": spell,
            "tick": spell.effectTick
        });
    },
    addSpellWithTick:function (spell, tick){
        for(let i = 0; i < this.spells.length; ++i){
            if(this.spells[i].spell == spell){
                this.spells[i].tick = tick;
                return;
            }
        }
        this.spells.push({
            "spell": spell,
            "tick": tick
        });
    },
    updateSpellPerTick:function (){
        for(let i = 0; i < this.spells.length; ++i){
            let spell = this.spells[i].spell;
            //cc.log("Monster " + this.battleObjectId + ", prev hp: " + this.hp + ", cur speed: " + this.speed + "leftTick: " + this.spells[i].tick + ", cur pos:" + this.curPos.x + " " + this.curPos.y);
            if(this.spells[i].tick > 0){
                this.spells[i].tick--;
                spell.doAction(this);
            }
            else{
                Helper.removeFromArray(this.spells, this.spells[i]);
                spell.removeEffect(this);
                i--;
            }
        }

    },
    setBattleId:function (battleId){
        this.battleId = battleId;
    },
    getLogicPoint: function (){
        let logicPoint =  Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY),this.isMyMap);
        return cc.p(Math.round(logicPoint.x * 1000)/1000,Math.round(logicPoint.y * 1000)/1000);
    },
    hitBullet: function (damage){
        //TODO something

        if(this.bossSkill == GC.BOSS.SKILL.NO_SKILL){
            if (this.counter == -1) {
                this.counter = 0;
                return;
            }
        }

        this.currHp -= damage;
        if(this.currHp <= 0){
            this.isAlive = false;
            this.currHp = 0;
        }
        this.healSprite.setPercentage(this.currHp/this.hp*100);
    },
    flyToStartPos:function (){
        this.player.addTrappedMonsters(this.battleObjectId);
        //Helper.removeFromArray(this.player.monsterInMapList, this);
        this.setVisible(false);
    },
    /*checkCollision:function (monster) {
        if((monster.collisionMonster != null && monster.collisionMonster.battleObjectId == this.battleObjectId) || (this.collisionMonster != null && this.collisionMonster.battleObjectId == monster.battleObjectId)) return;
        cc.log("check collision: " + this.battleObjectId + " " + monster.battleObjectId);
        if (Helper.getDistance(this.curPos, monster.curPos) <= (this.collisionRadius + monster.collisionRadius)) {
            //if (monster.status != GC.MONSTER.STATUS) {
            //    this.status = GC.MONSTER.STATUS.WAITING;
            //} else if (this.status != GC.MONSTER.STATUS.WAITING) {
                let v1 = this.getRealSpeed();
                let v2 = monster.getRealSpeed();
                let d = this.getRealDirection();
                this.collistionVec.v = ((this.weight - monster.weight) * v1 + 2 * monster.weight * v2) / (this.weight + monster.weight);
                monster.collistionVec.v = ((monster.weight - this.weight) * v2 + 2 * this.weight * v1) / (this.weight + monster.weight);
                if(v1 < v2){
                    this.collistionVec.d = d;
                    this.collistionVec.t = 20;
                    monster.collistionVec.d = d;
                    monster.collistionVec.t = 20;
                    this.move(this.collistionVec.d, this.collistionVec.v);
                    monster.collisionMonster = this;
                    cc.log("collision monster: "+monster.battleObjectId);
                }
                else{
                    this.collistionVec.d = d;
                    this.collistionVec.t = 20;
                    monster.collistionVec.d = d;
                    monster.collistionVec.t = 20;
                    monster.move(monster.collistionVec.d, monster.collistionVec.v);
                    this.collisionMonster = monster;
                    cc.log("collision monster: "+this.battleObjectId);
                }
                this.status = GC.MONSTER.STATUS.COLLISION;
                monster.status = GC.MONSTER.STATUS.COLLISION;
            }
            //this.curSpeed = ((this.weight - monster.weight) * this.curSpeed + 2 * monster.weight * monster.curSpeed) / (this.weight + monster.weight);
        }
    },*/
    checkNextMoveCollision: function (monster){
        let pos1 = this.getNextPos(this.getRealDirection(), this.getRealSpeed(), this.curPos);
        let pos2 = this.getNextPos(monster.getRealDirection(), monster.getRealSpeed(), monster.curPos);
        //cc.log("d: " + monster.getRealDirection() + " " + monster.getRealSpeed());
        return ((this.collisionRadius + monster.collisionRadius) - Helper.getDistance(pos1, pos2)) >= 0;
    },
    getNextPos:function (d, v, pos){
        let dt = 1/60;
        let logicD = this.getLogicDirection(d);
        if(logicD == GC.MONSTER.DIRECTION.UP){
            return cc.p(Helper.roundTo3(pos.x - v * dt)  / 1000, pos.y);
        }
        else if(logicD == GC.MONSTER.DIRECTION.DOWN){
            return cc.p(Helper.roundTo3(pos.x + v * dt) / 1000, pos.y);
        }
        else if(logicD == GC.MONSTER.DIRECTION.LEFT){
            return cc.p(pos.x, Helper.roundTo3(pos.y - v * dt) / 1000);
        }
        else if(logicD == GC.MONSTER.DIRECTION.RIGHT){
            return cc.p(pos.x, Helper.roundTo3(pos.y + v * dt) / 1000);
        }
    },
    checkCollision:function (monster) {
        if((monster.collisionMonster != null && monster.collisionMonster.battleObjectId == this.battleObjectId) || (this.collisionMonster != null && this.collisionMonster.battleObjectId == monster.battleObjectId)) return;
        if(monster.isFlying == 1 || this.isFlying == 1) return;
        //let delta = (this.collisionRadius + monster.collisionRadius) - Helper.getDistance(this.curPos, monster.curPos);
        if (this.checkNextMoveCollision(monster)) {
            if (this.status == GC.MONSTER.STATUS.NORMAL && monster.status == GC.MONSTER.STATUS.NORMAL) {
                //cc.log("check collision 1: " + this.battleObjectId + " " + monster.battleObjectId);
                this.handleCollision(this, monster);
            }
            else if (monster.status != GC.MONSTER.STATUS.NORMAL) {
                //cc.log("check collision 2: " + this.battleObjectId + " " + monster.battleObjectId);
                this.status = GC.MONSTER.STATUS.WAITING;
            }
                //this.curSpeed = ((this.weight - monster.weight) * this.curSpeed + 2 * monster.weight * monster.curSpeed) / (this.weight + monster.weight);
        }
        /*if((this.collisionRadius + monster.collisionRadius) - Helper.getDistance(this.curPos, monster.curPos) >= 0){
            this.curSpeed = ((this.weight - monster.weight) * this.curSpeed + 2 * monster.weight * monster.curSpeed) / (this.weight + monster.weight);
        }*/
    },
    handleCollision:function (monster1, monster2){
        let v1 = monster1.getRealSpeed();
        let v2 = monster2.getRealSpeed();
        let d = monster1.getRealDirection();
        monster1.collistionVec.v = ((monster1.weight - monster2.weight) * v1 + 2 * monster2.weight * v2) / (monster1.weight + monster2.weight);
        monster2.collistionVec.v = ((monster2.weight - monster1.weight) * v2 + 2 * monster1.weight * v1) / (monster1.weight + monster2.weight);
        monster1.collistionVec.d = d;
        monster1.collistionVec.t = 10;
        monster2.collistionVec.d = d;
        monster2.collistionVec.t = 10;
        monster1.status = GC.MONSTER.STATUS.COLLISION;
        monster2.status = GC.MONSTER.STATUS.COLLISION;
        if(v1 < v2){
            monster2.collisionMonster = monster1;
        }
        else if(v1 > v2){
            monster1.collisionMonster = monster2;
        }
        else{
            if(monster1.checkPassingPoint(d, monster2.curPos)){
                monster1.collistionVec.v = v1 + 0.5;
                monster2.status = GC.MONSTER.STATUS.NORMAL;
            }
            else{
                monster2.collistionVec.v = v2 + 0.5;
                monster1.status = GC.MONSTER.STATUS.NORMAL;
            }
        }
    },
    addBuff: function (buff){
        for(let i=0;i<this.buffs.length;i++){
            if (this.buffs[i].battleId == buff.battleId){
                return;
            }
        }
        this.buffs.push(buff);
    },
    updateBuffPerTick:function (){
        let isNotFrozen = true;
        let slowByBuff = 1.0;
        //cc.log("Monster buffs size: "+this.buffs.length);

        let k = 0;
        while (k < this.buffs.length){
            if (!this.buffs[k].isActive){
                Helper.removeFromArray(this.buffs,this.buffs[k]);
            }
            else {
                k+=1;
                k+=1;
            }
        }

        for(let i = 0; i < this.buffs.length; ++i){
            //cc.log("Monster Active with i " + i + " " +this.buffs[i].isActive);
            if (this.buffs[i].isActive){
                //cc.log("Monster getName with i " + i + " " +this.buffs[i].getName());
                if (this.buffs[i].getName() == "frozen"){
                    isNotFrozen = false;
                }

                if (this.buffs[i].getName() == "slow"){
                    slowByBuff *= (1.0 + this.buffs[i].getValue());
                }
            }
        }
        //cc.log("Monster slowByBuff " + slowByBuff);
        if (this.slowByBuff != slowByBuff){
            this.speedUp(1.0/this.slowByBuff);
            this.speedUp(slowByBuff);
            this.slowByBuff = slowByBuff;
        }

       // cc.log("Monster isNotFrozen " + isNotFrozen);

        if (this.isActive != isNotFrozen){
            this.freeze(isNotFrozen);
        }

    },

    updateBossSkill:function(){
        // Abstract class
    },

    healing:function(rate){
        this.fx.setAnimation(0, 'fx_cover', false);

        this.currHp += Math.round(this.hp*rate*1000)/1000;
        if(this.currHp > this.hp) this.currHp = this.hp;
        this.healSprite.setPercentage(this.currHp/this.hp*100);
    },

    addBalloon:function(number) {
        this.balloon = new cc.Sprite(res.SPRITE_BALLOON);
        this.addChild(this.balloon);
        this.balloon.setNormalizedPosition(0.5,1.2);

        if (number == 1){
            var num = new cc.Sprite(res.GESTURE_1);
        }
        else if (number == 3){
            var num = new cc.Sprite(res.GESTURE_3);
        }
        else if (number == 5){
            var num = new cc.Sprite(res.GESTURE_5);
        }
        else if (number == 6){
            var num = new cc.Sprite(res.GESTURE_6);
        }
        else if (number == 7){
            var num = new cc.Sprite(res.GESTURE_7);
        }
        else if (number == 8){
            var num = new cc.Sprite(res.GESTURE_8);
        }
        else if (number == 9){
            var num = new cc.Sprite(res.GESTURE_9);
        }
        else if (number == 11){
            var num = new cc.Sprite(res.GESTURE_11);
        }
        this.balloon.addChild(num);
        num.setNormalizedPosition(0.5,0.8);
        this.balloon.setTag(number);
    },

    getOppositeDirection:function (dir){
        if(dir == GC.MONSTER.DIRECTION.RIGHT) return GC.MONSTER.DIRECTION.LEFT;
        if(dir == GC.MONSTER.DIRECTION.LEFT) return GC.MONSTER.DIRECTION.RIGHT;
        if(dir == GC.MONSTER.DIRECTION.UP) return GC.MONSTER.DIRECTION.DOWN;
        if(dir == GC.MONSTER.DIRECTION.DOWN) return GC.MONSTER.DIRECTION.UP;
    },
    getRealSpeed:function (){
        if(this.status == GC.MONSTER.STATUS.WAITING || !this.isActive){
            return 0;
        }
        else if(this.status == GC.MONSTER.STATUS.COLLISION){
            return this.collistionVec.v;
        }
        return this.curSpeed;
    },
    getRealDirection:function (){
        if(this.status == GC.MONSTER.STATUS.COLLISION){
            return this.collistionVec.d;
        }
        return this.curr_direction;
    },
    setFlyingStatus:function (tick){
        this.status = GC.MONSTER.STATUS.FLYING;
        let startPos = Helper.convertPoint2Pixel(cc.p(0, 5), this.isMyMap);
        if((startPos.x - this.posX) != 0){
            this.flyingDelta = (startPos.x - this.posX) / (tick);
            this.flyingA = - (startPos.y - this.posY) / ((startPos.x - this.posX) * (startPos.x - this.posX));
            this.flyingB = -2 * this.flyingA * startPos.x;
            this.flyingC = startPos.y - this.flyingA * startPos.x * startPos.x - this.flyingB * startPos.x;
        }
        else{
            this.flyingDelta = (startPos.y - this.posY) / (tick);
            this.flyingA = 0;
        }

    }
});

// Monster.generatedSystemMonsterId = [0,0];
// Monster.genSystemMonsterId = function(isMyMap){
//     return Monster.generatedSystemMonsterId[isMyMap? 0 : 1]++;
// }

// Monster.generatedDropMonsterId = [0,0];
// Monster.genDropMonsterId = function (isMyMap){
//     return Monster.generatedDropMonsterId[isMyMap? 0 : 1]++;
// }