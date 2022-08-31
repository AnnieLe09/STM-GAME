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
import cmd.receive.shop.RequestShopCardBuying;
import cmd.receive.shop.RequestShopChestBuying;
import cmd.receive.shop.RequestShopGoldBuying;
import cmd.receive.shop.RequestShopInfo;
import cmd.send.demo.shop.ResponseRequestShopCardBuying;
import cmd.send.demo.shop.ResponseRequestShopChestBuying;
import cmd.send.demo.shop.ResponseRequestShopGoldBuying;
import cmd.send.demo.shop.ResponseRequestShopInfo;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.PlayerInfo;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.List;

public class ShopHandler extends BaseClientRequestHandler {
    public static final short SHOP_MULTI_IDS = 4000;
    private final Logger logger = LoggerFactory.getLogger("ShopHandler");

    public ShopHandler() {
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

                case CmdDefine.GET_SHOP_INFO:
                    RequestShopInfo requestShopInfo = new RequestShopInfo(dataCmd);
                    processRequestShopInfo(user, requestShopInfo);
                    break;
                case CmdDefine.SHOP_CHEST_BUYING:
                    RequestShopChestBuying requestShopChestBuying = new RequestShopChestBuying(dataCmd);
                    processRequestShopChestBuying(user, requestShopChestBuying);
                    break;
                case CmdDefine.SHOP_CARD_BUYING:
                    RequestShopCardBuying requestShopCardBuying = new RequestShopCardBuying(dataCmd);
                    processRequestShopCardBuying(user, requestShopCardBuying);
                    break;
                case CmdDefine.SHOP_GOLD_BUYING:
                    RequestShopGoldBuying requestShopGoldBuying = new RequestShopGoldBuying(dataCmd);
                    processRequestShopGoldBuying(user, requestShopGoldBuying);
                    break;

                default:
                    break;
            }
        } catch (Exception e) {
            logger.warn("USERHANDLER EXCEPTION " + e.getMessage());
            logger.warn(ExceptionUtils.getStackTrace(e));
        }

    }


    private void processRequestShopInfo(User user, RequestShopInfo requestShopInfo) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestShopInfo(ShopError.PLAYERINFO_NULL.getValue(),null), user);
            }
            userInfo.getShop().updateLoginItem(userInfo);
            userInfo.saveModel(user.getId());
            send(new ResponseRequestShopInfo(ShopError.SUCCESS.getValue(),userInfo.getShop()), user);
            userInfo.saveModel(user.getId());
        } catch (Exception e) {
            send(new ResponseRequestShopInfo(ShopError.EXCEPTION.getValue(),null), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestShopChestBuying(User user, RequestShopChestBuying requestShopChestBuying) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestShopChestBuying(ShopError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID), user);
            }
            int id = requestShopChestBuying.getID();
            userInfo.getShop().updateLoginItem(userInfo);
            boolean equalRequest = userInfo.getShop().getLoginItem().boughtChest(userInfo,id);
            if (equalRequest){
                send(new ResponseRequestShopChestBuying(ShopError.SUCCESS.getValue(),id), user);
            }
            else {
                send(new ResponseRequestShopChestBuying(ShopError.ERROR.getValue(),id), user);
            }
            userInfo.saveModel(user.getId());
        } catch (Exception e) {
            send(new ResponseRequestShopChestBuying(ShopError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestShopCardBuying(User user, RequestShopCardBuying requestShopCardBuying) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestShopCardBuying(ShopError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID), user);
            }
            int id = requestShopCardBuying.getID();
            userInfo.getShop().updateLoginItem(userInfo);
            boolean equalRequest = userInfo.getShop().getLoginItem().boughtCard(userInfo,id);
            if (equalRequest){
                send(new ResponseRequestShopCardBuying(ShopError.SUCCESS.getValue(),id), user);
            }
            else {
                send(new ResponseRequestShopCardBuying(ShopError.ERROR.getValue(),id), user);
            }
            userInfo.saveModel(user.getId());

        } catch (Exception e) {
            send(new ResponseRequestShopCardBuying(ShopError.EXCEPTION.getValue(),Error_ID.error_ID), user);
            logger.info(ExceptionUtils.getStackTrace(e));
        }
    }
    private void processRequestShopGoldBuying(User user, RequestShopGoldBuying requestShopGoldBuying) {
        try {

            PlayerInfo userInfo = (PlayerInfo) user.getProperty(ServerConstant.PLAYER_INFO);
            if (userInfo == null) {
                send(new ResponseRequestShopGoldBuying(ShopError.PLAYERINFO_NULL.getValue(), Error_ID.error_ID), user);
            }
            int id = requestShopGoldBuying.getID();
            boolean equalRequest = userInfo.getShop().getGoldBuying().buyGold(userInfo,id);
            if (equalRequest){
                send(new ResponseRequestShopGoldBuying(ShopError.SUCCESS.getValue(), id), user);
            }
            else {
                send(new ResponseRequestShopGoldBuying(ShopError.ERROR.getValue(), id), user);
            }
            userInfo.saveModel(user.getId());
        } catch (Exception e) {
            send(new ResponseRequestShopGoldBuying(ShopError.EXCEPTION.getValue(), Error_ID.error_ID), user);
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
    public enum ShopError {
        SUCCESS((short) 0),
        ERROR((short) 1),
        PLAYERINFO_NULL((short) 2),
        EXCEPTION((short) 3);

        private final short value;

        private ShopError(short value) {
            this.value = value;
        }

        public short getValue() {
            return this.value;
        }
    }

}
