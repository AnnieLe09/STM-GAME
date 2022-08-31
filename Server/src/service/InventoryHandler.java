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
import cmd.error_Default_Value.Error_negative;
import cmd.receive.Inventory.RequestInventoryChangeCard;
import cmd.receive.Inventory.RequestInventoryInfo;
import cmd.receive.Inventory.RequestInventoryUpExpCard;
import cmd.receive.Inventory.RequestInventoryUpLevelCard;
import cmd.send.demo.inventory.ResponseRequestInventoryChangeCard;
import cmd.send.demo.inventory.ResponseRequestInventoryInfo;
import cmd.send.demo.inventory.ResponseRequestInventoryUpExpCard;
import cmd.send.demo.inventory.ResponseRequestInventoryUpLevelCard;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.List;

public class InventoryHandler extends BaseClientRequestHandler {
    public static final short INVENTORY_MULTI_IDS = 5000;
    private final Logger logger = LoggerFactory.getLogger("InventoryHandler");

    public InventoryHandler() {
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

                case CmdDefine.GET_INVENTORY_INFO:
                    RequestInventoryInfo requestInventoryInfo = new RequestInventoryInfo(dataCmd);
                    processRequestInventoryInfo(user, requestInventoryInfo);
                    break;
                case CmdDefine.INVENTORY_CHANGE_CARD:
                    RequestInventoryChangeCard requestInventoryChangeCard = new RequestInventoryChangeCard(dataCmd);
                    processRequestChangeCard(user, requestInventoryChangeCard);
                    break;
                case CmdDefine.INVENTORY_UP_EXP_CARD:
                    RequestInventoryUpExpCard requestInventoryUpExpCard = new RequestInventoryUpExpCard(dataCmd);
                    processRequestUpExpCard(user, requestInventoryUpExpCard);
                    break;
                case CmdDefine.INVENTORY_UP_LEVEL_CARD:
                    RequestInventoryUpLevelCard requestInventoryUpLevelCard = new RequestInventoryUpLevelCard(dataCmd);
                    processRequestUpLevelCard(user, requestInventoryUpLevelCard);
                    break;

                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }



    private void processRequestInventoryInfo(User user, RequestInventoryInfo requestInventoryInfo) {
        try {
            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestInventoryInfo(InventoryError.PLAYERINFO_NULL.getValue(),null), user);
            }
            send(new ResponseRequestInventoryInfo(InventoryError.SUCCESS.getValue(),userInfo.getInventory()), user);
            userInfo.saveModel(user.getId());
        } catch (Exception e) {
            send(new ResponseRequestInventoryInfo(InventoryError.EXCEPTION.getValue(),null), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestChangeCard(User user, RequestInventoryChangeCard requestChangeCard) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestInventoryChangeCard(InventoryError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID,Error_ID.error_ID), user);
            }
            else {
                int collectionCardID = requestChangeCard.getCollectionCardID(); //
                int chosenCardID = requestChangeCard.getChosenCardID();
                boolean equalRequest = userInfo.getInventory().changeCard(collectionCardID,chosenCardID);
                if (equalRequest){
                    send(new ResponseRequestInventoryChangeCard(InventoryError.SUCCESS.getValue(), chosenCardID,collectionCardID), user);
                }
                else {
                    send(new ResponseRequestInventoryChangeCard(InventoryError.ERROR.getValue(), chosenCardID,collectionCardID), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            int collectionCardID = requestChangeCard.getCollectionCardID(); //
            int chosenCardID = requestChangeCard.getChosenCardID();
            send(new ResponseRequestInventoryChangeCard(InventoryError.EXCEPTION.getValue(), chosenCardID,collectionCardID), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }

    private void processRequestUpExpCard(User user, RequestInventoryUpExpCard requestUpExpCard) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestInventoryUpExpCard(InventoryError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID, Error_negative.error_negative), user);
            }
            else {
                int id = requestUpExpCard.getId();
                int exp = requestUpExpCard.getExp();
                int equalRequest = userInfo.getInventory().upExpCard(id,exp);
                if (equalRequest >= 0){
                    send(new ResponseRequestInventoryUpExpCard(InventoryError.SUCCESS.getValue(), id,equalRequest), user);
                }
                else {
                    send(new ResponseRequestInventoryUpExpCard(InventoryError.ERROR.getValue(), id,equalRequest), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestInventoryUpExpCard(InventoryError.EXCEPTION.getValue(), Error_ID.error_ID, Error_negative.error_negative), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestUpLevelCard(User user, RequestInventoryUpLevelCard requestUpLevelCard) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestInventoryUpLevelCard(InventoryError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID, Error_negative.error_negative, Error_negative.error_negative), user);
            }
            else {
                int id = requestUpLevelCard.getId();
                int equalRequest = userInfo.getInventory().upLevelCard(userInfo,id);
                int exp = userInfo.getInventory().getCard(id).getExp();
                if (equalRequest >= 0){
                    send(new ResponseRequestInventoryUpLevelCard(InventoryError.SUCCESS.getValue(),
                            id,equalRequest, exp), user);
                }
                else {
                    send(new ResponseRequestInventoryUpLevelCard(InventoryError.ERROR.getValue(),
                            id, Error_negative.error_negative, Error_negative.error_negative), user);
                }
                userInfo.saveModel(user.getId());
            }

        } catch (Exception e) {
            send(new ResponseRequestInventoryUpLevelCard(InventoryError.EXCEPTION.getValue(), Error_ID.error_ID, Error_negative.error_negative, Error_negative.error_negative), user);
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
    public enum InventoryError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private InventoryError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }

}


