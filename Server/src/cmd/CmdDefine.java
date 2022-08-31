package cmd;


public class CmdDefine {

    private CmdDefine() {

    }

    public static final short CUSTOM_LOGIN = 1;
    public static final short GET_USER_INFO = 1001;
    public static final short RESET_USER_INFO = 1002;


    //Log cmd
    public static final short MOVE = 2001;
    public static final short GET_NAME = 2002;
    public static final short SET_NAME = 2003;

    // Chest

    public static final short GET_LOBBY_CHEST_INFO = 3002;
    public static final short CHEST_OPEN = 3003;
    public static final short CHEST_RECEIVE = 3004;
    public static final short CHEST_RECEIVE_NOW = 3005;

    // Shop
    public static final short GET_SHOP_INFO = 4001;
    public static final short SHOP_CHEST_BUYING = 4002;
    public static final short SHOP_CARD_BUYING = 4003;
    public static final short SHOP_GOLD_BUYING = 4004;

    //Inventory
    public static final short GET_INVENTORY_INFO = 5001;
    public static final short INVENTORY_CHANGE_CARD = 5002;
    public static final short INVENTORY_UP_EXP_CARD= 5003;
    public static final short INVENTORY_UP_LEVEL_CARD = 5004;

    // CHEAT
    public static final short CHEAT_UP_G = 6001;
    public static final short CHEAT_UP_GOLD = 6002;
    public static final short CHEAT_UP_TROPHY = 6003;
    public static final short CHEAT_UP_EXP_CARD = 6004;
    public static final short CHEAT_UP_LEVEL_CARD = 6005;
    public static final short CHEAT_UP_LOBBY_CHEST = 6006;
    public static final short CHEAT_REDUCE_LOBBY_CHEST_TIME_REMAINING = 6007;
    public static final short CHEAT_REDUCE_ALL_LOBBY_CHEST_TIME_REMAINING = 6008;

    // FIND_MATCH
    public static final short FIND_MATCH = 9001;
    public static final short CANCEL_FIND_MATCH = 9002;

    // BATTLE
    public static final short PLACE_TOWER = 10001;
    public static final short PLACE_OPPONENT_TOWER = 10002;
    public static final short PLACE_SPELL = 10003;
    public static final short PLACE_OPPONENT_SPELL = 10004;
    public static final short PLACE_MONSTER = 10005;
    public static final short PLACE_OPPONENT_MONSTER = 10006;

    public static final short START_ROUND = 10007;
    public static final short END_MATCH = 10008;
    public static final short BATTLE_STATUS = 10100;
    public static final short DROP_TOWER = 10009;
    public static final short DROP_OPPONENT_TOWER = 10010;
    public static final short UPGRADE_TOWER = 10011;
    public static final short UPGRADE_OPPONENT_TOWER = 10012;
    public static final short START_OPPONENT_ROUND = 10013;

    public static final short GESTURE = 10014;
    public static final short OPPONENT_GESTURE = 10015;
    public static final short BATTLE_REWARD = 10016;

    //BATTLE SERVER
    public static final short START_BATTLE = 11000;
}
