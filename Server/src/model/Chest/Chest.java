package model.Chest;


import bitzero.server.extensions.data.BaseMsg;
import bitzero.server.util.BinaryHelper;
import controller.MainController;
import model.Define.ModelDefine;
import model.Inventory.Card;
import model.Inventory.Inventory;
import model.PlayerInfo;
import util.supportClass.RandomInt;
import util.supportClass.TimeSupport;
import util.database.DataModel;


import java.nio.ByteBuffer;
import java.util.Arrays;

public class Chest extends DataModel {
    private static final int unlockDuration = 10800;
    private static final int minGold = 10;
    private static final int maxGold = 20;
    private static final int minFragment = 10;
    private static final int maxFragment = 20;
    private static final int maxCardSlot = 2;
    private static final int minCardSlot = 2;
    private static final int secondPerCoin = 600;


    private int id;   // send To client
    private String name;
    private byte isOpen;   // send to client
    private byte isReceive;  // send to client
    private int price;
    private long timeline;
    public long timeRemaining;  // send to client
    private int cardSlot;
    private int[] cardID;  // send to client
    private int[] amountOfCards; // send to client
    private int gold;  // send to client

    public Chest(int id){
        super();
        /*
        this.id = id;
        this.name = "Chest_"+this.id;
        this.isOpen = 0;
        this.isReceive = 0;
        this.price = unlockDuration / secondPerCoin ;
        this.timeline = LocalDateTime.now();
        this.timeRemaining = RandomInt.randInt(0,unlockDuration); // Should repair
        int[] tmpCards = RandomInt.randIntsDifference(0,amountIdOfCards,cardSlots); //Should repair
        cards = new int[cardSlots];
        amountOfCards = new int[cardSlots];

        for(int i=0; i < cardSlots; i++) {
            cards[i] = tmpCards[i];
            amountOfCards[i] = RandomInt.randInt(minFragment,maxFragment);
        }

        this.gold = RandomInt.randInt(minGold,maxGold);

         */


        this.id = id;
        this.name = ModelDefine.chest_Name[RandomInt.randInt(0, ModelDefine.chest_Name.length - 1)];
        this.isOpen = 0;
        this.isReceive = 0;
        this.price = unlockDuration / secondPerCoin ;
        this.timeline = TimeSupport.unixTimeNow();
        this.timeRemaining = unlockDuration;
        this.cardSlot = RandomInt.randInt(minCardSlot,maxCardSlot);
        cardID= Inventory.randCardIdDifference(cardSlot);
        amountOfCards = Inventory.randAmountOfCard(minFragment,maxFragment,cardSlot);
        this.gold = RandomInt.randInt(minGold,maxGold);
    }
    public Chest(int id,Chest tmpChest){
        super();

        this.id = id;
        this.name ="0";
        this.isOpen = 0;
        this.isReceive = 0;
        this.price = unlockDuration / secondPerCoin ;
        this.timeline = TimeSupport.unixTimeNow();
        this.timeRemaining = unlockDuration;
        this.cardSlot = tmpChest.cardSlot; // copy
        cardID= Arrays.copyOfRange(tmpChest.cardID,0, this.cardSlot); //copy
        amountOfCards = Arrays.copyOfRange(tmpChest.amountOfCards,0, this.cardSlot); //copy
        this.gold = tmpChest.gold; //copy
    }
    public int getPrice(){
        this.price = (int) (this.timeRemaining - 1) / secondPerCoin + 1;
        return this.price;
    }
    public boolean open(){
        if (this.isReceive == 1){
            return false;
        }
        this.isOpen = 1;
        this.timeline = TimeSupport.unixTimeNow();
        this.timeRemaining = unlockDuration;
        return true;
    }
    public boolean receive(PlayerInfo player){
        if (this.isReceive == 1){
            return false;
        }
        this.isOpen = 1;
        this.isReceive = 1;
        this.timeRemaining = 0;
        player.upGold(this.gold);
        for(int i=0;i<cardSlot;i++){
            Card card = player.getInventory().getCard(cardID[i]);
            card.upExp(this.amountOfCards[i]);
        }
        // TODO something
        return true;
    }
    public long updateTimeRemaining(){
        if (this.isOpen == 0){
            return 0;
        }
        long curTime = TimeSupport.unixTimeNow();
        this.timeRemaining -=  (curTime - this.timeline)/1000L;
        this.timeline = curTime;
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
        }
        return this.timeRemaining;
    }

    public int getTimeRemaining() {
        this.updateTimeRemaining();
        return (int) this.timeRemaining;
    }

    public int getId() {
        return id;
    }

    public byte getIsOpen() {
        return isOpen;
    }

    public byte getIsReceive() {
        return isReceive;
    }

    public int[] getAmountOfCard() {

        return Arrays.copyOfRange(amountOfCards,0, this.cardSlot);
    }

    public int[] getCardID() {

        return Arrays.copyOfRange(cardID,0, this.cardSlot);
    }

    public int getGold() {
        return gold;
    }

    public int reduceTimeRemaining(int t) {
        this.timeRemaining-=t;
        if (timeRemaining < 0){
            timeRemaining = 0;
        }
        return this.getTimeRemaining();
    }

    public String getName() {
        return this.name;
    }

}


