package model.Tower;

import model.Battle.Player;
import model.Battle.BattleObject;
import model.Define.ModelDefine;
import model.Map.Cell;
import model.Monster.Monster;
import model.Spell.Spell;
import model.buff.Buff;
import model.buff.Effect;
import model.buff.towerbuff.SpellTowerBuff;
import model.buff.towerbuff.TowerBuff;
import util.supportClass.Pos;
import util.readJson.TowerJson;
import util.vector.VecInt;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

public class Tower extends BattleObject {
    protected int buildingTime;
    protected String archetype;
    protected String targetType;
    protected int curTick;
    protected int energy;
    protected int tickToActive;
    protected int curStat;
    protected boolean isActive;
    protected Cell cell;
    protected boolean isStartAttack;
    Player player;
    protected Vector<Buff> buffs;
    private LinkedHashMap<Spell, Integer> spells;
    protected double curAttackSpeed;
    protected double curDamage;
    protected double curRange;


    public Tower(int objectId, int level) {
        super("Tower", objectId, level);
        this.isActive = false;
        this.cell = null;
        this.buffs = new Vector<>();
        this.curStat = 1;
        this.isActive = false;
        this.spells = new LinkedHashMap<>();
        readTowerJson();
    }

    public boolean dropTower(){
        this.player.getTowerInMapList().remove(this);
        return true;
    }

    public boolean putTower(VecInt cellPoint, Player player,int tick){

        if (!player.getMap().addTower(cellPoint,this)){
            return false;
        }
        this.player = player;
        this.cell = this.player.getMap().getCell(cellPoint);
        this.curPos = new Pos(cellPoint.toPos());
        this.curTick = tick;
        this.tickToActive = tick + ModelDefine.TICK_PER_SECOND;
        return true;
    }
    public void doActiveTower(){
        this.isActive = true;
    }

    public void readTowerJson() {
        TowerJson towerJson = new TowerJson();
        /*
        int n = Integer.parseInt(towerJson.get(new String[]{"tower","1","stat","1","attackSpeed"}));
        System.out.println(n);
         */
        String pointer = towerJson.get();
        this.buildingTime = towerJson.getIntWithJsonString(pointer,"buildingTime");
        pointer = towerJson.getWithJsonString(pointer,"tower");
        pointer = towerJson.getWithJsonString(pointer,String.valueOf(this.objectId));
        this.name = towerJson.getWithJsonString(pointer,"name");
        this.archetype = towerJson.getWithJsonString(pointer,"archetype");
        this.targetType = towerJson.getWithJsonString(pointer,"targetType");
        this.energy = towerJson.getIntWithJsonString(pointer,"energy");
    }

    public int getTickToActive() {
        return tickToActive;
    }

    public int getBuildingTime() {
        return buildingTime;
    }

    public int getEnergy() {
        return energy;
    }

    public void update(double dt){
        this.curTick+=1;
        if (!this.isActive && this.curTick == this.tickToActive){
            this.doActiveTower();
        }
        updateSpellPerTick();
    }

    public Cell getCell(){
        return this.cell;
    };
    public void removeBuff(Buff buff){
        this.buffs.remove(buff);
    }


    public boolean upgrade() {
        if (this.curStat >= ModelDefine.TOWER_MAX_STAT){
            return false;
        }
        this.curStat += 1;
        return true;
    }
    public boolean getIsActive(){
        return this.isActive;
    }

    public int getCurStat() {
        return curStat;
    }

    public Tower clone(Tower clone){
        super.clone(clone);
        clone.isActive = this.isActive;
        clone.cell = this.cell;
        clone.curStat = this.curStat;
        clone.player = player;
        clone.curPos = this.curPos;
        clone.curTick = this.curTick;
        clone.tickToActive = this.tickToActive;
        clone.buffs = (Vector<Buff>) this.buffs.clone();
        return clone;
    }
    public double getCurTimeWaiting() { return 0; }
    public Monster getTargetMonster() { return null;}
    public Pos getTargetPos() { return new Pos(this.curPos); }
    public boolean getIsShootBullet(){ return true;}
    public int getNumBulletShooted() { return 0;}
    public double getCurRange() {
        return curRange;
    }

    public double getCurAttackSpeed() {
        return curAttackSpeed;
    }
    public double getCurDamage() {
        return curDamage;
    }

    public Vector<Buff> getBuffs() {
        return buffs;
    }

    public LinkedHashMap<Spell, Integer> getSpells() {
        return spells;
    }

    public boolean isBuffBySpell(Spell spell){
        return spells.containsKey(spell);
    }
    public int getEffectTick(Spell spell){
        return spells.get(spell);
    }
    public Buff getBuffById(String buffId){
        for(Buff buff: this.buffs){
            if (buff.getBattleObjectId().equals(buffId)){
                return buff;
            }
        }
        return null;
    }
    public void increaseDamage(String spellId,double rate){
        String buffId = spellId+"_Buff_";
        SpellTowerBuff buff = (SpellTowerBuff) this.getBuffById(buffId);
        if (buff == null){
            buff = new SpellTowerBuff();
            buff.addEffect(new Effect("damageUp", "damageAdjustment", rate - 1));
            buff.setBattleObjectId(buffId);
            this.addBuff(buff);
            this.player.addBuff(buff);
        }
        else {
            buff.increaseValue(rate - 1);
        }
    }
    public void removeDamage(String spellId){
        Buff tmp = null;
        String buffId = spellId + "_Buff_";
        for(Buff buff:this.buffs){
            if (buff.getBattleObjectId().equals(buffId)){
                tmp=buff;
            }
        }
        this.popBuff(tmp);
        this.player.popBuff(tmp);
    }

    public void addBuff (Buff buff){
        for(Buff buff1: this.buffs){
            if (buff1 == buff){
                return;
            }
        }
        this.buffs.add(buff);
    }

    public void popBuff (Buff buff){
        this.buffs.remove(buff);
    }

    public void addSpell(Spell spell){
        spells.put(spell, spell.getEffectTick());
    }
    public void updateSpellPerTick(){
        Set<Map.Entry<Spell,Integer>> s = spells.entrySet();
        for (java.util.Map.Entry<Spell, Integer> it : s){
            Integer tick = it.getValue();
            Spell spell = it.getKey();
            System.out.println("");
            System.out.println("Spell " + spell.getBattleObjectId() + " time: " + String.valueOf(tick));
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

    public Player getPlayer() {
        return player;
    }
    public int getBulletTargetBuffType() {
        return 0;
    }

    public String getArchetype() {
        return archetype;
    }
    public TowerBuff getTowerBuff() {
        return null;
    }
}
