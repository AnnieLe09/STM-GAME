package model.buff.targetbuff;

import model.Define.ModelDefine;
import model.buff.Buff;
import model.buff.Effect;
import util.readJson.ModelJson;
import util.readJson.ReadJson;

public class TargetBuff extends Buff {
    private int targetBuffType;
    private String name;
    private String durationType;
    private double[] duration;
    public TargetBuff(int targetBuffType,int numEffect) {
        super(ModelDefine.BUFF_TOWERBUFF,targetBuffType);
        this.targetBuffType = targetBuffType;
        this.readTargetBuffJson(numEffect);
    }

    private void readTargetBuffJson(int numEffect) {
        ReadJson targetBuffJson = new ReadJson(ModelJson.TargetBuff_Json);
        String pointer = targetBuffJson.get();
        pointer = targetBuffJson.getWithJsonString(pointer,"targetBuff");
        pointer = targetBuffJson.getWithJsonString(pointer,String.valueOf(this.targetBuffType));
        this.name = targetBuffJson.getWithJsonString(pointer,"name");
        this.durationType = targetBuffJson.getWithJsonString(pointer,"durationType");
        this.duration = new double[numEffect + 1];
        this.duration[0] = 0;
        String tmpPointer = targetBuffJson.getWithJsonString(pointer,"duration");
        for(int i=1;i<=numEffect;i++){
            this.duration[i]=targetBuffJson.getDoubleWithJsonString(tmpPointer,String.valueOf(i));
        }
        pointer = targetBuffJson.getWithJsonString(pointer,"effects");
        for(int i = 1; i <= numEffect; i++){
            String source = targetBuffJson.getWithJsonString(pointer,String.valueOf(i));
            System.out.println(source);
            source = targetBuffJson.removeOneBraket(source);
            System.out.println(source);
            this.effectList.add(new Effect(source)) ;
        }
    }

    public void setStat(int stat){
        this.stat = stat;
    }
    public void startTimeRemaining(){
        this.timeRemaining = this.duration[this.stat]/1000;
    }
    public void updateBuff(double dt){
        if (this.timeRemaining < dt){
            this.timeRemaining = 0;
            this.isActive = false;
        }
        else {
            this.timeRemaining -= dt;
        }
    }
}
