package model.Shop;

import model.Chest.Chest;
import model.Define.ModelDefine;
import model.Inventory.Inventory;
import model.PlayerInfo;
import util.supportClass.RandomInt;
import util.database.DataModel;

import java.util.Arrays;

public class LoginItem extends DataModel {
    private static final int minFragment = 50;
    private static final int maxFragment = 100;
    private static final int step = 10;
    private static final int goldPerCard = 10;
    private static final int goldPerChest = 1000;
    private static final int maxCardSlot = 3;
    private static final int minCardSlot = 1;

    private int chestSlot ;
    private int[] chestIDs; // send to client
    private Chest[] chests;
    private int[] priceOfChests;

    private int cardSlot ;
    private int[] cardID;  // send to client
    private int[] amountOfCards; // send to client
    private int[] priceOfCards;
    private byte[] isBoughtCards;

    public LoginItem(PlayerInfo playerInfo, LoginItem tmpLoginItem){
        super();

        this.chestSlot = tmpLoginItem.chestSlot; //copy
        this.chestIDs = new int[chestSlot];
        this.chests = new Chest[chestSlot];
        this.priceOfChests = new int[chestSlot];
        for(int i=0;i<chestSlot;i++){
            this.chestIDs[i] = playerInfo.getChestController().createChest(tmpLoginItem.getChest(i));
            this.chests[i] = playerInfo.getChestController().getChest(this.chestIDs[i]);
            this.priceOfChests[i] = goldPerChest;
        }


        this.cardSlot = tmpLoginItem.cardSlot; //copy
        this.cardID = Arrays.copyOfRange(tmpLoginItem.cardID,0, this.cardSlot); // Copy
        this.amountOfCards = Arrays.copyOfRange(tmpLoginItem.amountOfCards,0,this.cardSlot); //copy
        this.priceOfCards = Arrays.copyOfRange(tmpLoginItem.priceOfCards,0,this.cardSlot); //copy
        this.isBoughtCards = Arrays.copyOfRange(tmpLoginItem.isBoughtCards,0,this.cardSlot); //copy

    }
    public LoginItem(){
        super();
        this.chestSlot = RandomInt.randInt(0,1);
        this.chestIDs = new int[chestSlot];
        this.chests = new Chest[chestSlot];
        this.priceOfChests = new int[chestSlot];
        for(int i=0;i<chestSlot;i++){
            this.chestIDs[i] = i;
            this.chests[i] = new Chest(this.chestIDs[i]);
            this.priceOfChests[i] = goldPerChest;
        }
        this.cardSlot = ModelDefine.LoginItemSlot - chestSlot;
        this.cardID= Inventory.randCardIdDifference(cardSlot);
        this.amountOfCards = Inventory.randAmountOfCard(minFragment/step,maxFragment/step,cardSlot);
        this.priceOfCards = new int[cardSlot];
        this.isBoughtCards = new byte[cardSlot];
        for(int i=0;i<cardSlot;i++){
            this.amountOfCards[i]*=10;
            this.priceOfCards[i]=this.amountOfCards[i]*goldPerCard;
            this.isBoughtCards[i]=0;
        }
    }
    public int getPositionOfChest(int id){
        for(int i=0;i<chestSlot;i++){
            if (this.chestIDs[i] == id){
                return i;
            }
        }
        return -1;
    }
    public Chest getChest(int id){
        for(int i=0;i<chestSlot;i++){
            if (this.chestIDs[i] == id){
                return this.chests[i];
            }
        }
        return null;
    }
    public boolean boughtChest(PlayerInfo playerInfo,int id) {
        if (playerInfo.getChestController().getChest(id) == null){
            return false;
        }
        Chest receiveChest = this.getChest(id);
        if (receiveChest == null){
            return false;
        }
        if (receiveChest.getIsReceive() == 1){
            return false;
        }
        int positionOfChest = this.getPositionOfChest(id);
        if (playerInfo.getGold() < this.priceOfChests[positionOfChest]){
            return false;
        }
        playerInfo.upGold(this.priceOfChests[positionOfChest] * (-1));
        receiveChest.receive(playerInfo);
        return true;
    }
    public boolean boughtCard(PlayerInfo playerInfo, int id){
        int index = -1;
        for(int i=0;i<cardSlot;i++){
            if (this.cardID[i] == id) {
                index = i;
            }
        }
        if (index == -1 || this.isBoughtCards[index] == 1) {
            return false;
        }
        this.isBoughtCards[index] = 1;
        if (playerInfo.getGold() < this.priceOfCards[index]){
            return false;
        }
        playerInfo.upGold(this.priceOfCards[index] * (-1));
        playerInfo.getInventory().getCard(this.cardID[index]).upExp(this.amountOfCards[index]);
        return true;
    }


    public int[] getCardID() {
        return Arrays.copyOfRange(cardID,0, this.cardSlot);
    }
    public int[] getAmountOfCard() {
        return Arrays.copyOfRange(amountOfCards,0, this.cardSlot);
    }

    public byte[] getIsBoughtCards() {
        return Arrays.copyOfRange(isBoughtCards,0, this.cardSlot);
    }

    public int getChestSlot() {
        return chestSlot;
    }

    public int[] getPriceOfChests() {
        return Arrays.copyOfRange(priceOfChests,0, this.chestSlot);
    }

    public int[] getChestIDs() {
        return Arrays.copyOfRange(chestIDs,0, this.chestSlot);
    }
}
