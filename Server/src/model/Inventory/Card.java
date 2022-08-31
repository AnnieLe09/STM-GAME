package model.Inventory;

import controller.IDController;
import controller.MainController;
import cmd.error_Default_Value.Error_negative;
import model.Battle.BattleObject;
import model.Define.CardDefine;
import model.PlayerInfo;
import util.database.DataModel;

import java.util.ArrayList;

public class Card extends DataModel {
    private static final int[] achievedLevelUpExp = {0,5,10,20,50,100,200,300,400,500};
    private static final int[] achievedLevelUpGold = {0,5,10,20,50,100,200,300,400,500};
    private int id;   // send To client
    private String name;
    private int type;
    private int battleObjectTypeId;
    private int grade;
    private int level;
    private int exp;
    private BattleObject battleObject;


    public Card(PlayerInfo playerInfo , int id){
        super();
        this.id = id;
        this.level = 1;
        this.exp = 0;
        this.type = CardDefine.OBJECT_TYPES[id];
        this.battleObjectTypeId = CardDefine.OBJECT_IDS[id];
        this.battleObject = MainController.getBattleObjectFactory().createBattleObject(this.type,this.battleObjectTypeId, 1);
        this.name = this.battleObject.getName();
        //System.out.println(this.toJson());
    }

    public int upExp(int exp){
        this.exp += exp;
        if(this.exp < 0) this.exp = 0;
        return this.exp;
    }
    public int upLevel(PlayerInfo playerInfo){
        if (this.level >= achievedLevelUpExp.length || achievedLevelUpExp[this.level] > this.exp
                || achievedLevelUpGold[this.level] > playerInfo.getGold()){
            return Error_negative.error_negative;
        }
        this.level += 1;
        this.upExp(achievedLevelUpExp[this.level - 1] * (-1));
        playerInfo.upGold(achievedLevelUpGold[this.level - 1] * (-1));
        return this.level;
    }
    public int upLevelWithoutGold(int level){
        this.level += level;
        if (this.level < 1 ) this.level = 1;
        return this.level;
    }
    public int getLevelUpExp(int level){
        return achievedLevelUpExp[level-1];
    }
    public int getLevelUpGold(int level){
        return achievedLevelUpGold[level-1];
    }

    public int getId() {
        return id;
    }

    public int getLevel() {
        return level;
    }

    public int getExp() {
        return exp;
    }

    public int getType() {
        return type;
    }

    public int getBattleObjectTypeId() {
        return battleObjectTypeId;
    }

    public static ArrayList<Card> createBattleCardList(){
        //do something
        return null;
    }
    public static Card getCard(int userId, int cardId){
        return IDController.getPlayerByID(userId).getInventory().getCard(cardId);
    }
}
