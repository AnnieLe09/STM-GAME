package model.Spell;
import model.Battle.BattleObject;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.Tower;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;

public class HealSpell extends Spell{

    private Hashtable<Monster, Double> monsters;
    private LinkedList<Monster> targets;
    public HealSpell(int level) {
        super(2, 1);
        readSpellJson();
        targets = new LinkedList<>();
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
        Monster monster = (Monster) battleObject;
        if(monster.getEffectTick(this) % 6 == 0){
            monster.heal(2);
        }
    }

    public void removeEffect(BattleObject battleObject){

    }
}
