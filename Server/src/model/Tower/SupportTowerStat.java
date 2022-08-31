package model.Tower;

import util.readJson.TowerJson;
import util.database.DataModel;

public class SupportTowerStat extends DataModel {
    private int stateLevel;
    private double range;
    public SupportTowerStat( String sourceJson,  int level){
        super();
        this.stateLevel = level;
        readSupportTowerStatJson(sourceJson);
    }
    public void readSupportTowerStatJson(String source){
        TowerJson towerJson = new TowerJson();
        source = towerJson.getWithJsonString(source,"stat");
        source = towerJson.getWithJsonString(source,String.valueOf(this.stateLevel));
        this.range = towerJson.getDoubleWithJsonString(source,"range");
    }

    public double getRange() {
        return range;
    }
}

