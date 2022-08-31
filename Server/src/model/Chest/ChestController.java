package model.Chest;

import cmd.error_Default_Value.Error_negative;
import controller.BattleController;
import model.PlayerInfo;
import util.database.DataModel;

import java.util.ArrayList;
import java.util.Hashtable;

public class ChestController extends DataModel {
    private static final int chestLobbySlot = 4;

    private Hashtable<Integer,Chest> chests;
    private ArrayList<Integer> lobbyChests;
    private Chest shopChest;
    private int lastChestID ;
    private int amountOfLobbyChest;

    public ChestController(){
        super();
        this.lastChestID = 0;
        this.chests = new Hashtable<Integer, Chest>();
        this.lobbyChests = new ArrayList<>();
        this.shopChest = null;

        this.amountOfLobbyChest = 0;

    }
    public int createChest(){
        if (this.lobbyChests.size() >= chestLobbySlot){
            return Error_negative.error_negative;
        }
        this.lastChestID +=1;
        //Chest newChest = new Chest(this.lastChestID);
        Chest newChest = new Chest(this.lastChestID);
        this.chests.put(this.lastChestID,newChest);
        this.lobbyChests.add(this.lastChestID);
        return this.lastChestID;
    }

    public int createChest(Chest tmpChest){
        this.lastChestID +=1;
        Chest newChest = new Chest(this.lastChestID,tmpChest);
        this.shopChest = newChest;
        this.chests.put(this.lastChestID,newChest);
        return this.lastChestID;
    }
    public Chest getChest(int id){
        return this.chests.get(id);
    }
    public int getAmountOfLobbyChest(){
        return lobbyChests.size();
    }
    public boolean openChest(int id){
        ArrayList<Integer> idChestList = this.getLobbyChests();
        for(int ID:idChestList){
            if (this.getChest(ID).getIsOpen() == 1){
                return false;
            }
        }
        if (!idChestList.contains((Integer) id)){
            return false;
        }
        Chest openedChest = this.chests.get(id);
        if (openedChest == null){
            return false;
        }
        return openedChest.open();
    }
    public boolean receiveChest(PlayerInfo playerInfo, int id){
        Chest receivedChest = this.chests.get(id);
        if (receivedChest == null){
            return false;
        }
        boolean equalReceive = receivedChest.receive(playerInfo);
        if (!equalReceive) return false;
        this.chests.remove(id);
        if (this.lobbyChests.contains((Integer) id)){
            this.amountOfLobbyChest -=1;
            this.lobbyChests.remove((Integer) id);
        }
        return true;
    }
    public boolean receiveChestNow(PlayerInfo playerInfo, int id, int g){
        if (this.getChest(id).getPrice() > g ) {
            return false;
        }
        if (playerInfo.getG() < g){
            return false;
        }
        playerInfo.upG(g*(-1));
        this.receiveChest(playerInfo,id);
        return true;
    }
    public ArrayList<Integer> getLobbyChests(){
        ArrayList<Integer> idChestList =  new ArrayList<>(this.lobbyChests);
        return  idChestList;
    }
    public void updateTimeRemainingOfLobbyChest(){
        ArrayList<Integer> idChestList;
        idChestList = new ArrayList<>(this.lobbyChests);
        for(int id:idChestList){
            Chest chest = this.getChest(id);
            chest.updateTimeRemaining();
        }
    }
    public int reduceTimeRemainingOfLobbyChest(int id,int t){
       if (!this.lobbyChests.contains(id)) {
           return Error_negative.error_negative;
       }
       Chest chest = this.getChest(id);
        return chest.reduceTimeRemaining(t);
    }

}
