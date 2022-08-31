package model.Battle;

import controller.BattleController;
import controller.IDController;
import controller.MainController;
import model.Define.MonsterDefine;
import model.Map.Cell;
import model.Map.Map;
import model.Bullet.Bullet;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.PlayerInfo;
import model.Spell.Spell;
import model.Tower.Tower;
import model.buff.Buff;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import util.Helper;
import util.StoreMonster;
import util.readJson.ModelJson;
import service.server.BattleServerHandler;
import util.supportClass.Pos;
import util.vector.VecDouble;
import util.vector.VecInt;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Objects;

public class Player implements Cloneable {
    public BattleController battleController;
    protected PlayerInfo info;
    protected Player competitorManager;
    protected Map map;
    protected LinkedList<Tower> towerInMapList;
    protected LinkedList<Bullet> bulletInMapList;
    protected LinkedList<Monster> monsterInMapList;
    protected LinkedList<Spell> spellInMapList;
    protected LinkedList<Buff> buffInMapList;
    protected LinkedList<Monster> systemMonsters;
    protected LinkedList<String> trappedMonsters;
    protected LinkedList<Tower> towerWaiting;
    protected LinkedList<BattleObject> battleObjects; // 100 vật thể
    protected int curHp;
    protected int curEnergy;

    protected ArrayList<StoreMonster> placedMonsters;

    protected int tickReleaseMonster;
    protected int player_ID;
    protected boolean lose;


    protected int generatedSystemMonsterId;
    protected int generatedPlaceMonsterId;




    public Player(int  player_ID, BattleController battleController){
        this.battleController = battleController;
        this.player_ID = player_ID;
        this.info = IDController.getPlayerByID(player_ID);
        //this.curTick = 0;
        this.tickReleaseMonster = 0;
        //this.startRoundTick = 0;
        this.curHp = ModelDefine.START_HP;
        this.curEnergy = ModelDefine.START_ENERGY;
        this.towerInMapList = new LinkedList<>();
        this.buffInMapList = new LinkedList<>();
        this.bulletInMapList = new LinkedList<>();

        this.monsterInMapList = new LinkedList<>();

        this.spellInMapList = new LinkedList<>();

        this.systemMonsters = new LinkedList<>();
        this.trappedMonsters = new LinkedList<>();
        this.placedMonsters = new ArrayList<>();
        this.towerWaiting = new LinkedList<>();
        this.map = new Map(Map.genBuffCells(ModelDefine.MAP_AMOUNT_BUFF_CELL),this);
        this.battleObjects = BattleObjectFactory.createBattleObjects(player_ID, 100);
        this.lose = false;

        this.generatedSystemMonsterId = 0;
        this.generatedPlaceMonsterId = 0;
    }
    @Override
    public Object clone() throws CloneNotSupportedException {
        Player cloneItem = (Player) super.clone();
        cloneItem.info = (PlayerInfo) cloneItem.info.clone();
        cloneItem.map = (Map) cloneItem.map.clone();
        cloneItem.buffInMapList = (LinkedList<Buff>) cloneItem.buffInMapList.clone();
        cloneItem.towerInMapList = (LinkedList<Tower>) cloneItem.towerInMapList.clone();
        cloneItem.bulletInMapList = (LinkedList<Bullet>) cloneItem.bulletInMapList.clone();

        cloneItem.monsterInMapList = (LinkedList<Monster>) cloneItem.monsterInMapList.clone();

        cloneItem.battleObjects = (LinkedList<BattleObject>) cloneItem.battleObjects.clone();

        cloneItem.systemMonsters = (LinkedList<Monster>) cloneItem.systemMonsters.clone();
        cloneItem.placedMonsters = (ArrayList<StoreMonster>) cloneItem.placedMonsters.clone();
        cloneItem.curHp = this.curHp;
        return cloneItem;
    }

    // Gen id
    public String getSystemMonsterId(){
        String s = "Monster:1:" + this.generatedSystemMonsterId;
        this.generatedSystemMonsterId++;
        return s;
    }
    public String getPlaceMonsterId(){
        String s = "Monster:2:" + this.generatedPlaceMonsterId;
        this.generatedPlaceMonsterId++;
        return s;
    }

    // getter and setter
    public LinkedList<Monster> getMonsterInMapList() {
        return monsterInMapList;
    }

    public LinkedList<Tower> getTowerInMapList() {
        return towerInMapList;
    }

    public LinkedList<Bullet> getBulletInMapList() {
        return bulletInMapList;
    }

    public LinkedList<Buff> getBuffInMapList() {
        return buffInMapList;
    }

    public LinkedList<Spell> getSpellInMapList() {
        return spellInMapList;
    }

    public Map getMap(){
        return this.map;
    }


    public int getGeneratedSystemMonsterId() {return generatedSystemMonsterId;}

    public LinkedList<String> getTrappedMonsters() {
        return trappedMonsters;
    }


    public int getGeneratedPlaceMonsterId() { return generatedPlaceMonsterId; }

    /*public int getCurTick() {
        return curTick;
    }*/

    public int getCurHp() {
        return curHp;
    }

    public int getCurEnergy() {
        return curEnergy;
    }

    public boolean getLose(){
        return this.lose;
    }

    public PlayerInfo getInfo() {
        return info;
    }

    public LinkedList<Monster> getSystemMonsters(){
        return systemMonsters;
    }

    public ArrayList<StoreMonster> getPlacedMonsters() { return placedMonsters; }

    public LinkedList<BattleObject> getBattleObjects(){
        return this.battleObjects;
    }

    public int getPlayer_ID() {
        return player_ID;
    }

    private void setLose(){
        this.curHp = 0;
    }

    // add methods
    public void addBullet(Bullet bullet) {
        this.bulletInMapList.addLast(bullet);
    }

    public boolean addTower(String id, VecInt cellPoint,int tick){

        Tower tower = (Tower)getBattleObjectById(id);

        if (tower == null){
            System.out.println("Cannot add tower because Tower Null");
            return false;
        }
        if (!this.checkCardInHand(id)){
            System.out.println("Cannot add tower because Card Null");
            return false;
        }
        if (!tower.putTower(cellPoint,this,tick)) {
            System.out.println("Cannot add tower because Cell have Obstacle");
            return false;
        }
        if (!this.monsterFindPathAgain() || !this.decreaseEnergy(tower.getEnergy())){
            this.dropTower(cellPoint);
            return false;
        }
        this.towerInMapList.add(tower);
        this.dropCard(id);

        /*
        if (this.curEnergy < tower.getEnergy()){
            return false;
        }
        this.curEnergy -= tower.getEnergy();
        this.towerInMapList.addLast(tower);
        this.towerWaiting.addLast(tower);

         */

        return true;
    }
    public boolean dropTower(VecInt cellPoint) {
       if (!this.map.dropTower(cellPoint)){
           return false;
       }
       this.monsterFindPathAgain();
       return true;
    }
    public boolean upgradeTower(String id, VecInt cellPoint) {

        Tower tower = (Tower) getBattleObjectById(id);

        if (tower == null) {
            System.out.println("Cannot upgrade tower because Tower Null");
            return false;
        }
        if (!this.checkCardInHand(id)){
            System.out.println("Cannot add tower because Card Null");
            return false;
        }
        Cell cell = this.map.getCell(cellPoint);
        if (cell.getObstacleType() != ModelDefine.CELL_OBSTACLE_TOWER){
            return false;
        }
        Tower tower1 = (Tower)cell.getObstacle();
        if (tower1.getOrderId() != tower.getOrderId()){
            return false;
        }
        if (!this.decreaseEnergy(tower.getEnergy())) {
            return false;
        }
        if (!tower1.upgrade()){
            this.decreaseEnergy(tower.getEnergy() * (-1));
            return false;
        }
        this.dropCard(id);
        return true;
    }

    public void addBuff(Buff buff){
        for(Buff buff1: this.buffInMapList){
            if (buff == buff1){
                return;
            }
        }
        this.buffInMapList.add(buff);
    }

    public void addMonster(int type, int curr_direction, VecDouble position){
        Monster monster = new Monster(type, 1, 1, this.getSystemMonsterId(), true);

        int i = 0;

        for(Monster m : this.monsterInMapList){
            if(m.getBattleObjectId().charAt(8) == '1') {
                i++;
            }
            else {
                break;
            }
        }

        this.monsterInMapList.add(i, monster);
        monster.run(map, this, curr_direction, position);

    }

    public BattleObject getBattleObjectById(String battleId){
        for(BattleObject object : battleObjects){
            //System.out.println("Spell id: " + object.getBattleObjectId());
            if(Objects.equals(object.getBattleObjectId(), battleId)){
                return object;
            }
        }
        return null;
    }
    public void addSpell(Spell spell){
        spellInMapList.add(spell);
    }

    /*public void doActiveTower(){
        while (this.towerWaiting.size() > 0 && this.curTick == this.towerWaiting.getFirst().getTickToActive()){
            this.towerWaiting.getFirst().doActiveTower();
            this.towerWaiting.removeFirst();
        }
    }*/
    public void releaseMonster(){
        if(this.systemMonsters.size() > 0){
            this.monsterInMapList.addLast(this.systemMonsters.getFirst());
            this.systemMonsters.removeFirst();
            this.tickReleaseMonster+= ModelDefine.TICK_PER_MONSTER;
        }
    }

    public void startRound(LinkedList<Monster> monsters){
        for(Monster monster: monsters){
            systemMonsters.add(monster);
        }
    }

    //release a system monster
    public void releaseSystemMonster(){
//        System.out.print("Release System Monsters: ");
        if(systemMonsters != null && systemMonsters.size() > 0){
            Monster monster = systemMonsters.getFirst();
//            System.out.println("release monster: " + monster.getBattleObjectId());
            systemMonsters.removeFirst();
//            monster.setPlayer(this);
            //monsterInMapList.add(monster);

            int i = 0;
            for(Monster m : this.monsterInMapList){
                if(m.getBattleObjectId().charAt(8) == '1') {
                    i++;
                }
                else {
                    break;
                }
            }

            monsterInMapList.add(i, monster);
            monster.run(map, this);
//            System.out.println(monster.getBattleObjectId());
        }
    }

    public boolean createPlaceMonster(int type, int tick, Player currPlayer){
        int totalTowerLevel = this.getOpponentPlayer().getTotalStatTower();

        int rate = totalTowerLevel/5;
        if(rate > 6) rate = 6;

        JSONObject jsonMonsterRate = (JSONObject) Helper.ReadJsonObject(ModelJson.MonsterRate_Json);
        JSONObject jsonMonsterGen = (JSONObject) Helper.ReadJsonObject(ModelJson.MonsterGeneration_Json);

        try {
            assert jsonMonsterRate != null;
            assert jsonMonsterGen != null;

            JSONObject multiplier = (JSONObject) jsonMonsterRate.getJSONObject("multiplier");
            JSONObject base = jsonMonsterRate.getJSONObject("base");

            JSONObject towerLevelObj = (JSONObject) multiplier.get(String.valueOf(rate));

            int hpRate = towerLevelObj.getInt("hp");
            int numMonsterRate = towerLevelObj.getInt("monster");
            int baseNumMonster = 1;

            int numMonster = (int) Math.ceil(baseNumMonster * numMonsterRate);

            if(!currPlayer.decreaseEnergy(numMonster)) return false;

//          System.out.println("numMonster: " + numMonster + "....Round: " + round);

            ArrayList<StoreMonster> temp = new ArrayList<>();
            tick += 1;
            for(int i = 0; i < numMonster; i++){
                ArrayList a = new ArrayList();
                temp.add(new StoreMonster(new Monster(type, 1, hpRate, getPlaceMonsterId(), false), tick));
                tick +=  ModelDefine.TICK_PER_MONSTER;
            }

            ArrayList<StoreMonster> newArr = new ArrayList<>();
            int i = 0;
            int j = 0;
            while (i < this.placedMonsters.size() && j < temp.size()){
                if(this.placedMonsters.get(i).tick <= temp.get(j).tick){
                    newArr.add(this.placedMonsters.get(i));
                    i++;
                }
                else{
                    newArr.add(temp.get(j));
                    j++;
                }
            }
            while (i < this.placedMonsters.size()){
                newArr.add(this.placedMonsters.get(i));
                i++;
            }
            while (j < temp.size()){
                newArr.add(temp.get(j));
                j++;
            }

            this.placedMonsters = newArr;

//             for(int k = 0; k < this.placedMonsters.size(); k++){
//                 System.out.println("===================== Tha quai: " + this.placedMonsters.get(k).monster.getBattleObjectId() + ": " + this.placedMonsters.get(k).tick);
//             }
            return true;
        }
        catch (JSONException e) {
            e.printStackTrace();
        }

        return false;
    }

    private void releasePlaceMonster(){
        if(this.placedMonsters == null || this.placedMonsters.size() == 0) return;

        while (this.placedMonsters.size() > 0 && battleController.getCurTick() == this.placedMonsters.get(0).tick) {
            Monster monster = this.placedMonsters.get(0).monster;
            this.placedMonsters.remove(0);
            //monster.setPlayer(this);
            int x = Integer.parseInt(monster.getBattleObjectId().split(":")[2]);

            int i = 0;
            for (Monster m : monsterInMapList) {
                if (m.getBattleObjectId().charAt(8) == '1' || Integer.parseInt(m.getBattleObjectId().split(":")[2]) < x) {
                    i++;
                } else {
                    break;
                }
            }

            monsterInMapList.add(i, monster);
            monster.run(map, this);
            System.out.println("Release Monster: " + monster.getBattleObjectId());
        }
    }

    // DecreaaseHP and Up energy
    public void decreaseCurHp(String type){
        int hp = this.curHp;
        if (type.equals("boss")){
            this.curHp -= 5;
        }
        else {
            this.curHp -=1;
        }

        if (this.curHp < 0){
            this.curHp = 0;
        }

        this.increaseEnergy(10*(hp - this.curHp));
    }

    public void increaseEnergy(int energy) {
        this.curEnergy += energy;
    }

    // update sau 1 tick
    public void update(double dt){
        //System.out.println("============== tick: " + battleController.getCurTick() + " =================");
        //System.out.println("Player curHp: "+this.curHp);

        this.releasePlaceMonster();

        updateBuff(dt);
        updateSpell(dt);
        updateMonster(dt);
        updateTower(dt);
        updateBullet(dt);

        checkMonsterAgain();

        clearTrash();
    }

    public void checkMonsterAgain() {
        Monster flag = null;
        for(Monster monster: monsterInMapList) {
            // Check monster die
            if (monster.wentHome) { // Monster da ve nha
                this.decreaseCurHp(monster.category);
            }
            else {
                if(!monster.isAlive) {
                    this.increaseEnergy(monster.gainEnergy);
                }
            }

            // Check boss skill
            if (monster.bossSkill == ModelDefine.BOSS_SKILL_MOC_TINH) {
                if (monster.counter % ModelDefine.BOSS_MOC_TINH_TIME_TO_RELEASE == 0) {
                    flag = monster;
                    break;
                }
            }

            else if (monster.bossSkill == ModelDefine.BOSS_SKILL_GOLEM){
                if(!monster.isAlive && !monster.wentHome){
                    flag = monster;
                    break;
                }
            }
        }

        // Set boss skill
        if(flag != null) {
            if(flag.bossSkill == ModelDefine.BOSS_SKILL_MOC_TINH){
                this.addMonster(12, flag.curr_direction, new VecDouble(flag.x, flag.y));
            }
            else if (flag.bossSkill == ModelDefine.BOSS_SKILL_GOLEM) {
                VecInt p1 = flag.getCurrPos();

                VecDouble pos1 = new VecDouble(p1.x + 0.4, p1.y + 0.4);
                VecDouble pos2 = new VecDouble(p1.x + 0.6, p1.y + 0.6);

                this.addMonster(10, flag.curr_direction, pos1);
                this.addMonster(10, flag.curr_direction, pos2);
            }

        }
    }

    public void updateMonster(double dt) {
        // Update monster
        for(Monster monster: monsterInMapList){
            checkMonsterCollision(monster); // LA
            monster.update(dt);
        }
    }
    private void checkMonsterCollision(Monster monster){
        for(Monster monster2: monsterInMapList){
            if(Objects.equals(monster.getBattleObjectId(), monster2.getBattleObjectId()) == false){
                monster.checkCollision(monster2);
            }
        }
    }
    public void updateTower(double dt){
        for (Tower tower: this.towerInMapList){
            tower.update(dt);
        }
    }
    public void updateBullet(double dt){
        for (Bullet bullet: this.bulletInMapList){
            bullet.update(dt);
            //System.out.println(bullet.toJson());
        }
    }


    private void updateSpell(double dt) {
        for(Spell spell: spellInMapList){
            System.out.println("spell update: " + spell.getBattleObjectId() + ", leftTick: " + spell.getLeftTick());
            if(spell.update(monsterInMapList, towerInMapList) == false){
                spellInMapList.remove(spell);
            }
        }
    }

    private void updateBuff(double dt) {
        //System.out.println("Player co "+this.buffInMapList.size() + " Buff");
        for(Buff buff: buffInMapList){
            //System.out.println("Player buff "+" co batlleId la: "+buff.getBattleObjectId());
            buff.updateBuff(dt);
        }
    }
    private void clearTrash() {
        this.monsterInMapList.removeIf(monster -> !monster.getIsAlive());
        this.bulletInMapList.removeIf(bullet -> !bullet.getIsAlive());
        this.buffInMapList.removeIf(buff -> !buff.getIsActive());
    }

    public int getSpellNum(){ return spellInMapList.size();}
    public int getOrderIdCardInHand(int orderId){
        LinkedList<BattleObject> list = this.battleObjects;
        int index = -1;
        for(int i=0;i<Math.min(list.size(),ModelDefine.amountCardInHand);i++){
            if (list.get(i).getOrderId() == orderId) {
                index = i;
            }
        }
        return index;
    }
    public boolean checkCardInHand(String battleObjectID){
        LinkedList<BattleObject> list = this.battleObjects;
        for(int i = 0;i < Math.min(list.size(),ModelDefine.amountCardInHand); i++){
            if (list.get(i).getBattleObjectId().equals(battleObjectID)){
                return true;
            }
        }
        return false;
    }
    public boolean dropCard( String battleObjectID){
        LinkedList<BattleObject> list = this.battleObjects;
        int index = -1;
        if (list.size() < ModelDefine.amountCardInHand + 1){
            return false;
        }
        for(int i = 0;i < ModelDefine.amountCardInHand; i++){
            if (list.get(i).getBattleObjectId().equals(battleObjectID)){
                index = i;
            }
            System.out.println("pop card id: " + list.get(i).getBattleObjectId());
        }
        if (index == -1){
            return false;
        }
        list.remove(index);

        int t = ModelDefine.amountCardInHand;
        while (t < list.size() && this.getOrderIdCardInHand(list.get(t).getOrderId()) != -1) {
            t++;
        }
        if ( t < list.size()){
            int k = ModelDefine.amountCardInHand;
            BattleObject tmp1 = list.get(t);
            BattleObject tmp2 = list.get(k);
            list.remove(t);
            list.add(t,tmp2);
            list.remove(k);
            list.add(k,tmp1);
        }
        return true;
    }
    public boolean monsterFindPathAgain(){
        Monster tempMonster = new Monster(0, 1, 1, "test", true);
        if(!tempMonster.checkPath(map)) {
//            System.out.println("cccccccccccccc");
            return false;
        }
        for(Monster monster: monsterInMapList){
            if(!monster.checkPath(map)){
//                System.out.println("bbbbbbbbbbbbbbbbb");
                return false;
            }
        }
        for(Monster monster: monsterInMapList){
            monster.setPath();
        }
//        System.out.println("aaaaaaaaaaaaaaaaaaaaaa");
        return true;
    }
    public boolean decreaseEnergy(int delta){
        if(curEnergy - delta >= 0){
            curEnergy -= delta;
            return true;
        }
        return false;
    }

    public void popBuff(Buff tmp) { this.buffInMapList.remove(tmp);
    }

    public void addBattleServerHandler(BattleServerHandler battleServerHandler) {
    }

    public void endMatch() {
        //MainController.endMatch(info.getID());
    }

    public boolean makeGesture(String monsterId) {
        Monster balloonMonster = null;
        for (Monster monster : this.monsterInMapList) {
            if (monster.getBattleObjectId().equals(monsterId)) {
                balloonMonster = monster;
                break;
            }
        }

        if (balloonMonster == null) return false;

        for (Monster monster : this.monsterInMapList) {
            if (monster != balloonMonster) {
                if (balloonMonster.getCurPos().getDistance(monster.getCurPos()) <= ModelDefine.BOSS_DEMON_TREE_RANGE) {
                    monster.healing(0.1);
                }
            }
        }

        balloonMonster.hp += (double) Math.round(balloonMonster.hp * 0.2 * 1000) / 1000;
        balloonMonster.healing(1.0);

        return true;
    }

    public void addTrappedMonster(String monsterId){
        trappedMonsters.add(monsterId);
    }

    public void releaseTrappedMonster() {
        if(this.trappedMonsters != null && this.trappedMonsters.size() > 0){
            String monsterId = trappedMonsters.getFirst();
            trappedMonsters.removeFirst();
            Monster monster = this.findMonsterByBattleId(monsterId);
            monster.setCurrPos(0.5, 0.5);
            monster.setStatus(MonsterDefine.NORMAL_STATUS);
            monster.run(map, this);
        }
    }
    public Monster findMonsterByBattleId(String id){
        for(Monster monster: monsterInMapList){
            if(Objects.equals(monster.getBattleObjectId(), id)){
                return monster;
            }
        }
        return null;
    }
    public boolean isEmptyPos(Pos pos, double radius, int d){
        for(Monster monster:monsterInMapList){
            if(!monster.isFlying()){
                Pos monsterPos = monster.getCurPos();
                if(pos.x - monsterPos.x <= 1 && pos.y - monsterPos.y <= 1){
                    if(pos.getDistance(monsterPos) + 0.0001 < (radius + monster.collisionRadius)){
                        if(d != ModelDefine.DIR_NULL){
                            if(d != monster.getRealDirection()){
                                continue;
                            }else{
                                if(monster.checkPassingPoint(d, pos)){
                                    return false;
                                }
                                else {
                                    continue;
                                }
                            }
                        }

                        return false;
                    }
                }
            }

        }
        return true;
    }
    public int getTotalStatTower() {
        int count = 0;
        for (Tower tower : towerInMapList) {
            count += tower.getCurStat();
        }
        return count;
    }
    public Player getOpponentPlayer(){
        return MainController.findBattleByUser(this.info.getID()).getOpponent(this.info.getID());
    }
}
