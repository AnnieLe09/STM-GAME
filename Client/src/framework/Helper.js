var Helper = cc.Class.extend();

Helper.shuffle = function(array){
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
};

Helper.equalPoint = function(p1, p2){
    return p1.x == p2.x && p1.y == p2.y;
}

Helper.getFullNeibours = function(array, point){
    var temp = [];
    for(var i = -1; i <= 1; i++){
        for (var j = -1; j <= 1; j++){
            if (i == 0 && j == 0) continue;
            if(point.x + i >= 0 && point.x + i < GC.MAP.WIDTH && point.y + j >= 0 && point.y + j < GC.MAP.HEIGHT){
                temp.push(array[point.x + i][point.y + j]);
            }
        }
    }
    return temp;
},

Helper.get4Neighbours = function(array, point){
    var temp = [];
    if(point.y - 1 >= 0) temp.push(array[point.x][point.y - 1]); // Down
    if(point.x + 1 < GC.MAP.WIDTH) temp.push(array[point.x + 1][point.y]); // Right
    if(point.y + 1 < GC.MAP.HEIGHT) temp.push(array[point.x][point.y + 1]); // Up
    if(point.x - 1 >= 0) temp.push(array[point.x - 1][point.y]); // Left
    return temp;
}

// Get Path function
var path;
var endCell;
var currNumBuff;
var adjacentVertexMatrix;
var visitedCell;
function dfsRecursion(currPath, cell, numBuff, cellMatrix, num){
    // if(num == 10) return;
    if (cell == endCell) {
        if(currNumBuff < numBuff || currNumBuff == numBuff && path.length < currPath.length){
            currNumBuff = numBuff;
            path = [...currPath];
        }
        return;
    }
    var temp = Helper.get4Neighbours(cellMatrix, cell.posInMap);
    // log("point: " + cell.posInMap.x +", " + cell.posInMap.y)
    for (var i = 0; i < temp.length; i++){

        if (temp[i].buffType != BUFF.NO_BUFF || visitedCell[temp[i].posInMap.x][temp[i].posInMap.y] == 1) continue;
        
        var temp2 = Helper.get4Neighbours(cellMatrix, temp[i].posInMap);

        var buff = 0;
        var flag = false;

        // log([temp[i].posInMap.x, temp[i].posInMap.y]);

        for (var j = 0; j < temp2.length; j++){
            if(temp2[j].buffType != BUFF.NO_BUFF) buff++;
            var point = temp2[j].posInMap;
            if(visitedCell[point.x][point.y] == 1 && adjacentVertexMatrix[point.x][point.y] + 1 > 2){
                flag = true;
                break;
            }
        }
        
        if (flag) continue;


        for (var j = 0; j < temp2.length; j++){
            var point = temp2[j].posInMap;
            adjacentVertexMatrix[point.x][point.y]++;
        }
       
        currPath.push(temp[i]);
        visitedCell[temp[i].posInMap.x][temp[i].posInMap.y] = 1;
        dfsRecursion(currPath, temp[i], numBuff + buff, cellMatrix, num + 1);
        visitedCell[temp[i].posInMap.x][temp[i].posInMap.y] = 0;
        currPath.pop();

        for (var j = 0; j < temp2.length; j++){
            var point = temp2[j].posInMap;
            adjacentVertexMatrix[point.x][point.y]--;
        }
    }
}

// This function hash a cell, index  from buttom to top and then left to right, example:
// [2 5 8]
// [1 4 7]
// [0 3 6] 
Helper.hash = function(cell){
    var point = cell.posInMap;
    return point.x*GC.MAP.HEIGHT + point.y;
}

Helper.getPath = function(startPosition, endPosition, cellMatrix){
    path = [];
    currNumBuff = 0;
    adjacentVertexMatrix = [];
    visitedCell = [];
    
    for(var i = 0; i < GC.MAP.WIDTH; i++){
        var temp = [];
        for(var j = 0; j < GC.MAP.HEIGHT; j++){
            temp.push(0);
        }
        adjacentVertexMatrix.push(temp);
    };

    for(var i = 0; i < GC.MAP.WIDTH; i++){
        var temp = [];
        for(var j = 0; j < GC.MAP.HEIGHT; j++){
            temp.push(0);
        }
        visitedCell.push(temp);
    };

    var startCell = cellMatrix[startPosition.x][startPosition.y];
    endCell = cellMatrix[endPosition.x][endPosition.y];
    currPath = [startCell];
    visitedCell[startCell.posInMap.x][startCell.posInMap.y] = 1;
    var temp2 = Helper.get4Neighbours(cellMatrix, startCell.posInMap);
    for (var j = 0; j < temp2.length; j++){
        var point = temp2[j].posInMap;
        adjacentVertexMatrix[point.x][point.y]++;
    }
    dfsRecursion(currPath, startCell, 0, cellMatrix, 0);
    return path;
}

Helper.getCurvePoint = function(arrayCell){
    var listCurvePoint = [];
    listCurvePoint.push(arrayCell[0]);
    if(arrayCell.length < 2) return listCurvePoint;
    var prev = arrayCell[1].posInMap.x == arrayCell[0].posInMap.x; // 0 is horizontal, 1 is vertical

    for (var i = 2; i < arrayCell.length; i++){
        if(prev == (arrayCell[i].posInMap.x == arrayCell[i-1].posInMap.x)){
            continue;
        }
        listCurvePoint.push(arrayCell[i-1]);
        prev = (arrayCell[i].posInMap.x == arrayCell[i-1].posInMap.x);
    }

    listCurvePoint.push(arrayCell[arrayCell.length - 1]);
    return listCurvePoint;
}

Helper.get4NeighboursPriority = function(array, point, dir){
    var temp = [];
    if(point.y - 1 >= 0) temp.push([array[point.x][point.y - 1], GC.MONSTER.DIRECTION.DOWN]); // Down
    if(point.x + 1 < GC.MAP.WIDTH) temp.push([array[point.x + 1][point.y], GC.MONSTER.DIRECTION.RIGHT]); // Right
    if(point.y + 1 < GC.MAP.HEIGHT) temp.push([array[point.x][point.y + 1], GC.MONSTER.DIRECTION.UP]); // Up
    if(point.x - 1 >= 0) temp.push([array[point.x - 1][point.y], GC.MONSTER.DIRECTION.LEFT]); // Left

    var temp2 = [];
    for (var i = 0; i < temp.length; i++){
        if (temp[i][1] == dir && temp[i][0].obstacleType == OBSTACLE.NO_OBSTACLE) temp2.push(temp[i]);
    }
    for (var i = 0; i < temp.length; i++){
        if (temp[i][1] != dir && temp[i][0].obstacleType == OBSTACLE.NO_OBSTACLE) temp2.push(temp[i]);
    }
    return temp2;
}
Helper.bfsShortedPath = function(startPosition, endPosition, cellMatrix, dir){
    var startCell = cellMatrix[startPosition.x][startPosition.y];
    var endCell = cellMatrix[endPosition.x][endPosition.y];

    var queue = [[startCell, dir]];  // queue: [[cell, direction],...]
    var distance = [];

    var ans = new Array(GC.MAP.WIDTH*GC.MAP.HEIGHT);
    for(var i = 0; i < GC.MAP.WIDTH*GC.MAP.HEIGHT; i++){
        distance.push(INF);
    }

    distance[Helper.hash(startCell)] = 0;
    ans[Helper.hash(startCell)] = -1;

    while(queue.length > 0){
        var node = queue.shift();
        var currCell = node[0];
        if (currCell == endCell) {
            break;
        }
        var temp = Helper.get4NeighboursPriority(cellMatrix, currCell.posInMap, node[1]); // temp: [[cell, direction],...]
        for(var i = 0; i < temp.length; i++){
            // if(temp[i].obstacleType != OBSTACLE.NO_OBSTACLE) continue; // If there is a obstacle in cell then continue
            var cell = temp[i][0];
            if(distance[Helper.hash(cell)] > distance[Helper.hash(currCell)] + 1){
                distance[Helper.hash(cell)] = distance[Helper.hash(currCell)] + 1;
                ans[Helper.hash(cell)] = currCell;
                queue.push(temp[i]);
            }
        }

    }
    var x = [endCell];
    var y = endCell;
    while(ans[Helper.hash(y)] != -1){
        if(ans[Helper.hash(y)] == null){
            log("Nowayyy");
            return null;
        }
        x.push(ans[Helper.hash(y)]);
        y = ans[Helper.hash(y)];
    }
    return x.reverse()
}

// Helper.checkPointInList = function(point, listPoint){
//     for (var i = 0; i < listPoint.length; i++){
//         if(Helper.equalPoint(point, listPoint[i])) return true;
//     }
//     return false;
// }

// Thời gian
Helper.convertHMS = function(value){
    let hours   = Math.floor(value / 3600); // get hours
    let minutes = Math.floor((value - (hours * 3600)) / 60); // get minutes
    let seconds = value - (hours * 3600) - (minutes * 60);
    return {hours:hours, minutes:minutes, seconds:seconds};
}
Helper.convertHMDisplay = function(value){
    let time = Helper.convertHMS(value);
    let hours = time.hours;
    let minutes = time.minutes;
    let seconds = time.seconds;
    let res = "";
    if(hours) res += hours + "h";
    if(minutes) res += minutes + "m";
    return res + seconds + "s";
}

// array
Helper.removeFromArray = function(arr, object){
    let index = arr.indexOf(object);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

Helper.getNextLevel = function(level){
    return GC.CARD.LEVELS["" + (level + 1)];
}

Helper.findStat = function(level){
    let stats =  GC.CARD.STATS;
    for(let i = stats.length - 1; i >= 0 ; --i){
        if(level >= stats[i]){
            return i + 1;
        }
    }
    return 1;
}

//tower
Helper.getTowerImage = function(path, stat){
    if(stat == -1){
        return CARD_PATH + path + ".png";
    }
    return CARD_PATH + path + stat + ".png";
}

//random
Helper.randomizeInt = function(start, end){
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
Helper.randomizeFloat = function(start, end){
    return Math.random() * (end - start) + start;
}

// parser
Helper.parseArray = function(objectName, arr, num){
    let res = [];
    for(let i = 0; i < num; ++i){
        let object = objectName.parse(arr[i]);
        res.push(object);
    }
    return res;
}

Helper.getLayer = function(name){
    return gv.mainController.mainLayer["layer" +  GC.TAB[name + "Btn"]];
}

Helper.createObject = function(type, name){
    if(type == "SPELL"){
        return SpellFactory.create(name);
    }
    else if(type == "MONSTER"){
        return new MonsterModel(name);
    }
    return new (GC[type].CLASS)(name);
    //return new Tower("6");
},

Helper.convertToDecimalString = function(numString){
    const result = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
    return result;
}

Helper.pad4 = function(num){
    var s = '0000' + num;
    return s.substring(s.length-4);
}

Helper.convertPoint2Pixel = function(point, isMyMap){
    var x,y;
    if(isMyMap){
        x = (point.x+0.5)*GC.MAP.CELL.P_WIDTH;
        y = (point.y+0.5)*GC.MAP.CELL.P_HEIGHT;
    }
    else {
        x = (GC.MAP.WIDTH - 1 - point.x - 0.5)*GC.MAP.CELL.P_WIDTH;
        y = (GC.MAP.HEIGHT - 1 - point.y - 0.5)*GC.MAP.CELL.P_HEIGHT;
    }
    return cc.p(x,y);
}
Helper.convertLogicCellToMapCell = function(logicCellPoint, isMyMap){ // O server -> o client
    if (isMyMap){ // W8 H6 0,0 --> 0,5  3,4 --> 4,2
        var tmpMap = gv.battleController.players[0].map;

        var x = logicCellPoint.y;
        var y = GC.MAP.HEIGHT - 1 - logicCellPoint.x;

        return cc.p(x,y);
    }
    else{
        var tmpMap = gv.battleController.players[1].map;

        var x = logicCellPoint.y;
        var  y = GC.MAP.HEIGHT - 1 - logicCellPoint.x;

        return cc.p(x,y);
    }
}
Helper.convertMapCellToLogicCell = function(mapCellPoint, isMyMap){ 
    if (isMyMap){ //5 - 3  --> 2 - 5  W7  H5
        var tmpMap = gv.battleController.players[0].map;

        var x = GC.MAP.HEIGHT - 1 - mapCellPoint.y;
        var y = mapCellPoint.x;

        return cc.p(x,y);
    }
    else{ //5 - 2 --> 3 - 1
        var tmpMap = gv.battleController.players[1].map;
        /*
        var x = mapCellPoint.y;
        var  y = GC.MAP.WIDTH - 1 - mapCellPoint.x;

         */
        var x = GC.MAP.HEIGHT - 1 - mapCellPoint.y;
        var y = mapCellPoint.x;

        //return cc.p(x+1,y);
        return cc.p(x,y);
    }
}
Helper.convertMapPixelToLogicPoint = function(mapPixel, isMyMap){ // Diem client -> server
    if (isMyMap){ //W8 H6
        // start in mapCell(0,0) --> mapPoint(0, 0)
        // --> LogicPoint(6,0)
        // LogicPoint(0,0) --> mapPoint(GC.MAP.HEIGHT * GC.MAP.CELL.P_HEIGHT, GC.MAP.WIDTH * GC.MAP.CELL.P_WIDTH)
        var x = (GC.MAP.HEIGHT*GC.MAP.CELL.P_HEIGHT - mapPixel.y)/GC.MAP.CELL.P_HEIGHT;
        var y = mapPixel.x/GC.MAP.CELL.P_WIDTH;
        return cc.p(Math.round(x * 1000)/1000,Math.round(y * 1000)/1000);
    }
    else{
        //MapPixel(0,0) --> LogicPoint(1,7) --> Logic(1,W-1)
        //MapPixel(539,385) --> LogicPoint(6,0)
        //MapPixel(264,197) --> LogicPoint(3.5, 3.5)
        var x = mapPixel.y / GC.MAP.CELL.P_HEIGHT + 1;
        var y = ((GC.MAP.WIDTH - 2)*GC.MAP.CELL.P_WIDTH - mapPixel.x)/GC.MAP.CELL.P_HEIGHT + 1;

        return cc.p(Math.round(x * 1000)/1000,Math.round(y * 1000)/1000);
    }
}
Helper.convertLogicPointToMapPixel = function(logicPoint, isMyMap){ // Diem server -> Client
    if (isMyMap){ //W8 H6
        // start in mapCell(0,0) --> mapPoint(0, 0)
        // --> LogicPoint(6,0)
        // LogicPoint(0,0) --> mapPoint(GC.MAP.HEIGHT * GC.MAP.CELL.P_HEIGHT, GC.MAP.WIDTH * GC.MAP.CELL.P_WIDTH)
        var x = logicPoint.y *  GC.MAP.CELL.P_WIDTH;
        var y =GC.MAP.HEIGHT*GC.MAP.CELL.P_HEIGHT - logicPoint.x *  GC.MAP.CELL.P_HEIGHT;
        return cc.p(x,y);
    }
    else{
        var x = ((GC.MAP.WIDTH - 2)*GC.MAP.CELL.P_WIDTH) - ((logicPoint.y - 1)*GC.MAP.CELL.P_HEIGHT);
        var y = (logicPoint.x - 1) * GC.MAP.CELL.P_HEIGHT;
        return cc.p(x,y);
    }
};

Helper.getDistance = function (p1, p2){
    //cc.log("distance: " + Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)));
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
Helper.checkNull = function (variable){
    try {
        if (variable == null){
            return true;
        }
        variable.developerkhongduocphepdungbiennay = null;
        return false;
    }
    catch(err) {
        variable = null;
        return true;
    }
}
Helper.plus2Point = function (p1,p2){
    var x = p1.x + p2.x;
    var y = p1.y + p2.y;
    return cc.p(x,y);
}
// Ham co 2 diem p1, p2. Diem p1 di chuyen toi p2 voi toc do speed/s. Ham se cho ra vi tri moi cua p1 sau thoi gian dt
Helper.pointMoveToPoint = function (p1,p2,speed,dt){
    var dis = Helper.getDistance(p1,p2);
    var timeToP2 = dis/speed;
    var newX = p1.x + (p2.x - p1.x)/timeToP2 * dt;
    var newY = p1.y + (p2.y - p1.y)/timeToP2 * dt;
    return cc.p(newX,newY);
}

Helper.roundTo3 = function(num){
    return Math.round(num*1000);
}

Helper.round3 = function(num) {
    return Math.round(num*1000)/1000;
}

Helper.reverseDir = function(dir){
    if( dir == GC.MONSTER.DIRECTION.RIGHT) return GC.MONSTER.DIRECTION.LEFT;
    if(dir == GC.MONSTER.DIRECTION.LEFT) return GC.MONSTER.DIRECTION.RIGHT;
    if(dir == GC.MONSTER.DIRECTION.UP) return GC.MONSTER.DIRECTION.DOWN;
    if(dir == GC.MONSTER.DIRECTION.DOWN) return GC.MONSTER.DIRECTION.UP;
    if(dir == GC.MONSTER.DIRECTION.BOTTOM_LEFT) return GC.MONSTER.DIRECTION.TOP_RIGHT;
    if(dir == GC.MONSTER.DIRECTION.BOTTOM_RIGHT) return GC.MONSTER.DIRECTION.TOP_LEFT;
    if(dir == GC.MONSTER.DIRECTION.TOP_RIGHT) return GC.MONSTER.DIRECTION.BOTTOM_LEFT;
    if(dir == GC.MONSTER.DIRECTION.TOP_LEFT) return GC.MONSTER.DIRECTION.BOTTOM_RIGHT;
}

Helper.checkInArr = function (arr,element){
    for(let i=0;i<arr.length;i++){
        if (arr[i] == element){
            return true;
        }
    }
    return false;
}

Helper.isGreaterBattleId = function(battleObjectId1, battleObjectId2){
    var arr1 = battleObjectId1.split(':');
    var arr2 = battleObjectId2.split(':');

    if(Number(arr1[1]) > Number(arr2[1])) return true;
    if(Number(arr1[1]) < Number(arr2[1])) return false;
    return Number(arr1[2]) > Number(arr2[2]); 
}

