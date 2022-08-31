package model.Spell;

import model.Battle.BattleObject;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.Tower;

import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;

public class PowerSpell extends Spell{
    private Hashtable<Monster, Double> monsters;
    private LinkedList<Monster> targets;
    public PowerSpell(int level) {
        super(5, 1);
        readSpellJson();
        targets = new LinkedList<>();
    }
    protected void readSpellJson(){
        super.readSpellJson();
        this.leftTick = (int)this.duration * ModelDefine.TICK_PER_SECOND;
        this.effectTick = 15 * ModelDefine.TICK_PER_SECOND / 10;
    }
    public boolean update(LinkedList<Monster>monsters, LinkedList<Tower>towers){
        System.out.println("PowerSpell " + battleObjectId + " time left: " + leftTick);
        if(leftTick > 0){
            Iterator<Tower> itr = towers.iterator();
            while(itr.hasNext()) {
                Tower tower = itr.next();
                if (curPos.getDistance(tower.getCurPos()) <= range && tower.isBuffBySpell(this) == false) {
                    tower.addSpell(this);
                    tower.increaseDamage(battleObjectId,1.5);
                }
            }
            leftTick -= 1;
            return true;
        }
        else {
            return false;
        }
    }
    public void doAction(BattleObject battleObject){

    }

    public void removeEffect(BattleObject battleObject){
        ((Tower)battleObject).removeDamage(battleObjectId);
    }
}
