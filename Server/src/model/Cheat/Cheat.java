package model.Cheat;

import model.PlayerInfo;

import java.util.ArrayList;

public class Cheat {
    public static int upG(PlayerInfo playerInfo,int g){
        playerInfo.upG(g);
        return playerInfo.getG();
    }
    public static int upGold(PlayerInfo playerInfo,int gold){
        playerInfo.upGold(gold);
        return playerInfo.getGold();
    }
    public static int upTrophy(PlayerInfo playerInfo, int trophy){
        playerInfo.upTrophy(trophy);
        return playerInfo.getTrophy();
    }
    public static int upExpCard(PlayerInfo playerInfo,int id,int exp){
        return playerInfo.getInventory().upExpCard(id,exp);

    }
    public static int upLevelCard(PlayerInfo playerInfo,int id,int level){
        return playerInfo.getInventory().upLevelCardWithoutGold(id,level);
    }
    public static int upLobbyChest(PlayerInfo playerInfo){
        int id = playerInfo.getChestController().createChest();
        return id;
    }
    public static int reduceLobbyChestTime(PlayerInfo playerInfo,int id,int t){
        return playerInfo.getChestController().reduceTimeRemainingOfLobbyChest(id,t);
    }
    public static int[] reduceAllLobbyChestTime(PlayerInfo playerInfo,int t){
        ArrayList<Integer> lobbyChestId = playerInfo.getChestController().getLobbyChests();
        int[] id_time = new int[playerInfo.getChestController().getAmountOfLobbyChest()*2];
        int i=0;
        for (int id: lobbyChestId){
            id_time[i*2] = id;
            id_time[i*2+1] = reduceLobbyChestTime(playerInfo,id,t);
            i+=1;
        }
        return id_time;
    }

}
