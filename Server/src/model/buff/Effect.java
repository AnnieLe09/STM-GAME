package model.buff;

import model.Define.ModelDefine;
import util.readJson.ModelJson;
import util.readJson.ReadJson;

public class Effect {
    private String name;
    private String type;
    private double value;
    public Effect(String pointer){
        ReadJson readJson = new ReadJson(ModelJson.TowerBuff_Json);
        this.name = readJson.getWithJsonString(pointer,"name");
        this.type = readJson.getWithJsonString(pointer,"type");
        try {
            this.value = readJson.getDoubleWithJsonString(pointer,"value");
        }
        catch(Exception e) {
            this.value = 0;
            System.out.println("This effect doesn't have value");
        }
    }
    public Effect(String name,String type,double value){
        this.name = name;
        this.type = type;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public double getValue() {
        return value;
    }

    public String getType() {
        return type;
    }

    public void setValue(double v) {
        this.value = v;
    }
}
