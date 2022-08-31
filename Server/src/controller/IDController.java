package controller;

import bitzero.engine.sessions.Session;
import bitzero.server.BitZeroServer;
import bitzero.server.entities.User;
import model.Battle.Player;
import model.Define.ModelDefine;
import model.PlayerInfo;
import util.database.DataModel;
import util.server.ServerConstant;
import util.supportClass.RandomInt;
import util.supportClass.TimeSupport;

public class IDController extends DataModel {
    private long userID;
    private long countID;
    private String name;
    public IDController(long userID){
        super();
        this.userID = userID;
        this.countID = 10000000000L;
        this.name = "#IDController";
    }
    public String genNewID(String name){
        countID += 1;
        if (countID == ModelDefine.MODEL_SOCIAL_ID) countID+=1;
        MainController.saveModel(this);
        StringBuilder id;
        id = new StringBuilder("@" + name + "_" + RandomInt.randLong(0, 1000000000000000000L) + "_" + countID + "_");

        /*
        int n = RandomInt.randInt(6,10);
        for(int i=0;i < n;i++){
            int isLetter = RandomInt.randInt(0,1);
            if (isLetter == 0){
                int k = RandomInt.randInt(0,9);
                id.append(k);
            }
            else {
                char k = (char)(RandomInt.randInt(0,26) +97);
                id.append(k);
            }
        }

         */
        return id.toString();
    }
    public static PlayerInfo getPlayerByID(int uid){
        if (uid < 0){
            return MainController.getBotInfo(uid);
        }
        User user = BitZeroServer.getInstance().getUserManager().getUserById(uid);
        if (user == null) return null;
        return (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
    }
    public static User getUserByID(int uid){
        User user = BitZeroServer.getInstance().getUserManager().getUserById(uid);
        if (uid < 0){
            return MainController.getBotUser(uid);
        }
        return user;
    }
    public static User getUserByPlayer(Player player){
        User user = BitZeroServer.getInstance().getUserManager().getUserById(player.getInfo().getID());
        if (player.getInfo().getID() < 0){
            user = MainController.getBotUser(player.getInfo().getID());
        }
        return user;
    }
    public static User createFakeUserWithId(int userID){
        User user = new User(new Session());
        user.setId(userID);
        return user;
    }
}
