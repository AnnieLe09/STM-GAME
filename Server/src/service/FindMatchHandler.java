package service;

import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.ExtensionUtility;
import cmd.CmdDefine;
import cmd.receive.findmatch.RequestCancelFindMatch;
import cmd.receive.findmatch.RequestFindMatch;
import cmd.send.demo.findmatch.ResponseCancelFindMatch;
import cmd.send.demo.findmatch.ResponseFindMatch;
import controller.BattleController;
import controller.IDController;
import controller.MainController;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.Battle.Player;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import service.battle.PlaceSpellHandler;

import java.util.List;

public class FindMatchHandler extends BaseClientRequestHandler {
    public static final short FIND_MATCH_MULTI_IDS = 9000;
    private final Logger logger = LoggerFactory.getLogger("FindMatchHandler");
    public FindMatchHandler() {
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

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        try {
            switch (dataCmd.getId()) {

                case CmdDefine.FIND_MATCH:
                    RequestFindMatch requestFindMatch = new RequestFindMatch(dataCmd);
                    processRequestFindMatch(user, requestFindMatch);
                    break;
                case CmdDefine.CANCEL_FIND_MATCH:
                    RequestCancelFindMatch requestCancelFindMatch = new RequestCancelFindMatch(dataCmd);
                    processRequestCancelFindMatch(user, requestCancelFindMatch);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestCancelFindMatch(User user, RequestCancelFindMatch requestCancelFindMatch) {
        System.out.println("CancelFindMatchHandler: Call MainController to cancel find match");
        if(MainController.cancelFindMatch(user.getId())){
            send(new ResponseCancelFindMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue()), user);
        }
        else{
            send(new ResponseCancelFindMatch(FindMatchHandler.FindMatchError.ERROR.getValue()), user);
        }
    }

    private void processRequestFindMatch(User user, RequestFindMatch requestFindMatch) {
        System.out.println("FindMatchHandler: Call MainController to find match");
        BattleController battleController = MainController.findMatch(user.getId());
        if(battleController == null) return;
        Player[] players = battleController.getPlayers();
        //battleController.addBattleStatus();
        if(battleController.getCurTick() <= 0){
            send(new ResponseFindMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue(), battleController, false), IDController.getUserByPlayer(players[0]));
            send(new ResponseFindMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue(), battleController, true), IDController.getUserByPlayer(players[1]));
        }
        else{
            send(new ResponseFindMatch(FindMatchHandler.FindMatchError.ERROR.getValue(), battleController, battleController.isSwapUser(user.getId())), user);
        }

    }
    public static void sendFindMatch(BattleController battleController){
        Player[] players = battleController.getPlayers();
        ExtensionUtility.instance().send(new ResponseFindMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue(), battleController, false), IDController.getUserByPlayer(players[0]));
        ExtensionUtility.instance().send(new ResponseFindMatch(FindMatchHandler.FindMatchError.SUCCESS.getValue(), battleController, true), IDController.getUserByPlayer(players[1]));
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
    public enum FindMatchError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private FindMatchError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }
}
