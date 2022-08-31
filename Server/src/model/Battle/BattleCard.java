package model.Battle;

import controller.IDController;
import controller.MainController;
import model.Inventory.Card;

import java.util.LinkedList;

public class BattleCard {
    private String id;
    private int objectId;
    private int type;
    private int level;
    private String className;
    public BattleCard(int userId, int objectId){
        this.className = "BattleCard";
        this.objectId = objectId;
        Card card = Card.getCard(userId, objectId);
        this.type = card.getType();
        this.level = card.getLevel();
        this.id = MainController.getNewId(this.className);
    }
    public static LinkedList<BattleCard> createBattleCardList(int[] chosenCards, int num){
        //todo
        return null;
    }
    public BattleObject getBattleObject(){
        //todo
        return null;
    }

    public String getId() {
        return id;
    }

    public int getObjectId() {
        return objectId;
    }
}
