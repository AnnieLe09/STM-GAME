package service.battle;

import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.ExtensionUtility;
import cmd.CmdDefine;
import cmd.receive.battle.*;
import cmd.send.demo.battle.ResponseEndMatch;
import cmd.send.demo.battle.ResponsePlaceOpponentSpell;
import cmd.send.demo.battle.ResponsePlaceSpell;
import cmd.send.demo.battle.ResponseStartRound;
import cmd.error_Default_Value.Error_ID;
import cmd.receive.battle.RequestPlaceSpell;
import cmd.receive.battle.RequestPlaceTower;
import cmd.error_Default_Value.Error_ID;
import cmd.receive.battle.RequestDropTower;
import cmd.receive.battle.RequestPlaceSpell;
import cmd.receive.battle.RequestPlaceTower;
import cmd.error_Default_Value.Error_ID;
import cmd.receive.battle.RequestDropTower;
import cmd.receive.battle.RequestPlaceSpell;
import cmd.receive.battle.RequestPlaceTower;
import cmd.receive.chest.RequestChestOpen;
import cmd.send.demo.battle.*;
import cmd.send.demo.chest.ResponseRequestChestOpen;
import cmd.send.demo.findmatch.ResponseFindMatch;
import controller.BattleController;
import controller.IDController;
import controller.MainController;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.Chest.Chest;
import model.Define.ModelDefine;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import service.ChestHandler;
import service.FindMatchHandler;
import util.server.ServerConstant;

import java.util.List;

public class BattleHandler extends BaseClientRequestHandler {
    public static final short BATTLE_MULTI_IDS = 10000;
    private final Logger logger = LoggerFactory.getLogger("BattleHandler");

    public BattleHandler() {
        super();
    }

    public void init() {
        getExtension().addEventListener(BZEventType.USER_DISCONNECT, this);
        getExtension().addEventListener(BZEventType.USER_RECONNECTION_SUCCESS, this);

        /**
         *  register new event, so the core will dispatch event type to this class
         */
        getExtension().addEventListener(DemoEventType.CHANGE_NAME, this);
    }

    private FresherExtension getExtension() {
        return (FresherExtension) getParentExtension();
    }

    public void handleServerEvent(IBZEvent ibzevent) {

        if (ibzevent.getType() == BZEventType.USER_DISCONNECT)
            this.userDisconnect((User) ibzevent.getParameter(BZEventParam.USER));
        else if (ibzevent.getType() == DemoEventType.CHANGE_NAME)
            this.userChangeName((User) ibzevent.getParameter(DemoEventParam.USER), (String) ibzevent.getParameter(DemoEventParam.NAME));
    }

    public void handleClientRequest(User user, DataCmd dataCmd) {
        BattleController battleController;
        try {
            switch (dataCmd.getId()) {

                case CmdDefine.PLACE_SPELL:
                    RequestPlaceSpell requestPlaceSpell = new RequestPlaceSpell(dataCmd);
                    battleController = PlaceSpellHandler.process(user, requestPlaceSpell);
                    //battleController.addBattleStatus();
                    send(new ResponsePlaceSpell(FindMatchHandler.FindMatchError.SUCCESS.getValue(), requestPlaceSpell.getTick(), requestPlaceSpell.getCardId(), requestPlaceSpell.getI(), requestPlaceSpell.getJ(),  battleController, battleController.isSwapUser(user.getId())), user);
                    User opponent = battleController.getOpponentUser(user.getId());
                    send(new ResponsePlaceOpponentSpell(FindMatchHandler.FindMatchError.SUCCESS.getValue(), requestPlaceSpell.getTick(), requestPlaceSpell.getCardId(), requestPlaceSpell.getI(), requestPlaceSpell.getJ(), battleController, battleController.isSwapUser(opponent.getId())), opponent);
                    break;

                case CmdDefine.PLACE_MONSTER:
                    RequestPlaceMonster requestPlaceMonster = new RequestPlaceMonster(dataCmd);
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestPlaceMonster(user, requestPlaceMonster, battleController);
                    break;

                case CmdDefine.GESTURE:
                    RequestGesture requestGesture = new RequestGesture(dataCmd);
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestGesture(user, requestGesture, battleController);
                    break;

                case CmdDefine.START_ROUND:
                    RequestStartRound requestStartRound = new RequestStartRound(dataCmd);
                    handleStartRound(user, requestStartRound);
                    break;
                case CmdDefine.END_MATCH:
                    RequestEndMatch requestEndMatch = new RequestEndMatch(dataCmd);
                    handleEndMatch(user, requestEndMatch);
                    break;
                case CmdDefine.PLACE_TOWER:
                    RequestPlaceTower requestPlaceTower = new RequestPlaceTower(dataCmd);
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestPlaceTower(user, requestPlaceTower,battleController);
                    break;
                case CmdDefine.DROP_TOWER:
                    RequestDropTower requestDropTower = new RequestDropTower(dataCmd);
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestDropTower(user, requestDropTower,battleController);
                    break;
                case CmdDefine.UPGRADE_TOWER:
                    RequestUpgradeTower requestUpgradeTower = new RequestUpgradeTower(dataCmd);
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestUpgradeTower(user, requestUpgradeTower,battleController);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }

    private void handleEndMatch(User user, RequestEndMatch requestEndMatch) {

        System.out.println("BattleHandler: EndMatch");

        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            int tick = requestEndMatch.getTick();
            battleController.update(tick);
            //battleController.addBattleStatus();
            System.out.println("END MATCH TICK: " + tick);
            short msg = FindMatchHandler.FindMatchError.ERROR.getValue();
            if(battleController.checkEndMatch()) {
                MainController.endMatch(user.getId());
                msg = FindMatchHandler.FindMatchError.SUCCESS.getValue();
            }
            User opponent = battleController.getOpponentUser(user.getId());
            int hp0 = battleController.getHpOfPlayer(user.getId());
            int hp1 = battleController.getHpOfPlayer(opponent.getId());

            ResponseEndMatch responseEndMatch1 = new ResponseEndMatch(msg, hp0, hp1,battleController,battleController.isSwapUser(user.getId())) ;
            send(responseEndMatch1, user);
            ResponseEndMatch responseEndMatch2 = new ResponseEndMatch(msg, hp1, hp0,battleController,battleController.isSwapUser(opponent.getId()));
            send(responseEndMatch2, opponent);

        }
    }

    private void handleStartRound(User user, RequestStartRound requestStartRound) {
        System.out.println("BattleHandler: StartRound");
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            int tick = requestStartRound.getTick();
            battleController.update(tick);
            if(true) {
                send(new ResponseStartRound(FindMatchHandler.FindMatchError.SUCCESS.getValue()), user);
                User opponent = battleController.getOpponentUser(user.getId());
                send(new ResponseStartOpponentRound(FindMatchHandler.FindMatchError.SUCCESS.getValue(), requestStartRound.getTick(), battleController, battleController.isSwapUser(opponent.getId())), opponent);
                battleController.startRound(tick);
                battleController.addBattleStatus();
            }
            else{
                send(new ResponseStartRound(FindMatchHandler.FindMatchError.ERROR.getValue()), user);
            }
        }
    }
    private void processRequestPlaceTower(User user, RequestPlaceTower requestPlaceTower,
                                          BattleController battleController) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponsePlaceTower(BattleHandler.BattleError.PLAYERINFO_NULL.getValue(),0,"",0,0
                        ,null,false), user);
            }
            else {
                int tick = requestPlaceTower.getTick();
                String cardId = requestPlaceTower.getCardId();
                int i = requestPlaceTower.getI();
                int j = requestPlaceTower.getJ();

                boolean equalRequest = battleController.placeTower(user.getId(),tick,cardId,i,j);
                if (equalRequest){
                    battleController.addBattleStatus();
                    ResponsePlaceTower responsePlaceTower = new ResponsePlaceTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                            battleController,battleController.isSwapUser(user.getId()));
                    send(responsePlaceTower, user);
                    User opponentUser = battleController.getOpponentUser(user.getId());
                    send(new ResponsePlaceOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                                    battleController,battleController.isSwapUser(opponentUser.getId())),
                            opponentUser);
                }
                else {
                    send(new ResponsePlaceTower(BattleHandler.BattleError.ERROR.getValue(), tick,cardId,i,j
                            ,battleController,battleController.isSwapUser(user.getId())), user);
                }
            }

        } catch (Exception e) {
            send(new ResponsePlaceTower(BattleHandler.BattleError.EXCEPTION.getValue(),0,"",0,0
                    ,null,false), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestPlaceMonster(User user, RequestPlaceMonster requestPlaceMonster, BattleController battleController) {
        try {
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponsePlaceMonster(BattleHandler.BattleError.PLAYERINFO_NULL.getValue(),0,""), user);
            }
            else {
                int tick = requestPlaceMonster.getTick();
                String cardId = requestPlaceMonster.getCardId();
                if(!battleController.placeMonster(user.getId(), cardId, tick)) {
                    send(new ResponsePlaceMonster(BattleError.ERROR.getValue(), tick,cardId), user);
                }
                else {
                    send(new ResponsePlaceMonster(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId), user);
                    User opponentUser = battleController.getOpponentUser(user.getId());
                    send(new ResponsePlaceOpponentMonster(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId, battleController,
                            battleController.isSwapUser(opponentUser.getId())), opponentUser);
                }


//                boolean equalRequest = battleController.placeTower(user.getId(),cardId,i,j);
//                if (equalRequest){
//                    send(new ResponsePlaceTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j), user);
//                    User opponentUser = battleController.getOpponentUser(user.getId());
//                    send(new ResponsePlaceOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j),
//                            opponentUser);
//                }
//                else {
//                    send(new ResponsePlaceTower(BattleHandler.BattleError.ERROR.getValue(), tick,cardId,i,j), user);
//                }
            }

        } catch (Exception e) {
            send(new ResponsePlaceMonster(BattleHandler.BattleError.EXCEPTION.getValue(),0,""), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestGesture(User user, RequestGesture requestGesture, BattleController battleController) {
        try {
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseGesture(BattleHandler.BattleError.PLAYERINFO_NULL.getValue(),0,""), user);
            }
            else {
                int tick = requestGesture.getTick();
                String monsterId = requestGesture.getMonsterId();
                if(!battleController.makeGesture(user.getId(), monsterId, tick)) {
                    send(new ResponseGesture(BattleError.ERROR.getValue(), tick,monsterId), user);
                }
                else {
                    send(new ResponseGesture(BattleHandler.BattleError.SUCCESS.getValue(), tick,monsterId), user);
                    User opponentUser = battleController.getOpponentUser(user.getId());
                    send(new ResponseOpponentGesture(BattleHandler.BattleError.SUCCESS.getValue(), tick,monsterId, battleController,
                            battleController.isSwapUser(opponentUser.getId())), opponentUser);
                }
            }

        } catch (Exception e) {
            send(new ResponsePlaceMonster(BattleHandler.BattleError.EXCEPTION.getValue(),0,""), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestDropTower(User user, RequestDropTower requestDropTower,
                                          BattleController battleController) {
        try {

            //System.out.println("Drop Tower " + this.d);
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseDropTower(BattleHandler.BattleError.PLAYERINFO_NULL.getValue(),0,0,0 ,null,false), user);
            }
            else {
                int tick = requestDropTower.getTick();
                int i = requestDropTower.getI();
                int j = requestDropTower.getJ();
                boolean equalRequest = battleController.dropTower(user.getId(),tick,i,j);
                if (equalRequest){
                    battleController.addBattleStatus();
                    ResponseDropTower responseDropTower = new ResponseDropTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,i,j,
                            battleController,battleController.isSwapUser(user.getId()));
                    send(responseDropTower, user);
                    User opponentUser = battleController.getOpponentUser(user.getId());
                    ResponseDropOpponentTower responseDropOpponentTower = new ResponseDropOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,i,j,
                            battleController,battleController.isSwapUser(opponentUser.getId()));
                    send(responseDropOpponentTower, opponentUser);

                }
                else {
                    send(new ResponseDropTower(BattleHandler.BattleError.ERROR.getValue(), tick,i,j,
                            battleController,battleController.isSwapUser(user.getId())), user);
                }
            }

        } catch (Exception e) {
            send(new ResponseDropTower(BattleHandler.BattleError.EXCEPTION.getValue(),0,0,0 ,null,false), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestUpgradeTower(User user, RequestUpgradeTower requestUpgradeTower,
                                          BattleController battleController) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseUpgradeTower(BattleHandler.BattleError.PLAYERINFO_NULL.getValue(),0,"",0,0,
                        null,false ), user);
            }
            else {
                int tick = requestUpgradeTower.getTick();
                String cardId = requestUpgradeTower.getCardId();
                int i = requestUpgradeTower.getI();
                int j = requestUpgradeTower.getJ();

                boolean equalRequest = battleController.upgradeTower(user.getId(),tick,cardId,i,j);
                if (equalRequest){
                    battleController.addBattleStatus();
                    send(new ResponseUpgradeTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                            battleController,battleController.isSwapUser(user.getId())), user);
                    User opponentUser = battleController.getOpponentUser(user.getId());
                    send(new ResponseUpgradeOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                                    battleController,battleController.isSwapUser(opponentUser.getId())),opponentUser);
                }
                else {
                    send(new ResponseUpgradeTower(BattleHandler.BattleError.ERROR.getValue(), tick,cardId,i,j,
                            battleController,battleController.isSwapUser(user.getId())), user);
                }
            }

        } catch (Exception e) {
            send(new ResponseUpgradeTower(BattleHandler.BattleError.EXCEPTION.getValue(),0,"",0,0 ,
                    null,false), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    public static void sendReward(int trophy, Chest chest, User user){
        ResponseBattleReward responseBattleReward = new ResponseBattleReward(BattleError.SUCCESS.getValue(),trophy,chest);
        ExtensionUtility.instance().send(responseBattleReward,user);
    }

    private void userDisconnect(User user) {
        // log user disconnect
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if (battleController != null) {
            /*int tick = ModelDefine.TICK_PER_SECOND * 20 * 20;
            battleController.update(tick);
            short msg = FindMatchHandler.FindMatchError.ERROR.getValue();
            if (battleController.checkEndMatch()) {
                MainController.endMatch(user.getId());
                msg = FindMatchHandler.FindMatchError.SUCCESS.getValue();
            }
            User opponent = battleController.getOpponentUser(user.getId());
            //send(new ResponseEndMatch(msg), opponent);

            int hp1 = battleController.getHpOfPlayer(opponent.getId());
            //send(new ResponseEndMatch(msg, hp0, hp1), user);*/
            User opponent = battleController.getOpponentUser(user.getId());
            int hp1 = battleController.getHpOfPlayer(opponent.getId());
            send(new ResponseEndMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue(), hp1, 0,battleController,battleController.isSwapUser(user.getId())), opponent);
        }

    }

    private void userChangeName(User user, String name) {
        List<User> allUser = BitZeroServer.getInstance().getUserManager().getAllUsers();
        for (User aUser : allUser) {
            // notify user's change
        }
    }
    public enum BattleError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private BattleError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }
}
