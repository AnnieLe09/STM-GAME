package service.server;

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
import cmd.receive.battle_server.RequestStartBattle;
import cmd.receive.findmatch.RequestCancelFindMatch;
import cmd.receive.findmatch.RequestFindMatch;
import cmd.requestServer.*;
import cmd.send.demo.battle.*;
import cmd.send.demo.findmatch.ResponseCancelFindMatch;
import cmd.send.demo.findmatch.ResponseFindMatch;
import controller.BattleController;
import controller.IDController;
import controller.MainController;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.Battle.Player;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import service.FindMatchHandler;
import service.battle.BattleHandler;
import service.battle.PlaceSpellHandler;
import util.server.ServerConstant;

import java.util.List;

public class BattleServerHandler extends BaseClientRequestHandler {
    public static final short BATTLE_SERVER_MULTI_IDS = 11000;
    private final Logger logger = LoggerFactory.getLogger("FindMatchHandler");
    public static final Logger logger1 = LoggerFactory.getLogger("FindMatchHandler");
    public BattleServerHandler() {

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

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        try {
            switch (dataCmd.getId()) {

                case CmdDefine.START_BATTLE:
                    RequestStartBattle requestStartBattle = new RequestStartBattle(dataCmd);
                    processRequestStartBattle(user, requestStartBattle);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestStartBattle(User user, RequestStartBattle requestStartBattle) {
        BattleController battleController = MainController.findBattleByUser(user.getId());
        battleController.addBattleServerHandler(this);
    }


    private void userDisconnect(User user) {
        // log user disconnect
    }

    private void userChangeName(User user, String name) {
        List<User> allUser = BitZeroServer.getInstance().getUserManager().getAllUsers();
        for (User aUser : allUser) {
            // notify user's change
        }
    }

    //------------------------------Server with Bot -----------------------------------------------

    public static int handleServerRequest(User user, RequestServer requestServer) {
        BattleController battleController;
        battleController = MainController.findBattleByUser(user.getId());
        try {
            switch (requestServer.getId()) {
                case CmdDefine.PLACE_TOWER:
                    battleController = MainController.findBattleByUser(user.getId());
                    RequestServerPlaceTower requestServerPlaceTower = (RequestServerPlaceTower) requestServer;
                    return processRequestPlaceTower(user, requestServerPlaceTower,battleController);
                case CmdDefine.DROP_TOWER:
                    RequestServerDropTower requestServerDropTower = (RequestServerDropTower) requestServer;
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestDropTower(user, requestServerDropTower,battleController);
                    break;
                case CmdDefine.UPGRADE_TOWER:
                    RequestServerUpgradeTower requestServerUpgradeTower = (RequestServerUpgradeTower) requestServer;
                    battleController = MainController.findBattleByUser(user.getId());
                    processRequestUpgradeTower(user, requestServerUpgradeTower,battleController);
                    break;
                case CmdDefine.PLACE_SPELL:
                    //battleController = MainController.findBattleByUser(user.getId());
                    RequestServerPlaceSpell requestServerPlaceSpell = (RequestServerPlaceSpell) requestServer;
                    battleController = PlaceSpellHandler.process(user, requestServerPlaceSpell);
                    //battleController.addBattleStatus();
                    User opponent = battleController.getOpponentUser(user.getId());
                    ExtensionUtility.instance().send(new ResponsePlaceOpponentSpell(FindMatchHandler.FindMatchError.SUCCESS.getValue(),
                            requestServerPlaceSpell.getTick(), requestServerPlaceSpell.getCardId(),
                            requestServerPlaceSpell.getI(), requestServerPlaceSpell.getJ(),
                            battleController, battleController.isSwapUser(opponent.getId())), opponent);
                    return FindMatchHandler.FindMatchError.SUCCESS.getValue();
                case CmdDefine.START_ROUND:
                    RequestServerStartRound requestserverStartRound = (RequestServerStartRound) requestServer;
                    handleStartRound(user, requestserverStartRound);
                    break;
                case CmdDefine.END_MATCH:
                    RequestServerEndMatch requestServerEndMatch = (RequestServerEndMatch) requestServer;
                    handleEndMatch(user, requestServerEndMatch);
                    break;

                case CmdDefine.PLACE_MONSTER:
                    battleController = MainController.findBattleByUser(user.getId());
                    RequestServerPlaceMonster requestServerPlaceMonster = (RequestServerPlaceMonster) requestServer;
                    return processRequestPlaceMonster(user, requestServerPlaceMonster, battleController);
                default:
                    break;
            }
        } catch (Exception e) {
            logger1.warn("BATTLESERVERHANDLER EXCEPTION " + e.getMessage());
            logger1.warn(ExceptionUtils.getStackTrace(e));
        }

        return BattleHandler.BattleError.PLAYERINFO_NULL.getValue();
    }
    public static int handleEndMatch(User user, RequestServerEndMatch requestServerEndMatch) {
        System.out.println("BattleServerHandler: EndMatch");
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            int tick = requestServerEndMatch.getTick();
            battleController.update(tick);
            short msg = FindMatchHandler.FindMatchError.ERROR.getValue();
            if(battleController.checkEndMatch()) {
                MainController.endMatch(user.getId());
                msg = FindMatchHandler.FindMatchError.SUCCESS.getValue();
            }
            User opponent = battleController.getOpponentUser(user.getId());
            //send(new ResponseEndMatch(msg), opponent);

            int hp0 = battleController.getHpOfPlayer(user.getId());
            int hp1 = battleController.getHpOfPlayer(opponent.getId());
            ExtensionUtility.instance().send(new ResponseEndMatch(msg, hp1, hp0,battleController,battleController.isSwapUser(user.getId())), opponent);
            return msg;
        }
        return BattleServerError.PLAYERINFO_NULL.getValue();
    }

    public static int handleStartRound(User user, RequestServerStartRound requestServerStartRound) {
        System.out.println("BattleHandler: StartRound");
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            int tick = requestServerStartRound.getTick();
            battleController.update(tick);
            if(true) {
                User opponent = battleController.getOpponentUser(user.getId());
                ExtensionUtility.instance().send(new ResponseStartOpponentRound(FindMatchHandler.FindMatchError.SUCCESS.getValue(),
                        requestServerStartRound.getTick(), battleController, battleController.isSwapUser(opponent.getId())), opponent);
                battleController.startRound(tick);
                battleController.addBattleStatus();
                return BattleServerError.SUCCESS.getValue();
            }
            else{
                return BattleServerError.ERROR.getValue();
            }
        }
        return BattleServerError.PLAYERINFO_NULL.getValue();
    }

    public static int processRequestDropTower(User user, RequestServerDropTower requestserverDropTower,
                                         BattleController battleController) {
        try {
            int tick = requestserverDropTower.getTick();
            int i = requestserverDropTower.getI();
            int j = requestserverDropTower.getJ();

            boolean equalRequest = battleController.dropTower(user.getId(),tick,i,j);
            if (equalRequest){
                battleController.addBattleStatus();
                User opponentUser = battleController.getOpponentUser(user.getId());
                ExtensionUtility.instance().send(new ResponseDropOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,i,j,
                                battleController,battleController.isSwapUser(opponentUser.getId())),
                        opponentUser);
                return BattleServerError.SUCCESS.getValue();
            }
            else {
                return BattleServerError.ERROR.getValue();
            }

        } catch (Exception e) {
            logger1.info(ExceptionUtils.getStackTrace(e));
            return BattleServerError.EXCEPTION.getValue();
        }
    }

    public static int processRequestUpgradeTower(User user, RequestServerUpgradeTower requestServerUpgradeTower,
                                            BattleController battleController) {
        try {
            int tick = requestServerUpgradeTower.getTick();
            String cardId = requestServerUpgradeTower.getCardId();
            int i = requestServerUpgradeTower.getI();
            int j = requestServerUpgradeTower.getJ();

            boolean equalRequest = battleController.upgradeTower(user.getId(),tick,cardId,i,j);
            if (equalRequest){
                battleController.addBattleStatus();
                User opponentUser = battleController.getOpponentUser(user.getId());
                ExtensionUtility.instance().send(new ResponseUpgradeOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                        battleController,battleController.isSwapUser(opponentUser.getId())),opponentUser);
                return BattleServerError.SUCCESS.getValue();
            }
            else {
                return BattleServerError.ERROR.getValue();
            }

        } catch (Exception e) {
            logger1.info(ExceptionUtils.getStackTrace(e));
            return BattleServerError.EXCEPTION.getValue();
        }
    }

    public static int processRequestPlaceTower(User user, RequestServerPlaceTower requestServerPlaceTower,
                                         BattleController battleController) {
        try {
            int tick = requestServerPlaceTower.getTick();
            String cardId = requestServerPlaceTower.getCardId();
            int i = requestServerPlaceTower.getI();
            int j = requestServerPlaceTower.getJ();

            boolean equalRequest = battleController.placeTower(user.getId(),tick,cardId,i,j);
            if (equalRequest){
                battleController.addBattleStatus();
                User opponentUser = battleController.getOpponentUser(user.getId());
                ExtensionUtility.instance().send(new ResponsePlaceOpponentTower(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId,i,j,
                                battleController,battleController.isSwapUser(opponentUser.getId())),
                        opponentUser);
                return BattleHandler.BattleError.SUCCESS.getValue();
            }
            else {
                return BattleHandler.BattleError.ERROR.getValue();
            }

        } catch (Exception e) {
            logger1.info(ExceptionUtils.getStackTrace(e));
            return BattleHandler.BattleError.EXCEPTION.getValue();
        }
    }
    public static int processRequestPlaceMonster(User user, RequestServerPlaceMonster requestServerPlaceMonster, BattleController battleController) {
        try {
            int tick = requestServerPlaceMonster.getTick();
            String cardId = requestServerPlaceMonster.getCardId();
            if(!battleController.placeMonster(user.getId(), cardId, tick)) {
                return BattleHandler.BattleError.ERROR.getValue();
            }
            else {
                User opponentUser = battleController.getOpponentUser(user.getId());
                ExtensionUtility.instance().send(new ResponsePlaceOpponentMonster(BattleHandler.BattleError.SUCCESS.getValue(), tick,cardId, battleController,
                        battleController.isSwapUser(opponentUser.getId())), opponentUser);
                return BattleHandler.BattleError.SUCCESS.getValue();
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

        } catch (Exception e) {
            ExtensionUtility.instance().send(new ResponsePlaceMonster(BattleHandler.BattleError.EXCEPTION.getValue(),0,""), user);
            logger1.info(ExceptionUtils.getStackTrace(e));
            return BattleHandler.BattleError.EXCEPTION.getValue();
        }
    }




    public enum BattleServerError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private BattleServerError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }
}
