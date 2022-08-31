package model.bot.bot_info;

import model.Define.BotDefine;
import model.Define.ModelDefine;
import model.PlayerInfo;
import util.supportClass.RandomInt;

import java.util.Timer;
import java.util.TimerTask;

public class BotInfoAttack1 extends PlayerInfo {


    public BotInfoAttack1(int id, String name) {
        super(id, name);
        this.type = BotDefine.BotInfoAttack1;
        this.changeCard();
    }
    public void changeCard(){
        this.getInventory().changeCard(8,6);
        this.getInventory().changeCard(10,5);
        this.getInventory().changeCard(12,2);
        this.getInventory().changeCard(16,3);


        for(int i = 0; i < 3; i++){
            this.getInventory().changeCard(15 + i,5+i);
            this.getInventory().changeCard(7+i,2+i);
        }
    }
}
