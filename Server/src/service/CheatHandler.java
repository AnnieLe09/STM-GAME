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
import cmd.error_Default_Value.Error_ID;
import cmd.error_Default_Value.Error_array;
import cmd.error_Default_Value.Error_negative;
import cmd.receive.cheat.*;
import cmd.send.demo.cheat.*;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.Cheat.Cheat;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.List;

public class CheatHandler extends BaseClientRequestHandler {
    public static final short CHEAT_MULTI_IDS = 6000;
    private final Logger logger = LoggerFactory.getLogger("CheatHandler");

    public CheatHandler() {
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

                case CmdDefine.CHEAT_UP_G:
                    RequestCheatUpG requestCheatUpG = new RequestCheatUpG(dataCmd);
                    processRequestCheatUpG(user, requestCheatUpG);
                    break;
                case CmdDefine.CHEAT_UP_GOLD:
                    RequestCheatUpGold requestCheatUpGold = new RequestCheatUpGold(dataCmd);
                    processRequestCheatUpGold(user, requestCheatUpGold);
                    break;
                case CmdDefine.CHEAT_UP_TROPHY:
                    RequestCheatUpTrophy requestCheatUpTrophy = new RequestCheatUpTrophy(dataCmd);
                    processRequestCheatUpTrophy(user, requestCheatUpTrophy);
                    break;
                case CmdDefine.CHEAT_UP_EXP_CARD:
                    RequestCheatUpExpCard requestCheatUpExpCard = new RequestCheatUpExpCard(dataCmd);
                    processRequestCheatUpExpCard(user, requestCheatUpExpCard);
                    break;
                case CmdDefine.CHEAT_UP_LEVEL_CARD:
                    RequestCheatUpLevelCard requestCheatUpLevelCard = new RequestCheatUpLevelCard(dataCmd);
                    processRequestCheatUpLevelCard(user, requestCheatUpLevelCard);
                    break;
                case CmdDefine.CHEAT_UP_LOBBY_CHEST:
                    RequestCheatUpLobbyChest requestCheatUpLobbyChest = new RequestCheatUpLobbyChest(dataCmd);
                    processRequestCheatUpLobbyChest(user, requestCheatUpLobbyChest);
                    break;
                case CmdDefine.CHEAT_REDUCE_LOBBY_CHEST_TIME_REMAINING:
                    RequestCheatReduceLobbyChestTime requestCheatReduceLobbyChestTime = new RequestCheatReduceLobbyChestTime(dataCmd);
                    processRequestCheatReduceLobbyChestTime(user, requestCheatReduceLobbyChestTime);
                    break;
                case CmdDefine.CHEAT_REDUCE_ALL_LOBBY_CHEST_TIME_REMAINING:
                    RequestCheatReduceAllLobbyChestTime requestCheatReduceAllLobbyChestTime = new RequestCheatReduceAllLobbyChestTime(dataCmd);
                    processRequestCheatReduceAllLobbyChestTime(user, requestCheatReduceAllLobbyChestTime);
                    break;




                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }

    private void processRequestCheatUpG(User user, RequestCheatUpG requestCheatUpG) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpG(CheatError.PLAYERINFO_NULL.getValue(), Error_negative.error_negative), user);
            }
            else {
                int g = requestCheatUpG.getG();
                int equalRequest = Cheat.upG(userInfo,g);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpG(CheatError.SUCCESS.getValue(), equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatUpG(CheatError.ERROR.getValue(), equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpG(CheatError.EXCEPTION.getValue(), Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatUpGold(User user, RequestCheatUpGold requestCheatUpGold) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpGold(CheatError.PLAYERINFO_NULL.getValue(), Error_negative.error_negative), user);
            }
            else {
                int gold = requestCheatUpGold.getGold();
                int equalRequest = Cheat.upGold(userInfo,gold);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpGold(CheatError.SUCCESS.getValue(), equalRequest), user);

                }
                else {
                    send(new ResponseRequestCheatUpGold(CheatError.ERROR.getValue(), equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpGold(CheatError.EXCEPTION.getValue(), Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatUpTrophy(User user, RequestCheatUpTrophy requestCheatUpTrophy) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpTrophy(CheatError.PLAYERINFO_NULL.getValue(), Error_negative.error_negative), user);
            }
            else {
                int trophy= requestCheatUpTrophy.getTrophy();
                int equalRequest = Cheat.upTrophy(userInfo,trophy);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpTrophy(CheatError.SUCCESS.getValue(), equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatUpTrophy(CheatError.ERROR.getValue(), equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpTrophy(CheatError.EXCEPTION.getValue(), Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatUpExpCard(User user, RequestCheatUpExpCard requestCheatUpExpCard){
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpExpCard(CheatError.PLAYERINFO_NULL.getValue(),
                        Error_ID.error_ID, Error_negative.error_negative), user);
            }
            else {
                int id = requestCheatUpExpCard.getId();
                int exp= requestCheatUpExpCard.getExp();
                int equalRequest = Cheat.upExpCard(userInfo,id,exp);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpExpCard(CheatError.SUCCESS.getValue(), id,equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatUpExpCard(CheatError.ERROR.getValue(),id, equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpExpCard(CheatError.EXCEPTION.getValue(),
                    Error_ID.error_ID, Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatUpLevelCard(User user, RequestCheatUpLevelCard requestCheatUpLevelCard){
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpLevelCard(CheatError.PLAYERINFO_NULL.getValue(),
                        Error_ID.error_ID, Error_negative.error_negative), user);
            }
            else {
                int id = requestCheatUpLevelCard.getId();
                int level= requestCheatUpLevelCard.getLevel();
                int equalRequest = Cheat.upLevelCard(userInfo,id,level);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpLevelCard(CheatError.SUCCESS.getValue(), id,equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatUpLevelCard(CheatError.ERROR.getValue(),id, equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpLevelCard(CheatError.EXCEPTION.getValue(),
                    Error_ID.error_ID, Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatUpLobbyChest(User user, RequestCheatUpLobbyChest requestCheatUpLobbyChest){
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatUpLobbyChest(CheatError.PLAYERINFO_NULL.getValue(),
                        null), user);
            }
            else {

                int equalRequest = Cheat.upLobbyChest(userInfo);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatUpLobbyChest(CheatError.SUCCESS.getValue(),
                            userInfo.getChestController().getChest(equalRequest)), user);
                }
                else {
                    send(new ResponseRequestCheatUpLobbyChest(CheatError.ERROR.getValue(), null), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatUpLobbyChest(CheatError.EXCEPTION.getValue(),
                    null), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatReduceLobbyChestTime(User user, RequestCheatReduceLobbyChestTime requestCheatReduceLobbyChestTime){
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatReduceLobbyChestTime(CheatError.PLAYERINFO_NULL.getValue(),
                        Error_ID.error_ID,Error_negative.error_negative), user);
            }
            else {
                int id = requestCheatReduceLobbyChestTime.getId();
                int time = requestCheatReduceLobbyChestTime.getTime();
                int equalRequest = Cheat.reduceLobbyChestTime(userInfo,id,time);
                if (equalRequest >= 0){
                    send(new ResponseRequestCheatReduceLobbyChestTime(CheatError.SUCCESS.getValue(),id, equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatReduceLobbyChestTime(CheatError.ERROR.getValue(),id, equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatReduceLobbyChestTime(CheatError.EXCEPTION.getValue(),
                    Error_ID.error_ID,Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestCheatReduceAllLobbyChestTime(User user, RequestCheatReduceAllLobbyChestTime requestCheatReduceAllLobbyChestTime){
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestCheatReduceAllLobbyChestTime(CheatError.PLAYERINFO_NULL.getValue(),
                        Error_array.error_array), user);
            }
            else {
                int time = requestCheatReduceAllLobbyChestTime.getTime();
                int[] equalRequest = Cheat.reduceAllLobbyChestTime(userInfo,time);
                if (equalRequest.length > 0){
                    send(new ResponseRequestCheatReduceAllLobbyChestTime(CheatError.SUCCESS.getValue(), equalRequest), user);
                }
                else {
                    send(new ResponseRequestCheatReduceAllLobbyChestTime(CheatError.ERROR.getValue(), equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestCheatReduceAllLobbyChestTime(CheatError.EXCEPTION.getValue(),
                    Error_array.error_array), user);
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
    public enum CheatError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private CheatError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }

}
