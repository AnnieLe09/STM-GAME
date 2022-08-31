package model.buff.towerbuff;

import model.Define.ModelDefine;
import model.buff.Buff;
import model.buff.Effect;

public class SpellTowerBuff extends Buff {
    public SpellTowerBuff() {
        super(ModelDefine.BUFF_SPELLTOWERBUFF,0);
    }
    public void increaseValue(Double rate){

        Effect effect = this.effectList.get(1);
        if (effect == null) return;
        effect.setValue(effect.getValue() + rate);
    }
    /*
    public SpellTowerBuff clone(){
        SpellTowerBuff clone = new SpellTowerBuff();
        return clone;
    }

     */
    @Override
    public void updateBuff(double dt) {

    }
}
