var BattleStatus = cc.Class.extend({
});
BattleStatus.readBattleStatus = function (inPacket){
    let status = {};
    status.tick = inPacket.getInt();
    cc.log("BattleStatus --- statusTick --- curTick: "+status.tick + " "+gv.battleController.curTick);
    status.round = inPacket.getInt();
    status.startRoundTick = inPacket.getInt();
    status.curSystemMonsterNum = inPacket.getInt();
    status.systemMonsterTypes = [];
    for(let i = 0; i < 20; ++i){
        let round = new Array(3);
        for(let j = 0; j < 3; ++j){
            round[j] = inPacket.getInt();
        }
        status.systemMonsterTypes.push(round);
    }
    status.players = [];
    for(let i = 0; i < 2; ++i){
        let player = {};
        // info
        player.avatar = inPacket.getInt();
        player.name = inPacket.getString();
        player.trophy = inPacket.getInt();

        //hp
        player.curHp = inPacket.getInt();

        //energy
        player.curEnergy = inPacket.getInt();

        // card list
        player.cardNum = inPacket.getInt();
        player.cardList = new Array(player.cardNum);
        for(let j = 0; j < player.cardNum; ++j){
            player.cardList[j] = {};
            player.cardList[j].battleId = inPacket.getString();
            player.cardList[j].objectId = inPacket.getInt();

        }
        // map
        player.map = [];
        for(let j = 0; j < 6; ++j){
            let tmp = new Array(8);
            for(let k = 0; k < 8; ++k){
                tmp[k] = inPacket.getInt();
            }
            player.map.push(tmp);
        }

        // SystemMonsterId and PlaceMonsterId
        player.systemMonsterId = inPacket.getInt();
        player.placeMonsterId = inPacket.getInt();

        // list system monster
        player.systemMonsterNum = inPacket.getInt();
        player.systemMonsters = [];
        for(let j = 0; j < player.systemMonsterNum; ++j){
            let monster = {};
            monster.battleId = inPacket.getString();
            monster.type = inPacket.getInt();
            monster.hpRate = inPacket.getInt();
            player.systemMonsters.push(monster);
        }
        // list place monster
        player.placeMonsterNum = inPacket.getInt();
        player.placeMonsters = [];
        for(let j = 0; j < player.placeMonsterNum; ++j){
            let monster = {};
            monster.battleId = inPacket.getString();
            monster.type = inPacket.getInt();
            monster.hpRate = inPacket.getInt();
            monster.tick = inPacket.getInt();
            player.placeMonsters.push(monster);
        }
        // list monster
        player.monsterNum = inPacket.getInt();
        player.monsterInMapList = [];
        for(let j = 0; j < player.monsterNum; ++j){
            //todo-Phong
            let monster = {};
            monster.type = inPacket.getInt();
            monster.battleId = inPacket.getString();
            // monster.isSystemMonster = inPacket.getByte();
            monster.hp = inPacket.getDouble();
            monster.currHp = inPacket.getDouble();
            monster.speed = inPacket.getDouble();
            monster.curSpeed = inPacket.getDouble();
            monster.counter = inPacket.getInt();
            
            monster.x = inPacket.getDouble();
            monster.y = inPacket.getDouble();
            monster.curDir = inPacket.getInt();
            monster.path = inPacket.getString();
            //LA
            monster.status = inPacket.getInt();
            monster.isActive = inPacket.getBool();
            monster.spellNum = inPacket.getInt();
            cc.log("================================= spell num: " + monster.spellNum);
            monster.spells = [];
            for(let k = 0; k < monster.spellNum; ++k){
                let spell = {};
                spell.battleId = inPacket.getString();
                cc.log("monster id: "+ monster.battleId + ", spell id: " + spell.battleId);
                spell.tick = inPacket.getInt();
                monster.spells.push(spell);
            }
            //HA
            monster.slowByBuff = inPacket.getDouble();
            monster.buffNum = inPacket.getInt();
            monster.buffsBattleId = [];
            for(let k = 0; k < monster.buffNum; ++k){
                let buff = {};
                buff.battleId = inPacket.getString();
                monster.buffsBattleId.push(buff.battleId);
            }

            //LA
            monster.collistionVec = {};
            monster.collistionVec.v = inPacket.getDouble();
            monster.collistionVec.t = inPacket.getInt();
            monster.collistionVec.d = inPacket.getInt();
            let num = inPacket.getInt();
            if(num == 1){
                monster.collisionMonster = inPacket.getString();
            }
            else{
                monster.collisionMonster = null;
            }
            num = inPacket.getInt();
            if(num == 1){
                let x = inPacket.getDouble();
                let y = inPacket.getDouble();
                monster.passingPoint = cc.p(x, y);
            }
            else{
                monster.passingPoint = null;
            }


            player.monsterInMapList.push(monster);
        }
        // list buff
        player.buffNum = inPacket.getInt();
        player.buffInMapList = [];
        for(let j = 0; j < player.buffNum; ++j){
            //todo-Hanh
            let buff = {};
            buff.battleId = inPacket.getString();
            buff.buffType = inPacket.getInt();
            buff.buffTypeOrder = inPacket.getInt();
            let flag = inPacket.getInt();
            if (flag == 1){
                buff.isActive = true;
            }
            else {
                buff.isActive = false
            }
            buff.stat = inPacket.getInt();
            buff.timeRemaining = inPacket.getDouble();
            buff.effectListSize = inPacket.getInt();
            buff.effectList = [];
            buff.effectList.push(null);
            for(let k = 1 ; k < buff.effectListSize; k++){
                let name = inPacket.getString();
                let type = inPacket.getString();
                let value = inPacket.getDouble();
                let effect = new Effect(name,type,value);
                buff.effectList.push(effect);
            }
            player.buffInMapList.push(buff);
        }
        // list tower
        player.towerNum = inPacket.getInt();
        player.towerInMapList = [];
        for(let j = 0; j < player.towerNum; ++j){
            //todo-Hanh
            let tower = {};
            tower.battleId = inPacket.getString();
            tower.type = inPacket.getInt();

            let x = inPacket.getInt();
            let y = inPacket.getInt();
            tower.logicCellPoint = cc.p(x,y);
            tower.tickToActive = inPacket.getInt();
            tower.curStat = inPacket.getInt();

            tower.curTimeWaiting = inPacket.getDouble();
            tower.targetMonsterBattleId = inPacket.getString();
            x = inPacket.getDouble();
            y = inPacket.getDouble();
            tower.targetLogicPoint = cc.p(x,y);
            let k = inPacket.getInt();
            tower.isShootBullet = (k != 0);
            tower.numBulletShooted = inPacket.getInt();
            tower.curDamage = inPacket.getDouble();
            tower.curAttackSpeed = inPacket.getDouble();
            tower.curRange = inPacket.getDouble();
            tower.buffsBattleId = [];
            let buffsBattleIdSize = inPacket.getInt();
            for(let i=0; i < buffsBattleIdSize; i++){
                tower.buffsBattleId.push(inPacket.getString());
            }
            tower.towerBuffBattleId = inPacket.getString();
            //LA
            tower.spellNum = inPacket.getInt();
            tower.spells = [];
            for(let k = 0; k < tower.spellNum; ++k){
                let spell = {};
                spell.battleId = inPacket.getString();
                spell.tick = inPacket.getInt();
                tower.spells.push(spell);
            }
            player.towerInMapList.push(tower);
        }
        // list bullet
        player.bulletNum = inPacket.getInt();
        player.bulletInMapList = [];
        for(let j = 0; j < player.bulletNum; ++j){
            //todo-Hanh
            let bullet = {};
            bullet.battleId = inPacket.getString();
            bullet.type = inPacket.getInt();
            bullet.towerBattleId = inPacket.getString();
            bullet.damage = inPacket.getDouble();
            bullet.radius = inPacket.getDouble();
            bullet.speed = inPacket.getDouble();
            let x = inPacket.getDouble();
            let y = inPacket.getDouble();
            bullet.logicPoint = cc.p(x,y);
            bullet.targetMonsterBattleId = inPacket.getString();
            x = inPacket.getDouble();
            y = inPacket.getDouble();
            bullet.targetLogicPoint = cc.p(x,y);
            bullet.stat = inPacket.getInt();
            bullet.bulletTargetBuffType = inPacket.getInt();

            //Boomerange Bullet
            let flag = inPacket.getInt();
            if (flag == 1){
                bullet.isComeBack = true;
            }
            else {
                bullet.isComeBack = false;
            }
            let hittedMonsterSize = inPacket.getInt();
            bullet.hittedMonsterBattleId = [];
            for(let i = 0; i< hittedMonsterSize;i++){
                bullet.hittedMonsterBattleId.push(inPacket.getString());
            }
        }
        // cell
        player.cellInMapList = [];
        for(let j = 0; j < 6; ++j){
            //todo-Hanh

            let tmp = new Array(8);
            for(let k = 0; k < 8; ++k){
                let cell = {};
                cell.logicPoint = cc.p(j,k);
                cell.obstacleType = inPacket.getInt();
                cell.obstacleBattleId = inPacket.getString();
                cell.buffType = inPacket.getInt();
                cell.posInMap = Helper.convertLogicCellToMapCell(cell.logicPoint,1-i);
                player.cellInMapList.push(cell);
            }
        }

        // list spell
        player.spellNum = inPacket.getInt();
        player.spellInMapList = [];
        for(let j = 0; j < player.spellNum; ++j){
            let spell = {};
            spell.battleId = inPacket.getString();
            spell.objectId = inPacket.getInt();
            spell.curPos = {};
            spell.curPos.x = inPacket.getDouble();
            spell.curPos.y = inPacket.getDouble();
            spell.leftTick = inPacket.getInt();
            spell.animTick = inPacket.getInt();
            player.spellInMapList.push(spell);
        }
        status.players.push(player);

        // list trapped monster ids
        player.trappedNum = inPacket.getInt();
        player.trappedMonsters = [];
        for(let j = 0; j < player.trappedNum; ++j){
            player.trappedMonsters.push(inPacket.getString());
        }
    }
    return status;
};