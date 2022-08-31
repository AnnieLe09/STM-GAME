package model.Monster;


import model.Battle.BattleObject;
import model.Battle.Player;
import model.Define.MapDefine;
import model.Define.ModelDefine;
import model.Define.MonsterDefine;
import model.Map.Map;
import model.Spell.Spell;
import model.buff.Buff;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import util.Helper;
import util.readJson.ModelJson;
import util.supportClass.Pos;
import util.readJson.MonsterJson;
import util.vector.VecDouble;
import util.vector.VecInt;

import java.util.*;

public class Monster extends BattleObject implements Cloneable{
    public String category;
    private String _class;
    public double hp;
    public double speed;
    private double hitRadius;
    private double weight;
    private int energy;
    public int gainEnergy;
    private int numberMonsters;

    public double curHp;
    public double curSpeed;
    public boolean isAlive;
    private LinkedHashMap<Spell, Integer>spells;
    private Player player;
    private ArrayList<Buff> buffs;
    private double slowByBuff;

    public double x;
    public double y;
    public int curr_direction;
    public ArrayList<VecInt> path;
    public ArrayList<VecInt> tempPath;
    public int next_cell;
    private VecInt next_pos;
    public boolean wentHome;
    public int hpRate;

    protected boolean isActive;

//    public int type;
    public boolean isSystemMonster;

    //LA
    public int status;
    public double collisionV;
    public int collisionT;
    public int collisionD;
    public double collisionRadius;
    public Monster collisionMonster;
    public Pos passingPoint;

    private int attackType;
    private double eps = 0.0001;

    public int bossSkill;
    public int counter;

    // Gen id for monster
//    private static int[] generatedSystemMonsterId = new int[] {0,0}; // System monster will have ID: "Monster:1:number
//    private static int genSystemMonsterId (int playerIdx){
//        return generatedSystemMonsterId[playerIdx]++;
//    }
//
//    private static int[] generatedDropMonsterId = new int[] {0,0}; // Drop monster will have ID: "Monster:2:number
//    private static int genDropMonsterId (int playerIdx){
//        return generatedDropMonsterId[playerIdx]++;
//    }
//
//    private static int[] generatedCardMonsterId = new int[] {0}; // Card monster will have ID: "Monster:0:number
//    private static int genCardMonsterId (){ return generatedCardMonsterId[0]++; }

    public Monster(int objectId, int level, int hpRate, String battleObjectId, boolean isSystemMonster) {
        super("Monster", objectId, level);
        this.isSystemMonster = isSystemMonster;
        readMonsterJson();
        this.hp *=  hpRate;
        this.hpRate = hpRate;
        this.curHp = this.hp;
        this.curSpeed = this.speed;
        this.isAlive = true;
        this.curPos = new Pos(ModelDefine.MONSTER_START_POS);
        spells = new LinkedHashMap<>();

        // getId
        if(battleObjectId != null){
            this.battleObjectId = battleObjectId;
        }

        // Init position
        this.x = 0.5;
        this.y = 0.5;

        // Init path
        this.curr_direction = ModelDefine.DIR_DOWN;

        this.path = null;

        this.wentHome = false;

        //LA
        isActive = true;
        status = MonsterDefine.NORMAL_STATUS;
        collisionV = -1;
        collisionT = -1;
        collisionD = -1;
        collisionRadius = 0.2;
        collisionMonster = null;
        passingPoint = null;

        //HA
        this.buffs = new ArrayList<>();
        this.slowByBuff = 1.0;

        // Type
        if(objectId == 5){
            this.attackType = ModelDefine.BOSS_ATTACK_ONLY;
        }
        else {
            this.attackType = ModelDefine.BOSS_ATTACK_NORMAL;
        }

        if(objectId == 6){
            this.bossSkill = ModelDefine.BOSS_SKILL_DEMON_TREE;
            this.counter = 60;
        }
        else if (objectId == 7){
            this.bossSkill = ModelDefine.BOSS_SKILL_DESERT_KING;
            this.counter = 0;
        }
        else if (objectId == 9){
            this.bossSkill = ModelDefine.BOSS_SKILL_GOLEM;
        }
        else if (objectId == 11) {
            this.bossSkill = ModelDefine.BOSS_SKILL_MOC_TINH;
            this.counter = 0;
        }
        else {
            this.bossSkill = ModelDefine.BOSS_SKILL_NO_SKILL;
            this.counter = 0;
        }
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        Monster cloneItem = (Monster) super.clone();
        return cloneItem;
    }

    public void readMonsterJson(){
        MonsterJson monsterJson = new MonsterJson();

        String pointer = monsterJson.get();
        pointer = monsterJson.getWithJsonString(pointer,"monster");
        pointer = monsterJson.getWithJsonString(pointer,String.valueOf(this.objectId));
        this.name = monsterJson.getWithJsonString(pointer,"name");
        this.category = monsterJson.getWithJsonString(pointer,"category");
        this.hp = monsterJson.getDoubleWithJsonString(pointer,"hp");
        this.speed = monsterJson.getDoubleWithJsonString(pointer,"speed");
        this.hitRadius = monsterJson.getDoubleWithJsonString(pointer,"hitRadius");
        this.weight = monsterJson.getDoubleWithJsonString(pointer,"weight");
        this._class = monsterJson.getWithJsonString(pointer,"class");
        this.gainEnergy = monsterJson.getIntWithJsonString(pointer,"gainEnergy");
//        this.numberMonsters = monsterJson.getIntWithJsonString(pointer,"numberMonsters");
        /*
        System.out.println(this.toJson());
        System.out.println();
         */
    }
    public static LinkedList<Monster> createSystemMonsters(int round, int totalTowerLevel, int[] types, Player player) { // round start from 0
        LinkedList<Monster>monsterListPlayer = new LinkedList<Monster>();

//        if (types[0] >= 5) { // Boss
//            monsterListPlayer.addLast(new Monster(types[0], 1, 1, player.getSystemMonsterId(), true));
//            return monsterListPlayer;
//        }

        System.out.println("Total Tower: " + totalTowerLevel);
        int rate = totalTowerLevel/5;
        if(rate > 6) rate = 6;
        int hpRate, numMonsterRate;

        JSONObject jsonMonsterRate = (JSONObject) Helper.ReadJsonObject(ModelJson.MonsterRate_Json);
        JSONObject jsonMonsterGen = (JSONObject) Helper.ReadJsonObject(ModelJson.MonsterGeneration_Json);

        try {
            assert jsonMonsterRate != null;
            assert jsonMonsterGen != null;

            JSONObject multiplier = (JSONObject) jsonMonsterRate.getJSONObject("multiplier");
            JSONObject base = jsonMonsterRate.getJSONObject("base");

            JSONObject towerLevelObj = (JSONObject) multiplier.get(String.valueOf(rate));

            hpRate = towerLevelObj.getInt("hp");
            numMonsterRate = towerLevelObj.getInt("monster");

            JSONArray roundRate = jsonMonsterGen.getJSONObject(String.valueOf(round+1)).getJSONArray("rate");

            for(int i = 0; i< 3; i++){
                int type = types[i];

                if(type >= 0){

                    int numMonster = 1;
                    if (type < 5){
                        int baseNumMonster = base.getInt(String.valueOf(type));
                        double spawnRate = roundRate.getDouble(i);
                        numMonster = (int) Math.ceil(baseNumMonster * spawnRate * numMonsterRate);
                    }

//                    System.out.println("numMonster: " + numMonster + "....Round: " + round);

                    for(int j = 0; j < numMonster; j++){
                        monsterListPlayer.addLast(new Monster(type, 1, hpRate, player.getSystemMonsterId(), true));
                    }
                }
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }

//        System.out.println("Create Monster:................Round: " + round);
//        for (Monster m: monsterListPlayer){
//            System.out.println(m.getBattleObjectId());
//        }

        return monsterListPlayer;
    }
    public static LinkedList<Monster> createSystemMonsters(int round){
        return new LinkedList<Monster>();
    }
    public String getCategory() {
        return category;
    }


    public void hit(double damage){
        if(this.bossSkill == ModelDefine.BOSS_SKILL_NO_SKILL){
            if (this.counter == -1) {
                this.counter = 0;
                return;
            }
        }

        this.curHp-=damage;
        if (this.curHp <= 0){
            this.curHp = 0;
            this.isAlive = false;
        }
    }
    public boolean getIsAlive(){
        return this.isAlive;
    }

    //------------------------ [FOR MOVING] ---------------------------------//
    public VecInt getCurrPos(){
        return new VecInt((int) this.x, (int) this.y);
    }
    public void setCurrPos(double x, double y){
        this.x = x;
        this.y = y;
    }
    public int getDirection(VecInt curr_pos, VecInt next_pos){
        if(curr_pos.y == next_pos.y && next_pos.x - curr_pos.x > 0){ // y bang nhau thi di xuong duoi
            return ModelDefine.DIR_DOWN;
        }
        else if (curr_pos.y == next_pos.y && next_pos.x - curr_pos.x < 0){ // Len tren
            return ModelDefine.DIR_UP;
        }
        else if (curr_pos.x == next_pos.x && next_pos.y - curr_pos.y > 0){ // Sang phai
            return ModelDefine.DIR_RIGHT;
        }
        else if (curr_pos.x == next_pos.x && next_pos.y - curr_pos.y < 0){ // Sang trai
            return ModelDefine.DIR_LEFT;
        }
        else if (next_pos.x - curr_pos.x > 0 && next_pos.y - curr_pos.y > 0){ // Xuong duoi sang phai
            return ModelDefine.DIR_BOTTOM_RIGHT;
        }
        else if (next_pos.x - curr_pos.x < 0 && next_pos.y - curr_pos.y > 0){ // Len tren sang phai
            return ModelDefine.DIR_TOP_RIGHT;
        }
        else if (next_pos.x - curr_pos.x > 0 && next_pos.y - curr_pos.y < 0){ // Xuong duoi sang trai
            return ModelDefine.DIR_BOTTOM_LEFT;
        }
//        else if (next_pos.x - curr_pos.x < 0 && next_pos.y - curr_pos.y < 0){ // Len tren sang trai
//            return ModelDefine.DIR_TOP_LEFT;
//        }
        else {
            return ModelDefine.DIR_TOP_LEFT;
        }
    }

    public boolean checkPath(Map map){
        if (this._class.equals("aerial")) return true;
        VecInt startPos = this.getCurrPos();
        this.tempPath = map.getCurvePoint(map.bfsShortedPath(startPos, MonsterDefine.END_CELL, this.curr_direction));
        if(tempPath.size() == 0) return false;
        return true;
    }

    //--------------------------HanhND2-----------------------------------------
    public ArrayList<VecInt> getTempPath(Map map){
        VecInt startPos = this.getCurrPos();
        return map.getCurvePoint(map.bfsShortedPath(startPos, MonsterDefine.END_CELL, this.curr_direction));
    }
    // -----------------------------------------------------------------------

    public void setPath(){
        if (this._class.equals("aerial")) return;
        this.path = this.tempPath;

        this.next_cell = 0;
        this.next_pos = this.path.get(this.next_cell);

        /*if(this.next_cell < this.path.size() - 1){
            int next_dir = this.getDirection(this.next_pos, this.path.get(next_cell+1));
            if(next_dir != this.curr_direction){
                this.makeDeltaMove(next_dir);
            }
        }*/
    }

    public void findPath(Map map){  // Note: always find path before making update
        if (this._class.equals("land")){ // Walk monster
            VecInt startPos = this.getCurrPos();

            this.path = map.getCurvePoint(map.bfsShortedPath(startPos, MonsterDefine.END_CELL, this.curr_direction));

            this.next_cell = 0;
            this.next_pos = this.path.get(this.next_cell);

            /*if(this.next_cell < this.path.size() - 1){
                int next_dir = this.getDirection(this.next_pos, this.path.get(next_cell+1));
                if(next_dir != this.curr_direction){
                    this.makeDeltaMove(next_dir);
                }
            }*/
        }
        else { // Fly monster
            if (this.path == null){
                this.path = new ArrayList<>();
                this.path.add(new VecInt(0, 0));
                this.path.add(new VecInt(1, 0));
                this.path.add(new VecInt(5, 4));
                this.path.add(new VecInt(5, 7));

                this.next_cell = 0;
                this.next_pos = this.path.get(this.next_cell);

                this.changeDirection();
            }
        }

    }

    public void makeDeltaMove(int next_dir){
        VecDouble point = Helper.convertPoint2Pixel(this.next_pos);

        if(this.curr_direction == ModelDefine.DIR_DOWN){
            if(this.x > point.x){
                this.curr_direction = ModelDefine.DIR_UP;
            }
            else if(next_dir == ModelDefine.DIR_UP){
                this.curr_direction = next_dir;
                this.next_cell++;
                this.next_pos = this.path.get(this.next_cell);
            }
        }
        else if(this.curr_direction == ModelDefine.DIR_UP){
            if(this.x < point.x){
                this.curr_direction = ModelDefine.DIR_DOWN;
            }
            else if(next_dir == ModelDefine.DIR_DOWN){
                this.curr_direction = next_dir;
                this.next_cell++;
                this.next_pos = this.path.get(this.next_cell);
            }
        }
        else if(this.curr_direction == ModelDefine.DIR_LEFT){
            if(this.y < point.y){
                this.curr_direction = ModelDefine.DIR_RIGHT;
            }
            else if(next_dir == ModelDefine.DIR_RIGHT){
                this.curr_direction = next_dir;
                this.next_cell++;
                this.next_pos = this.path.get(this.next_cell);
            }
        }
        else if(this.curr_direction == ModelDefine.DIR_RIGHT){
            if(this.y > point.y){
                this.curr_direction = ModelDefine.DIR_LEFT;
            }
            else if(next_dir == ModelDefine.DIR_LEFT){
                this.curr_direction = next_dir;
                this.next_cell++;
                this.next_pos = this.path.get(this.next_cell);
            }
        }
    }

    private void changeDirection(){
        if (this.next_cell == this.path.size() - 1){ // Toi nha roi !!!
//            System.out.println(this.battleObjectId + " chet roiiiiii");
            this.isAlive = false;
            this.wentHome = true;
        }
        else {
            VecInt curr_pos = this.next_pos;
            this.next_cell++;
            this.next_pos = this.path.get(this.next_cell);

            int next_dir = this.getDirection(curr_pos, this.next_pos);
            if (this.curr_direction != next_dir){
                this.curr_direction = next_dir;
            }
        }
    }

    private void makeMove(double dt, int direction) {
        if(isActive){
            VecDouble point = Helper.convertPoint2Pixel(this.next_pos);

            if (direction == ModelDefine.DIR_UP) {
                this.x = Helper.roundTo3(this.x - this.curSpeed * dt);
                if (this.x <= point.x) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_DOWN) {
                this.x = Helper.roundTo3(this.x + this.curSpeed * dt);
                if (this.x >= point.x) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_LEFT) {
                this.y = Helper.roundTo3(this.y - this.curSpeed * dt);
//            this.y -= this.curSpeed * dt;
                if (this.y <= point.y) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_RIGHT) {
                this.y = Helper.roundTo3(this.y + this.curSpeed * dt);
//            this.y += this.curSpeed * dt;
                if (this.y >= point.y) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_TOP_LEFT) {
                this.x = Helper.roundTo3(this.x - this.curSpeed * dt);
                this.y = Helper.roundTo3(this.y - this.curSpeed * dt);
//            this.y -= this.curSpeed * dt;
//            this.x -= this.curSpeed * dt;
                if (this.x <= point.x && this.y <= point.y) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_TOP_RIGHT) {
                this.x = Helper.roundTo3(this.x - this.curSpeed * dt);
                this.y = Helper.roundTo3(this.y + this.curSpeed * dt);
//            this.y += this.curSpeed * dt;
//            this.x -= this.curSpeed * dt;
                if (this.x <= point.x && this.y >= point.y) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_BOTTOM_LEFT) {
                this.x = Helper.roundTo3(this.x + this.curSpeed * dt);
                this.y = Helper.roundTo3(this.y - this.curSpeed * dt);
//            this.y -= this.curSpeed * dt;
//            this.x += this.curSpeed * dt;
                if (this.x >= point.x && this.y <= point.y) {
                    this.changeDirection();
                }
            } else if (direction == ModelDefine.DIR_BOTTOM_RIGHT) {
                this.x = Helper.roundTo3(this.x + this.curSpeed * dt);
                this.y = Helper.roundTo3(this.y + this.curSpeed * dt);
//            this.y += this.curSpeed * dt;
//            this.x += this.curSpeed * dt;
                if (this.x >= point.x && this.y >= point.y) {
                    this.changeDirection();
                }
            }
        }
    }

    public void update(double dt){

//        System.out.println("monster: " + battleObjectId + " cur hp " + this.curHp + "cur speed " +this.curSpeed + "cur pos: " + this.x + " " + this.y);
        if(this.status == MonsterDefine.COLLISION_STATUS){
            handleCollisionStatus();
        }
        else if(this.status == MonsterDefine.PASSING_STATUS) {
            handlePassingStatus();
        }
        else if(this.status == MonsterDefine.WAITING_STATUS){
            handleWaitingStatus();
        }
        else if(status == MonsterDefine.NORMAL_STATUS){
            handleNormalStatus();
        }
        //System.out.println("logic Pos: " +this.x + " " + this.y);


        //HA
        updateBuffPerTick();
        updateBossSkill();
        updateSpellPerTick(); //LA

        // Checking went home
        this.checkMonsterWentHome();
    }

    private void checkMonsterWentHome() {
        if(this.x >= 5 && this.y >= 7) {
            this.isAlive = false;
            this.wentHome = true;
        }
    }

    private void handleCollisionStatus(){
        //cc.log("COLLISION STATUS " + this.collistionVec.t);
        this.move(this.collisionD, this.collisionV);
        this.collisionT--;
        if(this.collisionT <= 0){
            if(this.collisionMonster == null){
                this.status = MonsterDefine.NORMAL_STATUS;
            }
            else{
                this.status = MonsterDefine.PASSING_STATUS;
                this.getNextPassingPoint(this.getCurPos(), this.collisionMonster.curr_direction);
            }

        }
    }
    private void handlePassingStatus(){
        // chua vuot qua
            /*if(!this.checkPassing()){
                cc.log("Chua PASS");*/
        if (!this.checkPassingPoint(this.collisionD, this.passingPoint)) {
            this.move(this.collisionD, this.curSpeed);
            //this.curPos = Helper.convertMapPixelToLogicPoint(cc.p(this.posX,this.posY), this.isMyMap);
        } else {
            //cc.log("Dang state 2 passing");
            //this.makeMove(1 / 60,this.curr_direction);
            this.x = this.passingPoint.x;
            this.y = this.passingPoint.y;
            this.status = MonsterDefine.NORMAL_STATUS;
            this.collisionMonster = null;
        }
    }
    private void handleWaitingStatus(){
        //if(this.checkNextMove(this.curr_direction, this.curSpeed)){
        this.status = MonsterDefine.NORMAL_STATUS;
        this.collisionMonster = null;
        //}
    }
    private void handleNormalStatus(){
        this.makeMove(1.0/60,this.curr_direction);
    }
    private boolean checkNextMove(int d, double v) {
        double dt = 1.0/60;
        if(d == ModelDefine.DIR_UP){
            return this.player.isEmptyPos(new Pos(Helper.roundTo3(this.x - v * dt), this.y), this.collisionRadius, this.getRealDirection());
        }
        else if(d == ModelDefine.DIR_DOWN){
            return this.player.isEmptyPos(new Pos(Helper.roundTo3(this.x + v * dt), this.y), this.collisionRadius, this.getRealDirection());
        }
        else if(d == ModelDefine.DIR_LEFT){
            return this.player.isEmptyPos(new Pos(this.x, Helper.roundTo3(this.y - v * dt)), this.collisionRadius, this.getRealDirection());
        }
        else if(d == ModelDefine.DIR_RIGHT){
            return this.player.isEmptyPos(new Pos(this.x, Helper.roundTo3(this.y + v * dt)), this.collisionRadius, this.getRealDirection());
        }
        return true;
    }

    public boolean checkPassingPoint(int d, Pos pos) {
        if(d == ModelDefine.DIR_UP){
            if(this.x - this.eps <= pos.x){
                return true;
            }
            return false;
        }
        else if(d == ModelDefine.DIR_DOWN){
            if(this.x + this.eps >= pos.x){
                return true;
            }
            return false;
        }
        else if(d == ModelDefine.DIR_LEFT){
            if(this.y - this.eps <= pos.y){
                return true;
            }
            return false;
        }
        else if(d == ModelDefine.DIR_RIGHT){
            if(this.y + this.eps >= pos.y){
                return true;
            }
            return false;
        }
        return false;
    }

    private void getNextPassingPoint(Pos curPos, int d) {
        double[] deltas = {0.9, 0.5, 0.1};
        if(d == ModelDefine.DIR_UP || d == ModelDefine.DIR_DOWN){
            for(int i = 0; i < 3; ++i){
                Pos pos = new Pos(curPos.x, Math.floor(curPos.y) + deltas[i]);
                if(this.player.isEmptyPos(pos, this.collisionRadius, ModelDefine.DIR_NULL)){
                    this.passingPoint = pos;
                    if(curPos.y < this.passingPoint.y){
                        this.collisionD = ModelDefine.DIR_RIGHT;
                    }
                    else if(curPos.y > this.passingPoint.y){
                        this.collisionD = ModelDefine.DIR_LEFT;
                    }
                    return;
                }
            }
        }
        else if(d == ModelDefine.DIR_LEFT || d == ModelDefine.DIR_RIGHT){
            for(int i = 0; i < 3; ++i){
                Pos pos = new Pos(Math.floor(curPos.x) + deltas[i], curPos.y);
                if(this.player.isEmptyPos(pos, this.collisionRadius, ModelDefine.DIR_NULL)){
                    this.passingPoint = pos;
                    if(curPos.x < this.passingPoint.x){
                        this.collisionD = ModelDefine.DIR_DOWN;
                    }
                    else if(curPos.x > this.passingPoint.x){
                        this.collisionD =  ModelDefine.DIR_UP;
                    }
                    return;
                }
            }
        }
        //this.collisionD = d;
        //this.passingPoint = curPos;
        this.status = MonsterDefine.WAITING_STATUS;
    }

    private void move(int d, double v) {
        if(isActive){
            System.out.println("MOVE:" + d + " " + v);
            double dt = 1.0 / 60;
            if(d == ModelDefine.DIR_UP){
                if(this.x - v * dt + this.eps >= 0){
                    this.x = Helper.roundTo3(this.x - v * dt);
                }
            }
            else if(d == ModelDefine.DIR_DOWN){
                if(this.x + v * dt - this.eps <= 6){
                    this.x = Helper.roundTo3(this.x + v * dt);
                }
            }
            else if(d == ModelDefine.DIR_LEFT){
                if(this.y - v * dt + this.eps >= 0){
                    this.y = Helper.roundTo3(this.y - v * dt);
                }

            }
            else if(d == ModelDefine.DIR_RIGHT){
                if(this.y + v * dt - this.eps <= 7){
                    this.y = Helper.roundTo3(this.y + v * dt);
                }

            }
        }
    }

    public void run(Map map, Player player){
        this.curr_direction = ModelDefine.DIR_DOWN;
        this.findPath(map);

//        this.monsterInMapList = listMonster;

        this.player = player;
    }
    //---------------------------------------------------------------------------//

    public void run(Map map, Player player, int curr_direction, VecDouble position){
        this.curr_direction = curr_direction;

        this.x = position.x;
        this.y = position.y;

        this.findPath(map);

//        this.monsterInMapList = listMonster;

        this.player = player;
    }

    public double getCurHp() {
        return curHp;
    }

    public int getObjectId() {
        return objectId;
    }
    public boolean isBuffBySpell(Spell spell){
        return spells.containsKey(spell);
    }
    public double getSpeed() {
        return speed;
    }
    public int getEffectTick(Spell spell){
        return spells.get(spell);
    }

    public void speedUp(double rate){
        curSpeed *= rate;
    }
    public void heal(int delta){
        curHp += delta;
    }
    public void setActive(boolean isActive){
        this.isActive = isActive;
    }
    public void addSpell(Spell spell){
        spells.put(spell, spell.getEffectTick());
    }
    public void addSpellWithTick(Spell spell, int tick){
        spells.put(spell, tick);
    }
    public void updateSpellPerTick(){
        Set<java.util.Map.Entry<Spell,Integer>> s = spells.entrySet();
        for (java.util.Map.Entry<Spell, Integer> it : s){
            Integer tick = it.getValue();
            Spell spell = it.getKey();
            /*
            System.out.println("");
            System.out.println("Spell monster: " + battleObjectId + " cur hp " + this.curHp + "cur speed " +this.curSpeed + "cur pos: " + this.x + " " + this.y);
            System.out.println("Spell " + spell.getBattleObjectId() + " time: " + String.valueOf(tick));

             */
            if(tick > 0){
                it.setValue(tick - 1);
                spell.doAction(this);
            }
            else{
                spells.remove(spell);
                spell.removeEffect(this);
                updateSpellPerTick();
                break;
            }
        }

    }

    public LinkedHashMap<Spell, Integer> getSpells() {
        return spells;
    }

    public static int[][] createSystemMonsterTypes() {

        int[] landMonster = new int[] {0, 1, 2};
        int[] aerialMonster = new int[] {3};
        ArrayList<Integer> listBoss = new ArrayList<>();
        listBoss.add(6);
        listBoss.add(7);
        listBoss.add(9);
        listBoss.add(11);
//        {6,7,9,11};

        int[][] monsterList = new int[20][3];

        Random rand = new Random();

        JSONObject jsonObj = (JSONObject) Helper.ReadJsonObject(ModelJson.MonsterGeneration_Json);

        for(int i = 0; i < 20; i++){
            try {
                assert jsonObj != null;
                JSONObject round = (JSONObject) jsonObj.get(String.valueOf(i+1));
                JSONArray listType = (JSONArray) round.get("monster_type");
                int j = 0;
                while(j < listType.length()){
                    int type = listType.getInt(j);
                    if (type == 0){
                        monsterList[i][j] = type;
//                        monsterList[i][j] = 9;
                    }
                    else if (type == 1){
                        monsterList[i][j] = landMonster[rand.nextInt(landMonster.length)];
                    }
                    else if (type == 2){
                        monsterList[i][j] = 3;
                    }
                    else {
                        if (i==4) monsterList[i][j] = 5;
                        else {
                            int idx = rand.nextInt(listBoss.size());
                            monsterList[i][j] = listBoss.get(idx);
                            listBoss.remove(idx);
                        }


                    }

                    j++;
                }
                while(j < 3){
                    monsterList[i][j] = -1;
                    j++;
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

//        for(int i = 0; i < 20; i++){
//            for (int j = 0; j < 3; j++){
//                System.out.print(monsterList[i][j]);
//                System.out.print(' ');
//            }
//            System.out.println();
//        }
        return monsterList;
    }

//    public void setPlayer(Player player) {
//        this.player = player;
//    }

    //Hanh----------------------------------------
    public double getHitRadius() {
        return this.hitRadius;
    }
    public Pos getCurPos(){
        return new Pos(this.x,this.y);
    }

    public ArrayList<Buff> getBuffs() {
        return buffs;
    }

    public void addBuff(Buff buff){
        for(Buff buff1: buffs){
            if (buff1.getBattleObjectId().equals(buff.getBattleObjectId())){
                return;
            }
        }
        this.buffs.add(buff);
    }
    public void updateBuffPerTick(){
        boolean isNotFrozen = true;
        double slowByBuff = 1.0;
        //System.out.println("Monster buffs size: "+this.buffs.size());
        this.buffs.removeIf(buff -> !buff.getIsActive());
        for(int i = 0; i < this.buffs.size(); ++i){
            //System.out.println("Monster Active with i " + i + " " +this.buffs.get(i).getIsActive());
            if (this.buffs.get(i).getIsActive()){
                //System.out.println("Monster getName with i " + i + " " +this.buffs.get(i).getName());
                if (this.buffs.get(i).getName().equals("frozen")){
                    isNotFrozen = false;
                }
                if (this.buffs.get(i).getName().equals("slow")){
                    slowByBuff *= (1+this.buffs.get(i).getValue());
                }
            }
        }
        //System.out.println("Monster slowByBuff " + slowByBuff);
        if (this.slowByBuff != slowByBuff){
            this.speedUp(1.0/this.slowByBuff);
            this.speedUp(slowByBuff);
            this.slowByBuff = slowByBuff;
        }
        //System.out.println("Monster isNotFrozen " + isNotFrozen);
        if (this.isActive != isNotFrozen){
            this.setActive(isNotFrozen);
        }


    }

    public int getAttackType() {
        return attackType;
    }

    public double getSlowByBuff() {
        return slowByBuff;
    }
    //---------------------------------------
    //LA
    public void setFlyingStatus(){
        status = MonsterDefine.FLYING_STATUS;
    }
    public void flyToStartPos(){
        player.addTrappedMonster(battleObjectId);
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public boolean isActive() {
        return isActive;
    }
    public boolean isFlying(){
        return !this._class.equals("land");
    }
    public void checkCollision(Monster monster) {
        if((monster.collisionMonster != null && Objects.equals(monster.collisionMonster.battleObjectId, this.battleObjectId)) || (this.collisionMonster != null && Objects.equals(this.collisionMonster.battleObjectId, monster.battleObjectId))) return;
        if(monster.isFlying() || this.isFlying()) return;
        //let delta = (this.collisionRadius + monster.collisionRadius) - Helper.getDistance(this.curPos, monster.curPos);
        if (checkNextMoveCollision(monster)) {
            if (this.status == MonsterDefine.NORMAL_STATUS && monster.status == MonsterDefine.NORMAL_STATUS) {
                //cc.log("check collision 1: " + this.battleObjectId + " " + monster.battleObjectId);
                handleCollision(this, monster);
            }
            else if (monster.status != MonsterDefine.NORMAL_STATUS) {
                //cc.log("check collision 2: " + this.battleObjectId + " " + monster.battleObjectId);
                this.status = MonsterDefine.WAITING_STATUS;
            }
            //this.curSpeed = ((this.weight - monster.weight) * this.curSpeed + 2 * monster.weight * monster.curSpeed) / (this.weight + monster.weight);
        }
    }
    private void handleCollision(Monster monster1, Monster monster2){
        double v1 = monster1.getRealSpeed();
        double v2 = monster2.getRealSpeed();
        int d = monster1.getRealDirection();
        monster1.collisionV = ((monster1.weight - monster2.weight) * v1 + 2 * monster2.weight * v2) / (monster1.weight + monster2.weight);
        monster2.collisionV = ((monster2.weight - monster1.weight) * v2 + 2 * monster1.weight * v1) / (monster1.weight + monster2.weight);
        monster1.collisionD = d;
        monster1.collisionT = 10;
        monster2.collisionD = d;
        monster2.collisionT = 10;
        monster1.status = MonsterDefine.COLLISION_STATUS;
        monster2.status = MonsterDefine.COLLISION_STATUS;
        if(v1 < v2){
            monster2.collisionMonster = monster1;
        }
        else if(v1 > v2){
            monster1.collisionMonster = monster2;
        }
        else{
            if(monster1.checkPassingPoint(d, monster2.getCurPos())){
                monster1.collisionV = v1 + 0.5;
                monster2.status = MonsterDefine.NORMAL_STATUS;
            }
            else{
                monster2.collisionV = v2 + 0.5;
                monster1.status = MonsterDefine.NORMAL_STATUS;
            }
        }
    }
    private Pos getNextPos(int d, double v, Pos pos){
        double dt = 1.0 / 60;
        if(d == ModelDefine.DIR_UP){
            return new Pos(Helper.roundTo3(pos.x - v * dt), pos.y);
        }
        else if(d == ModelDefine.DIR_DOWN){
            return new Pos(Helper.roundTo3(pos.x + v * dt), pos.y);
        }
        else if(d == ModelDefine.DIR_LEFT){
            return new Pos(pos.x, Helper.roundTo3(pos.y - v * dt));
        }
        else if(d == ModelDefine.DIR_RIGHT){
            return new Pos(pos.x, Helper.roundTo3(pos.y + v * dt));
        }
        return pos;
    }
    private boolean checkNextMoveCollision(Monster monster) {
        Pos pos1 = getNextPos(this.getRealDirection(), this.getRealSpeed(), this.getCurPos());
        Pos pos2 = getNextPos(monster.getRealDirection(), monster.getRealSpeed(), monster.getCurPos());
        //cc.log("d: " + monster.getRealDirection() + " " + monster.getRealSpeed());
        return ((this.collisionRadius + monster.collisionRadius) - pos1.getDistance(pos2)) >= 0;
    }

    public int getRealDirection() {
        if(this.status == MonsterDefine.COLLISION_STATUS){
            return collisionD;
        }
        return curr_direction;
    }

    public double getRealSpeed() {
        if(this.status == MonsterDefine.WAITING_STATUS || !isActive){
            return 0;
        }
        else if(this.status == MonsterDefine.COLLISION_STATUS){
            return collisionV;
        }
        return curSpeed;
    }

    public void healing(double rate){
        this.curHp += (double) Math.round(this.hp*rate*1000)/1000;
        if (this.curHp > this.hp) this.curHp = this.hp;
    }

    public void updateBossSkill(){
        if (this.bossSkill == ModelDefine.BOSS_SKILL_DEMON_TREE){
            this.counter--;
            if(this.counter == 0){
                for(Monster monster: this.player.getMonsterInMapList()){
                    if (monster != this){
                        if(this.getCurPos().getDistance(monster.getCurPos()) <= ModelDefine.BOSS_DEMON_TREE_RANGE){
                            monster.healing(ModelDefine.BOSS_DEMON_TREE_HP_RATE);
                        }
                    }
                }
                this.counter = 60;
            }
        }

        else if (this.bossSkill == ModelDefine.BOSS_SKILL_DESERT_KING){
            this.counter++;
            if(this.counter%10 == 0){
                for(Monster monster: this.player.getMonsterInMapList()){
                    if (monster != this){
                        if(this.getCurPos().getDistance(monster.getCurPos()) <= ModelDefine.BOSS_DEMON_TREE_RANGE){
                            monster.counter = -1;
                        }
                        else {
                            monster.counter = 0;
                        }
                    }
                }
            }
        }

        else if (this.bossSkill == ModelDefine.BOSS_SKILL_MOC_TINH){
            if(this.counter <= ModelDefine.BOSS_MOC_TINH_MAX_MINION*ModelDefine.BOSS_MOC_TINH_TIME_TO_RELEASE) {
                this.counter++;
            }

//            if (this.numMinon < ModelDefine.BOSS_MOC_TINH_MAX_MINION && this.counter == ModelDefine.BOSS_MOC_TINH_TIME_TO_RELEASE) {
//                System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//                this.counter = 0;
//                this.numMinon++;
//
//                this.player.addMonster(12, this.curr_direction, new VecDouble(this.x, this.y));
//            }
        }

    }

}