package model.bot;

import controller.BattleController;
import controller.MainController;
import model.Battle.Player;
import model.Define.ModelDefine;
import util.supportClass.RandomInt;

import java.util.Timer;
import java.util.TimerTask;

public class BotAttack1 extends Bot{
    public BotAttack1(int player_ID, BattleController battleController) {
        super(player_ID, battleController);
    }
    public void scheduleSummonBot(){
        int nextMiLiSummonBot = RandomInt.randInt(1000,1500);
        Timer timer = new Timer();
        TimerTask tt = new TimerTask() {
            public void run(){
                summonBot(nextMiLiSummonBot);
                timer.cancel();
            }
        };
        timer.schedule(tt, nextMiLiSummonBot);
    }
    public void doAction() {
        //Todo something
        int actionType = getActionType();
        switch (actionType){
            case 1:
                placeTower();
                break;
            case 2:
                placeSpell();
                break;
            case 3:
                placeMonster();
                break;
            case 4:
                break;

        }
    }
    public int getActionType() {
        Player opponent = MainController.findBattleByUser(this.info.getID()).getOpponent(this.info.getID());
        if (opponent.getTotalStatTower()/5 > this.getTotalStatTower() /5 ){
            if (checkTowerInHand()){
                return 1;
            }
        }

        if (this.curEnergy > 60 && opponent.getTotalStatTower()/5 >= this.getTotalStatTower() /5 ){
            if (checkTowerInHand()){
                return 1;
            }
        }


        if (this.curHp < 12 && this.towerInMapList.size() < 3 && this.monsterInMapList.size() > this.curHp/3){
            if (this.curEnergy < 30){
                return 0;
            }
            return RandomInt.randInt(0,1);
        }

        if (this.curEnergy < 60){
            return 4;
        }
        if (this.checkMonsterInHand() && this.curEnergy > 30){
            return  3;
        }
        if (this.checkSpellInHand()){
            return 2;
        }
        if (this.checkTowerInHand()){
            return 1;
        }
        return RandomInt.randInt(1,4);
    }
}
