package model.Inventory;


import cmd.error_Default_Value.Error_negative;
import model.Define.CardDefine;
import model.Define.ModelDefine;
import model.PlayerInfo;
import util.supportClass.RandomInt;
import util.database.DataModel;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Set;

public class Inventory extends DataModel {
    private static final int amountOfChosenCard = 8;
    private static final int amountOfCardCollection = 10;
    private static final int amountOfCards = amountOfChosenCard + amountOfCardCollection;

    private final Hashtable<Integer, Card> cardContainer;
    private final Hashtable<Integer, Card> chosenCardContainer;
    private final Hashtable<Integer, Card> cardCollectionContainer;


    public Inventory(PlayerInfo playerInfo){
        super();

        this.cardContainer = new  Hashtable<Integer, Card>();
        this.chosenCardContainer = new Hashtable<Integer, Card>();
        for(int i = 0; i<= amountOfChosenCard - 1; i++)
        {
            Card newCard = new Card(playerInfo,i);
            this.cardContainer.put(i,newCard);
            this.chosenCardContainer.put(i,newCard);
        }

        this.cardCollectionContainer = new Hashtable<Integer, Card>();
        for(int i = amountOfChosenCard; i <= amountOfChosenCard + amountOfCardCollection -1 ; i++)
        {
            Card newCard = new Card(playerInfo,i);
            this.cardContainer.put(i,newCard);
            this.cardCollectionContainer.put(i,newCard);
        }


    }

    public boolean changeCard(int collectionCardID, int chosenCardID){
        //TODO something
        Card collectionCard = this.cardCollectionContainer.get(collectionCardID);
        Card chosenCard = this.chosenCardContainer.get(chosenCardID);
        if (collectionCard == null || chosenCard == null){
            return false;
        }
        this.cardCollectionContainer.remove(collectionCardID);
        this.chosenCardContainer.remove(chosenCardID);
        this.cardCollectionContainer.put(chosenCardID,chosenCard);
        this.chosenCardContainer.put(collectionCardID,collectionCard);

        return true;
    }
    public int upExpCard(int id,int exp){
        Card upCard = this.cardContainer.get(id);
        if (upCard == null) {
            return Error_negative.error_negative;
        }
        return upCard.upExp(exp);
    }
    public int upLevelCard(PlayerInfo playerInfo,int id){
        Card upCard = this.cardContainer.get(id);
        if (upCard == null) {
            return Error_negative.error_negative;
        }
        return upCard.upLevel(playerInfo);
    }
    public int upLevelCardWithoutGold(int id,int level){
        Card upCard = this.cardContainer.get(id);
        if (upCard == null) {
            return Error_negative.error_negative;
        }
        return upCard.upLevelWithoutGold(level);
    }

    public Card getCard(int id){
        return this.cardContainer.get(id);
    }
    public int getAmountOfChosenCards() {
        return amountOfChosenCard;
    }
    public Set<Integer> getChosenCardList(){
        Set<Integer> idChestList;
        idChestList = this.chosenCardContainer.keySet();
        return  idChestList;
    }
    public int getAmountOfCardCollections() {
        return amountOfCardCollection;
    }
    public Set<Integer> getCardCollectionList(){
        Set<Integer> idChestList;
        idChestList = this.cardCollectionContainer.keySet();
        return  idChestList;
    }
    public static int[] randCardIdDifference(int cardSlot){
        return RandomInt.randIntsDifference(0,amountOfCards - 1,cardSlot);
    }
    public static int[] randAmountOfCard(int minFragment, int maxFragment, int cardSlot){
        int[] amountOfCard = new int[cardSlot];

        for(int i=0; i < cardSlot; i++) {
            amountOfCard[i] = RandomInt.randInt(minFragment,maxFragment);
        }
        return amountOfCard;
    }
    public int[] randomChosenCard(int cardSlot){
        int[] listCardID = new int[cardSlot];
        Set<Integer> setCardIDs = this.chosenCardContainer.keySet();
        int[] intCardIDs = new int[amountOfChosenCard];
        int index=0;
        for(int i:setCardIDs){
            intCardIDs[index] = i;
            index+=1;
        }
        // Random cho 8 card dau tien
        int[] fiveFirstCards = RandomInt.randIntsDifference(0,amountOfChosenCard-1,amountOfChosenCard);
        for (int i=0;i<amountOfChosenCard;i++){
            fiveFirstCards[i] = intCardIDs[fiveFirstCards[i]];
        }
        // 2 card dau tien duoc thay bang 2 card tower
        for (int i=0;i<ModelDefine.amountFirstTowerInHand;i++){
            for(int j = i;j<amountOfChosenCard;j++){
                if (this.chosenCardContainer.get(fiveFirstCards[j]).getType() == CardDefine.TOWER_OBJECT) {
                    int tmp = fiveFirstCards[i];
                    fiveFirstCards[i] = fiveFirstCards[j];
                    fiveFirstCards[j] = tmp;
                }
            }
        }

        // Random lai cho 4 tam dau tien
        for(int i = 0; i < ModelDefine.amountCardInHand; i++){
            int k = RandomInt.randInt(0,ModelDefine.amountCardInHand - 1);
            int tmp = fiveFirstCards[i];
            fiveFirstCards[i] = fiveFirstCards[k];
            fiveFirstCards[k] = tmp;
        }

        // Lay 5 card dau tien cho ket qua

        for(int i=0;i<Math.min(ModelDefine.amountCardInHand + 1,cardSlot);i++){
            listCardID[i] = fiveFirstCards[i];
        }

        // Random cac card con lai
        for(int i=ModelDefine.amountCardInHand + 1;i<cardSlot;i++){
            listCardID[i] = RandomInt.randInt(0,amountOfChosenCard-1);
            listCardID[i] = intCardIDs[listCardID[i]];
        }

        for(int i=0;i<cardSlot;i++){
            System.out.print(listCardID[i]+" ");
        }
        System.out.println();
        return listCardID;
    }
}
