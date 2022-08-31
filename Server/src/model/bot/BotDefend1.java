package model.bot;

import controller.BattleController;
import util.supportClass.RandomInt;

public class BotDefend1 extends Bot{
    public BotDefend1(int player_ID, BattleController battleController) {
        super(player_ID, battleController);
    }
    public void doAction() {
        //Todo something
        int actionType = getActionType();
        switch (actionType){
            case 0:
            case 1:
            case 2:
                placeTower();
                break;
            case 3:
                upgradeTower();
                break;
            case 4:
                placeMonster();
                break;

        }
    }
    public int getActionType() {
        return RandomInt.randInt(0,4);

    }
}
