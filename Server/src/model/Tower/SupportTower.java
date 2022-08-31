package model.Tower;

import model.Battle.Player;
import model.Define.ModelDefine;
import model.buff.Buff;
import model.buff.Effect;
import model.buff.towerbuff.TowerBuff;
import util.readJson.TowerJson;

import java.util.LinkedList;
import java.util.Vector;

public class SupportTower extends Tower{
    private int auraTowerBuffType;
    private TowerBuff towerBuff;
    private SupportTowerStat[] supportTowerStats;
    public SupportTower(int towerId) {
        //super(towerId,"SupportTower");
        super(towerId, 1);
        this.supportTowerStats = new SupportTowerStat[ModelDefine.CARD_MAX_EVOLUTION + 1];
        this.readJson();
        this.towerBuff = new TowerBuff(this.auraTowerBuffType,ModelDefine.CARD_MAX_EVOLUTION);
        this.towerBuff.setBattleObjectId(this.battleObjectId+"_Buff_");
        this.towerBuff.setActive(false);
        this.curRange = this.supportTowerStats[this.curStat].getRange();
    }
    private void updateWithStatAndBuff() {
        this.curRange = this.supportTowerStats[this.curStat].getRange();

        this.buffs.removeIf(buff -> ( buff == null || !buff.getIsActive()));
        for(Buff buff:this.buffs){
            if (!buff.getIsActive()){
                continue;
            }
            Vector<Effect> effects = buff.getEffectList();
            int index;
            if (effects.size() > 2){
                index = this.curStat;
            }
            else {
                index = 1;
            }
            Effect effect = effects.get(index);

            if (effect.getName().equals("rangeUp")){
                this.curRange += this.supportTowerStats[this.curStat].getRange() * effect.getValue();;
            }
        }

        if (this.curRange < 0){
            this.curRange = 0;
        }

    }
    public void doActiveTower(){
        super.doActiveTower();
        this.player.addBuff(this.towerBuff);
    }
    public void update(double dt) {
        super.update(dt);
        this.updateWithStatAndBuff();
        if (this.isActive){
            this.towerBuff.setActive(true);
        }
        else {
            this.towerBuff.setActive(false);
            return;
        }
        LinkedList<Tower> towers = this.player.getTowerInMapList();
        for (Tower tower: towers){
            if (tower!= this && tower.getIsActive() &&
                    this.curPos.getDistance(tower.getCurPos()) <= this.curRange){
                tower.addBuff(this.towerBuff);
            }
        }
        //TODO Something
    }

    public void readJson() {
        TowerJson towerJson = new TowerJson();

        String pointer = towerJson.get();
        pointer = towerJson.getWithJsonString(pointer,"tower");
        pointer = towerJson.getWithJsonString(pointer,String.valueOf(this.objectId));

        this.auraTowerBuffType = towerJson.getIntWithJsonString(pointer,"auraTowerBuffType");
        this.supportTowerStats[0] = null;
        for (int i = 1; i < this.supportTowerStats.length; i++) {
            this.supportTowerStats[i] = new SupportTowerStat(pointer, i);
        }

        //System.out.println(this.toJson());
    }

    public TowerBuff getTowerBuff() {
        return towerBuff;
    }

    public SupportTower clone() {
        SupportTower clone = new SupportTower(this.objectId);
        super.clone(clone);
        clone.towerBuff = this.towerBuff;
        return clone;
    }
}
