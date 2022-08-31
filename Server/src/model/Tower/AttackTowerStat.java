package model.Tower;

import util.readJson.TowerJson;
import util.database.DataModel;

public class AttackTowerStat extends DataModel {
    private int stateLevel;
    private double damage;
    private double attackSpeed;
    private double range;
    private double bulletRadius;
    private double bulletSpeed;
    public AttackTowerStat( String sourceJson,  int level){
        super();
        this.stateLevel = level;
        readAttackTowerStatJson(sourceJson);
    }
    public void readAttackTowerStatJson(String source){
        TowerJson towerJson = new TowerJson();
        source = towerJson.getWithJsonString(source,"stat");
        source = towerJson.getWithJsonString(source,String.valueOf(this.stateLevel));
        this.damage = towerJson.getDoubleWithJsonString(source,"damage");
        this.attackSpeed = towerJson.getDoubleWithJsonString(source,"attackSpeed");
        this.range = towerJson.getDoubleWithJsonString(source,"range");
        this.bulletRadius = towerJson.getDoubleWithJsonString(source,"bulletRadius");
        this.bulletSpeed = towerJson.getDoubleWithJsonString(source,"bulletSpeed");
    }

    public double getAttackSpeed() {
        return attackSpeed;
    }

    public double getBulletRadius() {
        return bulletRadius;
    }

    public double getBulletSpeed() {
        return bulletSpeed;
    }

    public double getDamage() {
        return damage;
    }

    public double getRange() {
        return range;
    }

}
