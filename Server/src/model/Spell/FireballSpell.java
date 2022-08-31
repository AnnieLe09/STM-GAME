package model.Spell;

import model.Battle.BattleObject;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.Tower;

import java.util.Iterator;
import java.util.LinkedList;

public class FireballSpell extends Spell{
    private int animTick;
    public FireballSpell(int level) {
        super(0, 1);
        readSpellJson();
    }
    protected void readSpellJson(){
        super.readSpellJson();
        this.effectTick = 1;
        this.leftTick = 1;
        this.animTick = 30;
    }
    public boolean update(LinkedList<Monster> monsters, LinkedList<Tower>towers){
        System.out.println("Spell Fireball" + battleObjectId + " time left: " + leftTick);
        if(leftTick > 0){
            if(this.animTick > 0){
                this.animTick--;
            }
            else{
                Iterator<Monster> itr = monsters.iterator();
                while(itr.hasNext()) {
                    Monster monster = itr.next();
                    if (curPos.getDistance(monster.getCurPos()) <= range && monster.isBuffBySpell(this) == false) {
                        monster.addSpell(this);
                        doEffect(monster);
                    }
                }
                leftTick -= 1;
            }
            return true;
        }
        else {
            return false;
        }
    }

    private void doEffect(Monster monster) {
        monster.hit(50);
    }

    public void doAction(BattleObject battleObject){

    }

    public void removeEffect(BattleObject battleObject){
    }

    @Override
    public int getAnimTick() {
        return animTick;
    }
}
