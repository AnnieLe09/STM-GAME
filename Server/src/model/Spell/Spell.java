package model.Spell;

import model.Battle.BattleObject;
import model.Battle.Player;
import model.Bullet.Bullet;
import model.Define.ModelDefine;
import model.Map.Map;
import model.Monster.Monster;
import model.PlayerInfo;
import model.Tower.Tower;
import util.readJson.ModelJson;
import util.readJson.ReadJson;
import util.supportClass.Pos;
import util.supportClass.RandomInt;
import util.vector.VecInt;

import java.util.ArrayList;
import java.util.LinkedList;

public class Spell extends BattleObject implements Cloneable {
    protected int energy;
    protected int leftTick;
    protected int effectTick;
    protected int map;
    protected double range;
    protected double duration;
    protected double radius;
    public Spell(int objectId, int level){
        super("Spell", objectId, level);
    }
    @Override
    public Object clone() throws CloneNotSupportedException {
        Spell cloneItem = (Spell) super.clone();
        return cloneItem;
    }
    protected void readSpellJson(){
        ReadJson spellJson = new ReadJson(ModelJson.Spell_Json);
        String pointer = spellJson.get();

        pointer = spellJson.getWithJsonString(pointer,"potion");
        pointer = spellJson.getWithJsonString(pointer,String.valueOf(this.objectId));
        this.name = spellJson.getWithJsonString(pointer,"name");
        this.energy = Integer.parseInt(spellJson.getWithJsonString(pointer,"energy"));
        this.map = Integer.parseInt(spellJson.getWithJsonString(pointer,"map"));
        this.range = Double.parseDouble(spellJson.getWithJsonString(pointer,"range"));
        String actionPointer = spellJson.getWithJsonString(pointer,"action");
        this.duration = Double.parseDouble(spellJson.getWithJsonString(actionPointer,"duration")) / 1000;
        //this.radius = Double.parseDouble(spellJson.getWithJsonString(actionPointer,"radius"));
    }
    public int getEffectTick() {
        return effectTick;
    }
    public void removeEffect(BattleObject object){

    }
    public boolean update(LinkedList<Monster> monsters, LinkedList<Tower>towers){
        return false;
    }
    public void doAction(BattleObject battleObject){

    }

    public int getLeftTick() {
        return leftTick;
    }

    public int getMap() {
        return map;
    }

    public int getEnergy() {
        return energy;
    }
    public int getAnimTick(){
        return 0;
    }

    //-------------HanhNd2---------------------
    public VecInt getBestCellToPlace(Player player){
        // ham truu tuong
        ArrayList<VecInt> bestCells = new ArrayList<>();
        int maxCountMonster = 1;
        Map map = player.getMap();
        LinkedList<Monster> monsters = player.getMonsterInMapList();
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                VecInt cell = new VecInt(i,j);
                Pos pos = map.getPosFromCell(cell);
                int count = 0;
                for(Monster monster: monsters){
                    if (pos.getDistance(monster.getCurPos()) <= this.range){
                        count+=1;
                    }
                }
                if (count == maxCountMonster) {
                    bestCells.add(cell);
                }
                else {
                    if (count > maxCountMonster){
                        maxCountMonster = count;
                        bestCells.clear();
                        bestCells.add(cell);
                    }
                }
            }
        }
        if (bestCells.size() == 0){
            return null;
        }
        else{
            return bestCells.get(RandomInt.randInt(0,bestCells.size() - 1));
        }
    }
    //------------------------------------------
}
