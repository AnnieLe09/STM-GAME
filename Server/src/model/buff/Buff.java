package model.buff;

import model.Battle.Player;
import model.Map.Cell;
import model.Spell.Spell;
import model.buff.towerbuff.SpellTowerBuff;
import util.supportClass.Pos;

import java.util.Vector;

public abstract class Buff implements Cloneable{
    protected int buffType;
    protected boolean isActive;
    protected String battleObjectId;
    protected Vector<Effect> effectList;
    protected int buffTypeOrder;
    protected double timeRemaining;
    protected int stat;

    public Buff(int buffType,int buffTypeOrder){
        this.buffType = buffType;
        this.isActive = true;
        this.battleObjectId = "null"; //phai dinh nghia trong lop ke thua
        this.effectList = new Vector<>();
        this.effectList.add(null);
        this.buffTypeOrder = buffTypeOrder;
        this.timeRemaining = 1000000000;
        this.stat = 1;
    }

    public int getBuffType() {
        return buffType;
    }
    public boolean getIsActive(){
        return this.isActive;
    }
    public abstract void updateBuff(double dt);

    public void addEffect(Effect effect){
        this.effectList.add(effect);
    }

    public String  getBattleObjectId(){
        return this.battleObjectId;
    };
    public Vector<Effect> getEffectList() {
        return effectList;
    }

    public void setBattleObjectId(String buffId){
        this.battleObjectId = buffId;
    }
    public Cell getCell() {
        return null;
    }

    public int getBuffTypeOrder() {
        return buffTypeOrder;
    }
    @Override
    public Object clone() throws CloneNotSupportedException {
        Buff cloneItem = (Buff) super.clone();
        return cloneItem;
    }
    public void setActive(boolean flag){
        this.isActive = flag;
    }

    public double getTimeRemaining(){
        return this.timeRemaining;
    }

    public int getStat() {
        return stat;
    }

    public String getName() {
        return this.effectList.get(this.stat).getName();
    }

    public double getValue() {
        return this.effectList.get(this.stat).getValue();
    }
    /*
    public Buff clone (Buff clone){
        clone.buffType = this.buffType;
        clone.isActive = this.isActive;
        clone.battleObjectId = this.battleObjectId;
        clone.effectList = (Vector<Effect>) this.effectList.clone();
        return clone;
    }

     */
}
