package model.Battle;

import controller.BattleController;

import java.util.ArrayList;

public class BattleRecord {
    ArrayList<BattleController>statusRecord;
    ArrayList<BattleAction>actionRecord;
    public BattleRecord(){
        statusRecord = new ArrayList<>();
        actionRecord = new ArrayList<>();
    }
    public void addStatus(BattleController battleStatus){
        statusRecord.add(battleStatus);
    }
}
