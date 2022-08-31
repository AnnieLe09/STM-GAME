package manager.Battle;

import bitzero.util.socialcontroller.bean.UserInfo;
import cmd.send.demo.ResponseRequestUserInfo;
import controller.BattleController;
import controller.IDController;
import controller.MainController;
import model.Battle.BattleRecord2;
import model.Battle.Player;
import model.Define.ModelDefine;
import model.PlayerInfo;
import model.bot.bot_info.BotInfoAttack1;
import model.bot.bot_info.BotInfoDefend1;
import org.apache.commons.lang.exception.ExceptionUtils;
import service.FindMatchHandler;
import util.GuestLogin;
import util.server.ServerConstant;
import util.supportClass.RandomInt;
import util.supportClass.TimeSupport;
import util.vector.VecIntLong;
import util.database.DataModel;

import java.util.*;

public class BattleManager extends DataModel {
    private long myID;
    private Hashtable<Integer, Long> playerWaiting; // UserID - TROPHY (x) - TIME (y)
    private Hashtable<Integer,BattleController> battleControllers;  // UserID - MatchID
    private Hashtable<String,String> curRecordMatchLists; // BattleControllerID - Record_Of_This_BattleController
    private Hashtable<Integer, Boolean>usersInBattle; // check if user with id had battle or not

    public BattleManager(long id){
        super();
        this.myID = id;
        this.playerWaiting = new Hashtable<Integer, Long>();
        this.battleControllers = new Hashtable<>();
        this.curRecordMatchLists = new Hashtable<>();
        this.usersInBattle = new Hashtable<>();
        scheduleReduceTrophy();
    }
    private PlayerInfo findPlayer(PlayerInfo playerInfo, int diffTrophy){
        int uid = playerInfo.getID();
        int finderTrophy = playerInfo.getTrophy();
        //AddBot
        if (diffTrophy > ModelDefine.FINDMATCH_MAX_WAITING*100){
            return addBot();
        }
        //-------------------------

        Set<Integer> playerIDList = playerWaiting.keySet();
        for(int id: playerIDList){
            if (id == uid) {
                continue;
            }
            /*
            if (usersInBattle.get(id)){
                continue;
            }

             */
            PlayerInfo player2 = IDController.getPlayerByID(id);
            if (player2 == null) continue;
            int different = Math.abs(player2.getTrophy() - finderTrophy);
            //if ((different<= diffTrophy) && (different <= playerWaiting.get(id) * ModelDefine.FINDMATCH_TROPHY_DIFFERENT))
            if ((different<= diffTrophy) && (different <= getDifferentTrophyDelta(player2)))
                if (battleControllers.get(player2.getID()) == null)
                return player2;
        }
        return null;
    }
    public BattleController findBattleByUser(int userId){
        if(battleControllers.containsKey(userId)){
            return battleControllers.get(userId);
        }
        return null;
    }
    private BattleController startMatch(PlayerInfo player1, PlayerInfo player2){
        System.out.println("BattleManager: start match" + String.valueOf(player1.getID()) + String.valueOf(player2.getID()));
        BattleController battleController = new BattleController(player1.getID(),player2.getID());
        battleControllers.put(player1.getID(), battleController);
        battleControllers.put(player2.getID(), battleController);
        BattleRecord2 battleControllerRecord = new BattleRecord2(battleController.getId());
        this.playerWaiting.remove(player1.getID());
        this.playerWaiting.remove(player2.getID());
        this.curRecordMatchLists.put(battleController.getId(),battleControllerRecord.getID());
        //this.scheduleEndMatch(battleController.getId());
        return battleController;
    }

    public BattleController findMatch(int playerID){
        System.out.println("BattleManager: find match" + String.valueOf(playerID));
        /*
        if(battleControllers.containsKey(playerID)){
            return battleControllers.get(playerID);
        }
         */
        PlayerInfo player1 = IDController.getPlayerByID(playerID);
        if (player1 == null) {
            //return ModelDefine.ERROR_PLAYER_NULL;
            return null;
        }
        long unixTimeNow = TimeSupport.unixTimeNow();
        //usersInBattle.put(playerID, false);
        playerWaiting.put(playerID, unixTimeNow);
        //scheduleReduceTrophy(player1);
        //return searchForPlayers(player1);
        return null;
    }
    private int getDifferentTrophyDelta(PlayerInfo player){
        long unixTimeNow = TimeSupport.unixTimeNow();
        long unixTimeStart = playerWaiting.get(player.getID());
        System.out.println((int)(((unixTimeNow - unixTimeStart) / 1000) / 5 + 1) * ModelDefine.FINDMATCH_TROPHY_DIFFERENT);
        return (int)(((unixTimeNow - unixTimeStart) / 1000) / 5 + 1) * ModelDefine.FINDMATCH_TROPHY_DIFFERENT;
    }
    public boolean cancelFindMatch(int playerId){
        if(!playerWaiting.containsKey(playerId) || playerWaiting.get(playerId) == null){
            return false;
        }
        playerWaiting.remove(playerId);
        return true;
    }
    private BattleController searchForPlayers(PlayerInfo player) {
        /*PlayerInfo opponent = null;
        while(!usersInBattle.get(player.getID()) && opponent == null){
            if (playerWaiting.get(player.getID()) >= ModelDefine.FINDMATCH_MAX_WAITING) {
                opponent = addBot();
            }
            else {
                opponent = findPlayer(player,playerWaiting.get(player.getID()) * ModelDefine.FINDMATCH_TROPHY_DIFFERENT);
            }
        }
        usersInBattle.put(player.getID(), true);
        if(usersInBattle.get(opponent.getID()) != null &&
                usersInBattle.get(opponent.getID()) == true) return null;
        usersInBattle.put(opponent.getID(), true);
        System.out.println("BattleManager: find player at trophy " + String.valueOf(playerWaiting.get(player.getID()) * 100));
        System.out.println("Start game With: "+player.getID()+" "+opponent.getID());
        return startMatch(player, opponent);*/
        PlayerInfo opponent = findPlayer(player,getDifferentTrophyDelta(player));
        if(opponent != null){
            return startMatch(player, opponent);
        }
        return null;
    }

    private void scheduleReduceTrophy(){
        /*Timer timer = new Timer();
        TimerTask tt = new TimerTask() {
            public void run(){
                int playerId = player.getID();
                if(playerWaiting.get(playerId) == null || playerWaiting.get(playerId) >= ModelDefine.FINDMATCH_MAX_WAITING){
                    timer.cancel();
                    return;
                }
                playerWaiting.put(playerId, playerWaiting.get(playerId) + 1);
            }
        };
        timer.schedule(tt, 0, 5000);*/
        Timer timer = new Timer();
        TimerTask tt = new TimerTask() {
            public void run(){
                Set<Integer> playerIDList = playerWaiting.keySet();
                ArrayList<Integer> playerIDArray = new ArrayList<>(playerIDList);

                for(int id: playerIDArray){
                    if(playerWaiting.containsKey(id) && playerWaiting.get(id) != null){
                        PlayerInfo player = IDController.getPlayerByID(id);
                        if (player == null){
                            cancelFindMatch(id);
                            continue;
                        }
                        PlayerInfo opponent = findPlayer(player, getDifferentTrophyDelta(player));
                        if(opponent != null){
                            BattleController battleController = startMatch(player, opponent);
                            FindMatchHandler.sendFindMatch(battleController);
                        }
                    }
                }
            }
        };
        timer.schedule(tt, 0, 1000);
    }
    public boolean endMatch(int id1){
        MainController.findBattleByUser(id1).endMatch();
        battleControllers.remove(id1);
        usersInBattle.remove(id1);
        return true;
    }
    public PlayerInfo addBot(){
        int userId = RandomInt.randInt(10000000,1000000000) * (-1);

        PlayerInfo botInfo = IDController.getPlayerByID(userId);
        if (botInfo == null){
            botInfo = chooseBot(userId);
            //botInfo = new BotInfoAttack1(userId,"BotInfoAttack1_"+(userId*(-1)));
            //botInfo = new BotInfoDefend1(userId,"BotInfoDefend1_"+(userId*(-1)));
            MainController.registerBotInfo(botInfo);
        }
        return botInfo;
    }
    public PlayerInfo chooseBot(int userId){
        int type = RandomInt.randInt(0,1);
        switch (type){
            case 0:
                return new BotInfoAttack1(userId,"BotInfoAttack1_"+(userId*(-1)));
            case 1:
                return new BotInfoDefend1(userId,"BotInfoDefend1_"+(userId*(-1)));

        }
        return new BotInfoDefend1(userId,"BotInfoDefend1_"+(userId*(-1)));
    }
}
