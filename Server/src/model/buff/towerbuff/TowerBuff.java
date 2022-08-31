package model.buff.towerbuff;

import model.Define.ModelDefine;
import model.Tower.Tower;
import model.buff.Buff;
import model.buff.Effect;
import util.readJson.ModelJson;
import util.readJson.ReadJson;

import java.util.LinkedList;

public class TowerBuff extends Buff {
    protected int towerBuffType;
    protected String name;
    protected String durationType;
    public TowerBuff(int towerBuffType,int numEffect) {
        super(ModelDefine.BUFF_TOWERBUFF,towerBuffType);
        this.towerBuffType = towerBuffType;
        this.readTowerBuffJson(numEffect);
    }
    public void readTowerBuffJson(int numEffect){
        ReadJson towerBuffJson = new ReadJson(ModelJson.TowerBuff_Json);
        String pointer = towerBuffJson.get();
        pointer = towerBuffJson.getWithJsonString(pointer,"towerBuff");
        pointer = towerBuffJson.getWithJsonString(pointer,String.valueOf(this.towerBuffType));
        this.name = towerBuffJson.getWithJsonString(pointer,"name");
        this.durationType = towerBuffJson.getWithJsonString(pointer,"durationType");
        pointer = towerBuffJson.getWithJsonString(pointer,"effects");
        for(int i = 1; i <= numEffect; i++){
            String source = towerBuffJson.getWithJsonString(pointer,String.valueOf(i));
            System.out.println(source);
            source = towerBuffJson.removeOneBraket(source);
            System.out.println(source);
            this.effectList.add(new Effect(source)) ;
        }
    };
    @Override
    public void updateBuff(double dt) {

    }

}
