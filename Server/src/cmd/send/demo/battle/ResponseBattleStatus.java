package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import bitzero.server.util.BinaryHelper;
import cmd.CmdDefine;
import controller.BattleController;
import model.Battle.BattleObject;
import model.Battle.BattleStatus;
import model.Battle.Player;
import model.Bullet.Bullet;
import model.Define.ModelDefine;
import model.Map.Cell;
import model.Monster.Monster;
import model.PlayerInfo;
import model.Spell.Spell;
import model.Tower.Tower;

import model.buff.towerbuff.TowerBuff;
import util.StoreMonster;

import model.buff.Buff;
import model.buff.Effect;

import util.supportClass.Pos;
import util.vector.VecInt;

import java.nio.ByteBuffer;
import java.util.*;
import java.util.concurrent.CancellationException;

public class ResponseBattleStatus extends BaseMsg {
    private BattleStatus battleStatus;
    public ResponseBattleStatus(Short error) {
        super(CmdDefine.BATTLE_STATUS,error);
        //this.battleStatus = battleStatus;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();

        return packBuffer(bf);
    }

    protected void putStr(ByteBuffer bf, String value) {
        if (value == null){
            value = "null";
        }
        super.putStr(bf,value);
    }

    public ByteBuffer getStatusByteBuffer(ByteBuffer bf, BattleController battleController, boolean isSwap){
        // thong tin chung cua battle controller
        bf.putInt(battleController.getCurTick());
        bf.putInt(battleController.getCurRound());
        bf.putInt(battleController.getStartRoundTick());
        bf.putInt(battleController.getCurSystemMonsterNum());
        // loai quai he thong
        for(int i = 0; i < 20; ++i){
            for(int j = 0; j < 3; ++j){
                bf.putInt(battleController.getSystemMonsterTypes()[i][j]);
            }
        }
        // 2 players
        Player[] players = battleController.getPlayers();
        if(isSwap){
            Player tmp = players[0];
            players[0] = players[1];
            players[1] = tmp;
        }
        for(int i = 0; i < 2; ++i){
            Player player = players[i];
            // info
            PlayerInfo info = player.getInfo();
            bf.putInt(info.getAvatar());
            putStr(bf, info.getName());
            bf.putInt(info.getTrophy());
            // Hp
            bf.putInt(player.getCurHp());

            // Energy
            bf.putInt(player.getCurEnergy());

            // cardlist
            LinkedList<BattleObject> battleObjects = player.getBattleObjects();
            bf.putInt(battleObjects.size());
            for(BattleObject object : battleObjects){
                putStr(bf, object.getBattleObjectId());
                bf.putInt(object.getOrderId());
            }
            // map
            int[][] map = player.getMap().getShowArr(); //getShowArr not getNative
            for(int u = 0; u < ModelDefine.MAP_MAX_ROW; ++u){
                for(int v = 0; v < ModelDefine.MAP_MAX_COLUMN; ++v){
                    bf.putInt(map[u][v]);
                }
            }

            // SystemMonsterId and PlaceMonsterId
            bf.putInt(player.getGeneratedSystemMonsterId());
            bf.putInt(player.getGeneratedPlaceMonsterId());

            //system monsters
            LinkedList<Monster> systemMonsters = player.getSystemMonsters();
            bf.putInt(systemMonsters.size());
            for(Monster monster: systemMonsters){
                putStr(bf,monster.getBattleObjectId()); // id
                bf.putInt(monster.getObjectId()); // type
                bf.putInt(monster.hpRate); // hp rate
            }

            //Place monsters
            ArrayList<StoreMonster> placedMonster = player.getPlacedMonsters();
            bf.putInt(placedMonster.size());
            for(StoreMonster storeMonster: placedMonster){
                Monster monster = storeMonster.monster;
                putStr(bf,monster.getBattleObjectId()); // id
                bf.putInt(monster.getObjectId()); // type
                bf.putInt(monster.hpRate); // hp rate

                bf.putInt(storeMonster.tick); // tick to Release
            }

            // list monster
            LinkedList<Monster> monsters = player.getMonsterInMapList();
            bf.putInt(monsters.size());
            for(Monster monster : monsters){
                //todo-Phong
                bf.putInt(monster.getObjectId());
                putStr(bf,monster.getBattleObjectId());
//                bf.put((byte) (monster.isSystemMonster? 1 : 0));
                bf.putDouble(monster.hp);
                bf.putDouble(monster.curHp);
                bf.putDouble(monster.speed);
                bf.putDouble(monster.curSpeed);
                bf.putInt(monster.counter);

                bf.putDouble(monster.x);
                bf.putDouble(monster.y);
                bf.putInt(monster.curr_direction);

                String s = "";
                for( int j = monster.next_cell; j < monster.path.size(); j++){
                    s = s + monster.path.get(j).x + "," + monster.path.get(j).y + ":";
                }
                putStr(bf, s);
                //LA
                bf.putInt(monster.getStatus());
                putBoolean(bf, monster.isActive());
                LinkedHashMap<Spell, Integer> spells = monster.getSpells();
                bf.putInt(spells.size());
                Set<Map.Entry<Spell,Integer>> spellSet = spells.entrySet();
                for (java.util.Map.Entry<Spell, Integer> it : spellSet) {
                    Integer tick = it.getValue();
                    Spell spell = it.getKey();
                    putStr(bf, spell.getBattleObjectId());
                    bf.putInt(tick);
                }

                //HA
                bf.putDouble(monster.getSlowByBuff());
                ArrayList<Buff> buffs = monster.getBuffs();
                bf.putInt(buffs.size());
                for(Buff buff: buffs){
                    putStr(bf,buff.getBattleObjectId());
                }

                //LA
                bf.putDouble(monster.collisionV);
                bf.putInt(monster.collisionT);
                bf.putInt(monster.collisionD);
                Monster collisionMonster = monster.collisionMonster;
                if(collisionMonster != null){
                    bf.putInt(1);
                    putStr(bf, collisionMonster.getBattleObjectId());
                }else{
                    bf.putInt(0);
                }
                Pos passingPoint = monster.passingPoint;
                if(passingPoint != null){
                    bf.putInt(1);
                    bf.putDouble(passingPoint.x);
                    bf.putDouble(passingPoint.y);
                }
                else{
                    bf.putInt(0);
                }

            }
            LinkedList<Buff> buffs = player.getBuffInMapList();
            bf.putInt(buffs.size());
            //list buff
            for(Buff buff: buffs){
                //todo-Hanh
                putStr(bf,buff.getBattleObjectId());
                bf.putInt(buff.getBuffType());
                bf.putInt(buff.getBuffTypeOrder());
                if (buff.getIsActive()){
                    bf.putInt(1);
                }
                else {
                    bf.putInt(0);
                }
                bf.putInt(buff.getStat());
                bf.putDouble(buff.getTimeRemaining());
                int effectListSize = buff.getEffectList().size();
                bf.putInt(buff.getEffectList().size());
                for(int j = 1;j < effectListSize; j++){
                    Effect effect = buff.getEffectList().get(j);
                    putStr(bf,effect.getName());
                    putStr(bf,effect.getType());
                    bf.putDouble(effect.getValue());
                }
            }

            LinkedList<Tower> towers = player.getTowerInMapList();
            bf.putInt(towers.size());
            //list tower
            for(Tower tower: towers){
                //todo-Hanh
                putStr(bf,tower.getBattleObjectId());
                bf.putInt(tower.getOrderId());

                VecInt cellPoint = tower.getCell().getPosInMap();
                bf.putInt(cellPoint.x);
                bf.putInt(cellPoint.y);
                bf.putInt(tower.getTickToActive());
                bf.putInt(tower.getCurStat());

                bf.putDouble(tower.getCurTimeWaiting());
                if (tower.getTargetMonster() == null){
                    putStr(bf,"null");
                }
                else {
                    putStr(bf,tower.getTargetMonster().getBattleObjectId());
                }
                Pos targetPos = tower.getTargetPos();
                bf.putDouble(targetPos.x);
                bf.putDouble(targetPos.y);
                if (tower.getIsShootBullet()) {
                    bf.putInt(1);
                }
                else {
                    bf.putInt(0);
                }
                bf.putInt(tower.getNumBulletShooted());
                bf.putDouble(tower.getCurDamage());
                bf.putDouble(tower.getCurAttackSpeed());
                bf.putDouble(tower.getCurRange());

                int buffSize = tower.getBuffs().size();
                bf.putInt(buffSize);
                for(int k=0;k<buffSize;k++){
                    Buff buff = tower.getBuffs().get(k);
                    putStr(bf,buff.getBattleObjectId());
                }
                TowerBuff towerBuff = tower.getTowerBuff();
                if (towerBuff == null){
                    putStr(bf,"null");
                }
                else
                {
                    putStr(bf,towerBuff.getBattleObjectId());
                }
                //LA
                LinkedHashMap<Spell, Integer> spells = tower.getSpells();
                bf.putInt(spells.size());
                Set<Map.Entry<Spell,Integer>> s = spells.entrySet();
                for (java.util.Map.Entry<Spell, Integer> it : s) {
                    Integer tick = it.getValue();
                    Spell spell = it.getKey();
                    putStr(bf, spell.getBattleObjectId());
                    bf.putInt(tick);
                }

            }

            //list bullet
            LinkedList<Bullet> bullets = player.getBulletInMapList();
            bf.putInt(bullets.size());
            for(Bullet bullet: bullets){
                //todo-Hanh
                putStr(bf,bullet.getBattleObjectId());
                bf.putInt(bullet.getType());
                putStr(bf,bullet.getTower().getBattleObjectId());
                bf.putDouble(bullet.getDamage());
                bf.putDouble(bullet.getRadius());
                bf.putDouble(bullet.getSpeed());
                Pos curPos = bullet.getCurPos();
                bf.putDouble(curPos.x);
                bf.putDouble(curPos.y);
                if (bullet.getTargetMonster() != null) {
                    putStr(bf,bullet.getTargetMonster().getBattleObjectId());
                }
                else {
                    putStr(bf,"null");
                }
                Pos targetPos = bullet.getTargetPos();
                bf.putDouble(targetPos.x);
                bf.putDouble(targetPos.y);

                bf.putInt(bullet.getStat());
                bf.putInt(bullet.getTargetBuffType());

                // boomerang Bullet
                if (bullet.getIsComeBack()){
                    bf.putInt(1);
                }
                else {
                    bf.putInt(0);
                }

                Vector<Monster> hittedMonster = bullet.getHittedMonster();

                if (hittedMonster == null){
                    bf.putInt(0);
                    continue;
                }
                else {
                    bf.putInt(hittedMonster.size());
                }

                for(Monster monster: hittedMonster){
                    putStr(bf,monster.getBattleObjectId());
                }

            }


            // list Cell
            Cell[][] cellMatrix = player.getMap().getCellMatrix();

            for(int u = 0; u < ModelDefine.MAP_MAX_ROW; ++u){
                for(int v = 0; v < ModelDefine.MAP_MAX_COLUMN; ++v){
                    //todo-Hanh

                    Cell cell = cellMatrix[u][v];
                    bf.putInt(cell.getObstacleType());
                    Tower tower = (Tower)cell.getObstacle();

                    if (tower == null){
                        putStr(bf,"null");
                    }
                    else putStr(bf,tower.getBattleObjectId());


                    bf.putInt(cell.getBuffType());


                }
            }

            // list spell
            LinkedList<Spell> spells = player.getSpellInMapList();
            bf.putInt(spells.size());
            for(Spell spell : spells){
                putStr(bf, spell.getBattleObjectId());
                bf.putInt(spell.getObjectId());
                Pos curPos = spell.getCurPos();
                bf.putDouble(curPos.x);
                bf.putDouble(curPos.y);
                bf.putInt(spell.getLeftTick());
                bf.putInt(spell.getAnimTick());
            }

            // list trapped monster

            LinkedList<String> trappedIds = player.getTrappedMonsters();
            bf.putInt(trappedIds.size());
            for(String id: trappedIds){
                putStr(bf, id);
            }



        }
        return bf;
    }
}
