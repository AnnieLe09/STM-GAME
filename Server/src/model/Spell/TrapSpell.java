package model.Spell;

import model.Battle.BattleObject;
import model.Monster.Monster;
import model.Tower.Tower;

import java.util.Iterator;
import java.util.LinkedList;

public class TrapSpell extends Spell{
    private int animTick;
    public TrapSpell(int level) {
        super(4, 1);
        readSpellJson();
    }
    protected void readSpellJson(){
        super.readSpellJson();
        this.effectTick = 30;
        this.leftTick = 30;
        this.animTick = 1;
    }
    public boolean update(LinkedList<Monster> monsters, LinkedList<Tower>towers){
        System.out.println("Spell Fireball" + battleObjectId + " time left: " + leftTick);
        if(leftTick > 0){
            if(this.animTick > 0){
                for(Monster monster: monsters){
                    if(!monster.isFlying()){
                        if (curPos.getDistance(monster.getCurPos()) <= range && monster.isBuffBySpell(this) == false) {
                            monster.addSpellWithTick(this, this.leftTick + this.effectTick);
                            doEffect(monster);
                            this.animTick--;
                            break;
                        }
                    }
                }
            }
            else{
                for(Monster monster:monsters){
                    if(!monster.isFlying()){
                        if (curPos.getDistance(monster.getCurPos()) <= range && monster.isBuffBySpell(this) == false) {
                            monster.addSpellWithTick(this, this.leftTick - 1 + this.effectTick);
                            doEffect(monster);
                        }
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
        monster.hit(20);
    }

    public void doAction(BattleObject battleObject){
        Monster monster = (Monster)battleObject;
        if(monster.getEffectTick(this) == this.effectTick){
            monster.setFlyingStatus();
        }
    }

    public void removeEffect(BattleObject battleObject){
        ((Monster)battleObject).flyToStartPos();
    }

    @Override
    public int getAnimTick() {
        return animTick;
    }
}
