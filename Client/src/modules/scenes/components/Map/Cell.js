var Cell = cc.Sprite.extend({
    // obstacle: null,
    // buffSprite: null, // Pointer to buff sprite
    // buffType: null, // Type of buff
    // posInMap: null,

    ctor: function(point, zIndex, isMy, player) { //point is cc.Point object
        // Base
        this._super(res.cell_sprite);

        // Set base attribute
        this.setAnchorPoint(0,0);

        if(isMy){
            this.setPosition(GC.MAP.CELL.P_WIDTH*point.x, GC.MAP.CELL.P_HEIGHT*point.y - GC.MAP.CELL.REMAINDER);
            this.zIndex = zIndex;
        }
        else{
            this.setPosition(GC.MAP.CELL.P_WIDTH*(GC.MAP.WIDTH - 1 - point.x - 1), GC.MAP.CELL.P_HEIGHT*(GC.MAP.HEIGHT - 1 - point.y - 1) - GC.MAP.CELL.REMAINDER);
        }

        this.posInMap = point;

        this.buffType = BUFF.NO_BUFF;

        this.obstacle = null;
        this.obstacleType = OBSTACLE.NO_OBSTACLE;
        this.player = player;
        this.isMy = isMy;

    },

    getPositionInMap:function(){
        return this.posInMap;
    },

    addObstacle: function(obstacleType, obstacleObj){
        this.obstacleType = obstacleType;
        this.obstacle = obstacleObj;
        this.addChild(this.obstacle);
        this.obstacle.setAnchorPoint(0,0);
        // this.obstacle.setNormalizedPosition(0.17,0.3);
        // this.obstacle.zIndex = 10;
    },

    removeObstacle: function() {

    },
    addBuff:function(buffType){
        this.buffType = buffType;
        this.buff = null;
        switch(this.buffType){
            case BUFF.DAMAGE:
                this.buffSprite = new cc.Sprite(res.cell_buff_damage);
                this.buff = new TowerCellBuff(buffType - 1,this);
                break;
            case BUFF.ATTACK_SPEED:
                this.buffSprite = new cc.Sprite(res.cell_buff_speed);
                this.buff = new TowerCellBuff(buffType - 1,this);
                break;
            case BUFF.RANGE:
                this.buffSprite = new cc.Sprite(res.cell_buff_rage);
                this.buff = new TowerCellBuff(buffType - 1,this);
                break;
        };
        if (this.buff!= null){
            this.player.addBuff(this.buff);
        }
        this.buffSprite.setAnchorPoint(0,0);
        this.buffSprite.setPosition(0,0);
        this.addChild(this.buffSprite);
    },

    removeBuff:function(){
        this.removeChild(this.buffSprite);
        this.buffType = null;
        //Todo something
    },

    addTower: function (tower){
        cc.log("Obstacle: "+this.obstacleType);
        if (this.obstacleType != OBSTACLE.NO_OBSTACLE){
            return false;
        }
        let startCell = Helper.convertLogicCellToMapCell(cc.p(0,0),this.isMy)
        if (this.posInMap.x == startCell.x && this.posInMap.y == startCell.y){
            return false;
        }
        this.obstacleType = OBSTACLE.TOWER;
        this.obstacle = tower;
        if (this.buffType !=0){
            tower.addBuff(this.buff);
        }
        return true;
    },
    dropTower: function (tower){
        if (this.obstacleType != OBSTACLE.TOWER){
            cc.log("obstacleType: "+this.obstacleType+" "+OBSTACLE.TOWER);
            return false;
        }

        if (this.posInMap)
        this.obstacleType = OBSTACLE.NO_OBSTACLE;
        this.obstacle = null;
        return true;
    },
    processDropTower: function() {
        if (this.obstacleType != OBSTACLE.TOWER){
            return;
        }
        else {
            this.obstacle.dropInMap();
        }
    },
    parse: function (cellPk){
        if (this.obstacleType == cellPk.obstacleType && this.obstacleType != OBSTACLE.TOWER){
            return;
        }
        else {
            if (cellPk.obstacleType != OBSTACLE.TOWER) {
                if (cellPk.obstacleType == OBSTACLE.NO_OBSTACLE) {
                    this.obstacleType = OBSTACLE.NO_OBSTACLE;
                    this.obstacle = null;
                }
                //todo something
            }
            else {
                this.obstacleType = OBSTACLE.NO_OBSTACLE;
                this.obstacle = null;
                let tower = cellPk.player.findTowerByBattleId(cellPk.obstacleBattleId);
                this.addTower(tower);
            }
        }
    }


});