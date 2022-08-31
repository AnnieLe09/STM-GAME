package service;

import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;
import cmd.error_Default_Value.Error_ID;
import cmd.error_Default_Value.Error_g;
import cmd.receive.chest.RequestChestOpen;
import cmd.receive.chest.RequestChestReceive;
import cmd.receive.chest.RequestChestReceiveNow;
import cmd.receive.chest.RequestLobbyChestInfo;
import cmd.send.demo.chest.ResponseRequestChestOpen;
import cmd.send.demo.chest.ResponseRequestChestReceive;
import cmd.send.demo.chest.ResponseRequestChestReceiveNow;
import cmd.send.demo.chest.ResponseRequestLobbyChestInfo;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.Chest.ChestController;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.List;

public class ChestHandler extends BaseClientRequestHandler {
    public static final short CHEST_MULTI_IDS = 3000;
    private final Logger logger = LoggerFactory.getLogger("ChestHandler");

    public ChestHandler() {
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
        try {
            switch (dataCmd.getId()) {

                case CmdDefine.GET_LOBBY_CHEST_INFO:
                    RequestLobbyChestInfo requestLobbyChestInfo = new RequestLobbyChestInfo(dataCmd);
                    processRequestLobbyChestInfo(user, requestLobbyChestInfo);
                    break;
                case CmdDefine.CHEST_OPEN:
                    RequestChestOpen requestChestOpen = new RequestChestOpen(dataCmd);
                    processRequestChestOpen(user, requestChestOpen);
                    break;
                case CmdDefine.CHEST_RECEIVE:
                    RequestChestReceive requestChestReceive = new RequestChestReceive(dataCmd);
                    processRequestChestReceive(user, requestChestReceive);
                    break;
                case CmdDefine.CHEST_RECEIVE_NOW:
                    RequestChestReceiveNow requestChestReceiveNow = new RequestChestReceiveNow(dataCmd);
                    processRequestChestReceiveNow(user, requestChestReceiveNow);
                    break;

                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }


    private void processRequestChestOpen(User user, RequestChestOpen requestChestOpen) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestChestOpen(ChestHandler.ChestError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID), user);
            }
            else {
                int id = requestChestOpen.getID(); //
                boolean equalRequest = userInfo.getChestController().openChest(id);
                if (equalRequest){
                    send(new ResponseRequestChestOpen(ChestError.SUCCESS.getValue(), id), user);
                }
                else {
                    send(new ResponseRequestChestOpen(ChestError.ERROR.getValue(), id), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestChestOpen(ChestError.EXCEPTION.getValue(), requestChestOpen.getID()), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestChestReceive(User user, RequestChestReceive requestChestReceive) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestChestReceive(ChestError.PLAYERINFO_NULL.getValue(),Error_ID.error_ID), user);
            }
            else {
                int id = requestChestReceive.getID(); //
                boolean equalRequest = userInfo.getChestController().receiveChest(userInfo,id);
                if (equalRequest){
                    send(new ResponseRequestChestReceive(ChestError.SUCCESS.getValue(),id), user);
                }
                else {
                    send(new ResponseRequestChestReceive(ChestError.ERROR.getValue(),id), user);
                }
                userInfo.saveModel(user.getId());

            }

        } catch (Exception e) {
            send(new ResponseRequestChestReceive(ChestError.EXCEPTION.getValue(), requestChestReceive.getID()), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestChestReceiveNow(User user, RequestChestReceiveNow requestChestReceiveNow) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestChestReceiveNow(ChestError.PLAYERINFO_NULL.getValue(),Error_ID.error_ID, Error_g.error_g), user);
            }
            else {
                int id = requestChestReceiveNow.getID(); //
                int g = requestChestReceiveNow.getG();
                boolean equalRequest = userInfo.getChestController().receiveChestNow(userInfo,id,g);
                if (equalRequest){
                    send(new ResponseRequestChestReceiveNow(ChestError.SUCCESS.getValue(),id,g), user);
                }
                else {
                    send(new ResponseRequestChestReceiveNow(ChestError.ERROR.getValue(),id,g), user);
                }
                userInfo.saveModel(user.getId());

            }

        } catch (Exception e) {
            send(new ResponseRequestChestReceiveNow(ChestError.EXCEPTION.getValue(),requestChestReceiveNow.getID(), requestChestReceiveNow.getG()), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestLobbyChestInfo(User user, RequestLobbyChestInfo requestChestInfo) {
        try {
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestLobbyChestInfo(ChestError.PLAYERINFO_NULL.getValue(),new ChestController()), user);
            }
            else {
                userInfo.getChestController().updateTimeRemainingOfLobbyChest();
                userInfo.saveModel(user.getId());
                send(new ResponseRequestLobbyChestInfo(ChestError.SUCCESS.getValue(), userInfo.getChestController()), user);
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            send(new ResponseRequestLobbyChestInfo(ChestError.EXCEPTION.getValue(), userInfo.getChestController()), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
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
    public enum ChestError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private ChestError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }

}
