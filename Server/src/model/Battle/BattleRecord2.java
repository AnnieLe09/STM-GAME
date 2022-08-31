package model.Battle;

import controller.MainController;

import java.util.ArrayList;

public class BattleRecord2 {
    private String ID;
    private String className;
    private String battleControllerID;
    private ArrayList<BattleAction>actions = new ArrayList<>();
    public BattleRecord2(String battleControllerID){
        this.className = "BattleControllerRecord";
        this.ID = MainController.getIdController().genNewID(this.className);
        this.battleControllerID = battleControllerID;
    }
    public void saveAction(BattleAction action){
        actions.add(action);
    }
    public String getID() {
        return ID;
    }
}
