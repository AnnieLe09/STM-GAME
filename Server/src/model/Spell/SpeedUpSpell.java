package model.Spell;

import model.Battle.BattleObject;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.Tower;

import java.util.Iterator;
import java.util.LinkedList;

public class SpeedUpSpell extends Spell{
    public SpeedUpSpell(int level) {
        super(3, 1);
        readSpellJson();
    }
    protected void readSpellJson(){
        super.readSpellJson();
        this.leftTick = (int)this.duration * ModelDefine.TICK_PER_SECOND;
        this.effectTick = 4 * ModelDefine.TICK_PER_SECOND;
    }
    public boolean update(LinkedList<Monster>monsters, LinkedList<Tower>towers){
        System.out.println("Spell " + battleObjectId + " time left: " + leftTick);
        if(leftTick > 0){
            Iterator<Monster> itr = monsters.iterator();
            while(itr.hasNext()) {
                Monster monster = itr.next();
                if (curPos.getDistance(monster.getCurPos()) <= range && monster.isBuffBySpell(this) == false) {
                    monster.addSpell(this);
                    monster.speedUp(1.5);
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
        ((Monster)battleObject).speedUp(1 / 1.5);
    }
}
