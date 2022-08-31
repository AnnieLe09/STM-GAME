package model.Battle;

import bitzero.server.extensions.data.BaseMsg;
import controller.BattleController;

import java.nio.ByteBuffer;
import java.util.LinkedList;

public class BattleStatus implements Cloneable {
    BattleController battleController;
    public BattleStatus(BattleController battleController){
        System.out.println("Battle Status");
        try{
            this.battleController = (BattleController) battleController.clone();
            System.out.println("tick " + String.valueOf(battleController.getCurTick()) + " spell num: " + String.valueOf(battleController.getPlayers()[0].getSpellNum()));
        }catch (CloneNotSupportedException a){
            a.printStackTrace();
        }
    }

}
