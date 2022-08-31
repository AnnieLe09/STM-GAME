var Map = cc.Layer.extend({
    cellMatrix: null, // x is the first dimention and y is the second dimention
    startPosition: null,
    endPosition: null,
    listMonster: null,
    isMyMap: null,
    listBuff: null,

    ctor:function(isMyMap = true){
        this._super();
        this.setAnchorPoint(0.5,0.5);
        this.setNormalizedPosition(0,0);
        this.isMyMap = isMyMap;
        this.startPosition = cc.p(0, 5);
        this.endPosition = cc.p(7, 0);
        if (this.isMyMap){
            this.player = gv.battleController.players[0];
        }
        else {
            this.player = gv.battleController.players[1];
        }

        // If this is my map, set position for map, start position and end position
        // if (this.isMyMap){
        //     this.startMonsterPositionInPixel = cc.p(GC.MAP.CELL.P_WIDTH/2, GC.MAP.CELL.P_HEIGHT*(GC.MAP.HEIGHT - 0.5));
        // }
        // else{
        //     //init start and end position
        //     this.startMonsterPositionInPixel = cc.p(GC.MAP.CELL.P_WIDTH*(GC.MAP.WIDTH - 0.5), -GC.MAP.CELL.P_HEIGHT/2);
        // }

        // Tnit cell for matrix
        // If this is my map, This matrix has the (0,0) cell at buttom-left corner and (6,4) cell at top-right corner
        // Else, This matrix has the (0,0) cell at top-right corner and (6,4) cell at buttom-left corner
        // Horizontal (x) is the first dimension and Vertical (y) is the second dimension
        this.cellMatrix = [];
        var idx = 5;
        for(var i = 0; i < GC.MAP.WIDTH; i++){
            var temp = [];
            idx = 5
            for(var j = 0; j < GC.MAP.HEIGHT; j++){
                var cell = new Cell(cc.p(i, j), idx, isMyMap, this.player);
                this.addChild(cell);
                temp.push(cell);
                idx--;

                if (i==GC.MAP.WIDTH-1 || j==GC.MAP.HEIGHT - 1){
                    cell.setVisible(false);
                }
            }
            this.cellMatrix.push(temp);
        };

        // Copy Map In Server
        this.logicMap = this.player.map;
        this.player.setVirtualMap(this);

        this.listBuff = [];

        for(var i = 0; i < GC.MAP.WIDTH; i++){
            for(var j = 0; j < GC.MAP.HEIGHT; j++){
                var logicCell = Helper.convertMapCellToLogicCell(cc.p(i,j),this.isMyMap);

                var k = this.logicMap[logicCell.x][logicCell.y];

                switch(k) {
                    case BUFF.DAMAGE:
                        // code block
                        this.listBuff.push(this.cellMatrix[i][j]);
                        this.cellMatrix[i][j].addBuff(BUFF.DAMAGE);
                        break;
                    case BUFF.ATTACK_SPEED:
                        this.listBuff.push(this.cellMatrix[i][j]);
                        this.cellMatrix[i][j].addBuff(BUFF.ATTACK_SPEED);
                        // code block
                        break;
                    case BUFF.RANGE:
                        this.listBuff.push(this.cellMatrix[i][j]);
                        this.cellMatrix[i][j].addBuff(BUFF.RANGE);
                        // code block
                        break;
                    case GC.MAP.TREE:
                        var tree = new cc.Sprite(res.TREE_SPRITE);
                        tree.setNormalizedPosition(GC.MAP.CELL.RELATIVE.TREE.X, GC.MAP.CELL.RELATIVE.TREE.Y);
                        this.cellMatrix[i][j].addObstacle(OBSTACLE.TREE, tree);
                        // code block
                        break;
                    case GC.MAP.HOLE:
                        var hole = new cc.Sprite(res.HOLE_SPRITE);
                        hole.setNormalizedPosition(GC.MAP.CELL.RELATIVE.HOLE.X, GC.MAP.CELL.RELATIVE.HOLE.Y);
                        this.cellMatrix[i][j].addObstacle(OBSTACLE.HOLE, hole);
                        // code block
                        break;
                    case GC.MAP.OUT:
                        var out = new cc.Sprite();
                        out.setNormalizedPosition(GC.MAP.CELL.RELATIVE.HOLE.X, GC.MAP.CELL.RELATIVE.HOLE.Y);
                        this.cellMatrix[i][j].addObstacle(OBSTACLE.OUT, out);
                        // code block
                        break;
                    default:
                    // code block
                }
            }

        };

        // Init list of monster in map
        this.listMonster = [];

        // Random buff cell
        //this.listBuff = this.randomBuffCells();

        //this.setBuffCells();

        //this.putTreeAndHole();

        // this.path = Helper.getCurvePoint(Helper.bfsShortedPath(this.startPosition, this.endPosition, this.cellMatrix));

        // for(var i = 0; i < this.path.length; i++){
        //     this.path[i].addChild(new Assasin());
        // };


        // var a = new WalkMonster(0, this.isMyMap);
        // a.setPosition(Helper.convertPoint2Pixel(this.startPosition, this.isMyMap));
        // this.addChild(a);
        // a.run(this.cellMatrix, this.endPosition);
        // a.zIndex = 100;

        //Add by Hanh------------
        this.listMonster.push(a);
        this.eventHandler();
        //-----------------------

        if(this.isMyMap){
            this.addRenderLayer();
        }
        
    },

    addRenderLayer:function(){
        this.renderField = new RenderTextureLayer();
        this.renderField.setNormalizedPosition(0, 0);
        this.addChild(this.renderField);
        this.renderField.zIndex = 2000;
    },

    addMonster:function(monster, position = null){
        // monster.setPosition(Helper.convertPoint2Pixel(this.startPosition, this.isMyMap));
        if (!position){
            var p = Helper.convertPoint2Pixel(this.startPosition, this.isMyMap);
            monster.setMonsterPosition(p.x, p.y);
        }
        else {
            monster.setMonsterPosition(position.x, position.y);
        }
        
        this.addChild(monster);
        // monster.run(this.cellMatrix, this.endPosition);
        monster.zIndex = 10001;
    },

    randomBuffCells:function(){
        var temp = [];
        for (var i = 1; i <= 5; i++){
            for (var j = 1; j <= 3; j++){
                if (i == 1 && j == 3) continue;
                temp.push(this.cellMatrix[i][j]);
            }
        }
        // log(this.cellMatrix[1].indexOf(temp[0]));
        temp = Helper.shuffle(temp);

        listBuff = [];
        var numBuff = 0;
        var neighbours = [];
        for (var i = 0; i < temp.length; i++){
            if (neighbours.indexOf(temp[i]) == -1){
                listBuff.push(temp[i]);
                point = temp[i].getPositionInMap();
                neighbours.push(...Helper.getFullNeibours(this.cellMatrix, point));
                numBuff++;
                if (numBuff == 3) break;
            }
        }
        return listBuff;
    },

    setBuffCells:function(flag = 0){
        if (flag == 0){
            this.listBuff[0].addBuff(BUFF.DAMAGE);
            this.listBuff[1].addBuff(BUFF.ATTACK_SPEED);
            this.listBuff[2].addBuff(BUFF.RANGE);
        }
        else{
            this.listBuff[1].addBuff(BUFF.DAMAGE);
            this.listBuff[0].addBuff(BUFF.ATTACK_SPEED);
            this.listBuff[2].addBuff(BUFF.RANGE);
        }
    },

    putTreeAndHole:function(){
        this.virtualPath = Helper.getPath(this.startPosition, this.endPosition, this.cellMatrix);
        this.curvePointList = Helper.getCurvePoint(this.virtualPath);

        var numTree = 0;
        for( var i = 0; i < this.curvePointList.length; i++){
            // Get 4 neighbours of this cell
            var neighbours = Helper.get4Neighbours(this.cellMatrix, this.curvePointList[i].posInMap);

            for (var j = 0; j < neighbours.length; j++){
                if(this.virtualPath.indexOf(neighbours[j]) != -1 || neighbours[j].buffType != BUFF.NO_BUFF || neighbours[j].obstacleType != OBSTACLE.NO_OBSTACLE) continue;
                var flag = false;
                // Check closed cell
                var temp = Helper.get4Neighbours(this.cellMatrix, neighbours[j].posInMap);

                for (var k = 0; k < temp.length; k++){
                    if (temp[k].buffType != BUFF.NO_BUFF || temp[k].obstacleType != OBSTACLE.NO_OBSTACLE) {
                        flag = true;
                        break;
                    }
                }
                if(flag) continue;

                var tree = new cc.Sprite(res.TREE_SPRITE);
                tree.setNormalizedPosition(GC.MAP.CELL.RELATIVE.TREE.X, GC.MAP.CELL.RELATIVE.TREE.Y);
                neighbours[j].addObstacle(OBSTACLE.TREE, tree);
                numTree++;
                break;
            }
            if(numTree >= GC.MAP.MAX_NUM_TREE) break;
        }

        var numHole = 0;
        for(var i = this.virtualPath.length - 3; i >= 0; i--){
            // Get 4 neighbours of this cell
            var neighbours = Helper.get4Neighbours(this.cellMatrix, this.virtualPath[i].posInMap);

            for (var j = 0; j < neighbours.length; j++){
                if(this.virtualPath.indexOf(neighbours[j]) != -1 || neighbours[j].buffType != BUFF.NO_BUFF || neighbours[j].obstacleType != OBSTACLE.NO_OBSTACLE) continue;
                var flag = false;
                // Check closed cell
                var temp = Helper.get4Neighbours(this.cellMatrix, neighbours[j].posInMap);

                for (var k = 0; k < temp.length; k++){
                    if (temp[k].buffType != BUFF.NO_BUFF || temp[k].obstacleType != OBSTACLE.NO_OBSTACLE) {
                        flag = true;
                        break;
                    }
                }
                if(flag) continue;

                var hole = new cc.Sprite(res.HOLE_SPRITE);
                hole.setNormalizedPosition(GC.MAP.CELL.RELATIVE.HOLE.X, GC.MAP.CELL.RELATIVE.HOLE.Y);
                neighbours[j].addObstacle(OBSTACLE.HOLE, hole);
                numHole++;
                break;
            }
            if(numHole >= GC.MAP.MAX_NUM_HOLE) break;
        }
    },

    getCellSize:function(){
        return this.cellMatrix[0][0].width;
    },

    getCell:function(i, j){
        return this.cellMatrix[i][j];
    },
    genMonster: function(){

    },
    parse: function (matrix){

    },
    addTower: function (cell,tower){
        var monsters;





        if (this.isMyMap){
            monsters = gv.battleController.players[0].monsterInMapList;
        }
        else {
            monsters = gv.battleController.players[1].monsterInMapList;
        }

        if (!cell.addTower(tower)) {
            cc.log("Cannot add Tower "+cell.posInMap.x+" "+cell.posInMap.y);
            return false;
        }
        try {
            if (this.isMyMap){
                var tryMonster = new WalkMonster(0,true,0);
                this.addMonster(tryMonster);

                tryMonster.setVisible(false);
                tryMonster.run(this.cellMatrix,this.endPosition);
                tryMonster.destroy();

            }

            cc.log("find Path Monster When Place Tower 1");
            if (this.isMyMap){
                for(let i=0; i<monsters.length; i++){
                    if (!Helper.checkNull(monsters[i]) && monsters[i].isAlive){
                        monsters[i].findPath();
                    }
                }
            }

            cc.log("find Path Monster When Place Tower 2");



        }
        catch(err) {
            cc.log("Cannot add Tower "+cell.posInMap.x+" "+cell.posInMap.y);
            return false;
        }
        return true;
    },
    dropTower: function (cell,tower){
        var monsters;
        if (this.isMyMap){
            monsters = gv.battleController.players[0].monsterInMapList;
        }
        else {
            monsters = gv.battleController.players[1].monsterInMapList;
        }
        if (!cell.dropTower(tower)) {
            cc.log("Cannot drop Tower because haven't tower in this cell "+cell.posInMap.x+" "+cell.posInMap.y);
            return false;
        }

        if (this.isMyMap){
            // Tìm đường 2 lần????
            // try {
            //     for(let i=0; i<monsters.length; i++){
            //         if (!Helper.checkNull(monsters[i]) && monsters[i].isAlive){
            //             monsters[i].findPath();
            //         }
            //     }
            // }
            // catch(err) {
            //     cc.log("Cannot find Path then drop Tower "+cell.posInMap.x+" "+cell.posInMap.y);
            //     return true;
            // }
        try {
            if (this.isMyMap){
                for(let i=0; i<monsters.length; i++){
                    if (!Helper.checkNull(monsters[i]) && monsters[i].isAlive){
                        monsters[i].findPath();
                    }
                }
            }
        }
        catch(err) {
            cc.log("Cannot find Path then drop Tower "+cell.posInMap.x+" "+cell.posInMap.y);
            return true;
        }
    }
        return true;
    },
    /*
    getTouchedCell: function(pos){
        if (this.isMyMap){
            return this.getParent().getParent().getParent().getTouchedCell(pos);
        }
    },

     */
    eventHandler: function (){

        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation(), target = event.getCurrentTarget();
                pos = target.convertToNodeSpace(pos);
                var cell = target.getTouchedCell(pos);
                if (target.isMyMap && cell != null){
                    if (cell.posInMap.x == 3 && cell.posInMap.y == 5 && gv.battleController.battleLayer.isSetTimer && gv.battleController.canStartRound()){
                        gv.battleController.battleLayer.unscheduleUpdate();
                        //let tick = gv.battleController.curTick;
                        let tick = gv.battleController.startRound();
                        gv.battleController.sendStartRound(tick);
                    }
                }
                if (cell!=null){
                    cell.processDropTower(); 
                }
                return true;
            }
        });
        cc.eventManager.addListener(eventListener, this);

    },

    getTouchedCell: function(pos){

        var x = Math.floor((pos.x)/(GC.MAP.CELL.P_WIDTH));
        var y = Math.floor((pos.y)/(GC.MAP.CELL.P_HEIGHT));

        // cc.log("pos in Map: "+this.isMyMap+" "+pos.x + " " + pos.y);
        var logicPoint = Helper.convertMapPixelToLogicPoint(pos,this.isMyMap);
        // cc.log("logicPoint In Map: "+this.isMyMap+" "+logicPoint.x + " " + logicPoint.y);


        if (!this.isMyMap) {
            // Cell(0,0) --> Point(GC.MAP.CELL.P_WIDTH * (GC.MAP.WIDTH - 1),
                    // GC.MAP.CELL.P_HEIGHT * (GC.MAP.HEIGHT - 1))
            var x = Math.floor((GC.MAP.CELL.P_WIDTH * (GC.MAP.WIDTH - 1)-pos.x)/(GC.MAP.CELL.P_WIDTH));
            var y = Math.floor((GC.MAP.CELL.P_HEIGHT * (GC.MAP.HEIGHT - 1)-pos.y)/(GC.MAP.CELL.P_HEIGHT));
        }

        if(x >= 0 && x < GC.MAP.WIDTH && y >= 0 && y < GC.MAP.HEIGHT){
            var cell = this.cellMatrix[x][y];
            // log("cell in Map "+[cell.posInMap.x,cell.posInMap.y])
            var cellPoint = Helper.convertPoint2Pixel(cell,false);
            return cell;
        }
        return  null;
    }
});