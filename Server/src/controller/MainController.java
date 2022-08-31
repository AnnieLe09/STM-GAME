package controller;

import bitzero.server.entities.User;
import bitzero.server.util.BinaryHelper;
import manager.Battle.BattleManager;
import model.Battle.BattleObjectFactory;
import model.Define.ModelDefine;
import model.Map.Map;
import model.Monster.Monster;
import model.PlayerInfo;
import model.Shop.Shop;
import org.json.JSONException;
import util.database.DataModel;
import util.server.ServerUtil;
import util.vector.VecInt;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;

public class MainController {
    private static final long socialID = ModelDefine.MODEL_SOCIAL_ID;
    private static IDController idController;
    private static Shop shop;
    private static BattleObjectFactory battleObjectFactory;
    private static BattleManager battleManager;
    private static Hashtable<Integer, PlayerInfo> botInfoList;
    private static Hashtable<Integer, User> botUserList;
    public static void Main(){
        System.out.println("Class MainController is active");
        init();

//        Map m = new Map(Map.genBuffCells(3));

//        ArrayList<VecInt> a = m.bfsShortedPath(new VecInt(0,0), new VecInt(5,7), ModelDefine.DIR_DOWN);
//        ArrayList<VecInt> b = m.getCurvePoint(a);

//        Monster a = new Monster(3, 1,1,1,true);
//        a.run(m);
//        int [][] x = m.getShowArr();
//        for(int i = 0; i < a.path.size(); i++){
//            x[a.path.get(i).x][a.path.get(i).y] = 5;
//        }
//         for(int i = 0; i < 6; i++){
//             for(int j = 0; j < 8; j++){
//                 System.out.print(x[i][j]);
//                 System.out.print("  ");
//             }
//             System.out.println();
//         }
//
//         System.out.println(a.curSpeed);
//
//         for(int i = 0; i < 1000; i++){
//             a.update(1.0/60);
//             System.out.println("pos: " + a.x + ", " + a.y);
//         }

    }
    private static void init(){
        idController = (IDController) MainController.getModel(socialID,IDController.class,ModelDefine.MODEL_ID_CONTROLLER);
        shop = (Shop) MainController.getModel(socialID,Shop.class,ModelDefine.MODEL_SHOP);
        battleObjectFactory = (BattleObjectFactory) MainController.getModel(socialID,BattleObjectFactory.class,
                ModelDefine.MODEL_BATTLE_OBJECT_FACTORY);
        battleManager = new BattleManager(socialID);
        botInfoList = new Hashtable<>();
        botUserList = new Hashtable<>();
        //test LA
        /*BattleController temp = new BattleController(1, 2);
        temp.update(8000);*/
    }
    public static BattleController findMatch(int playerId){
        System.out.println("MainController: call battle manager to find match");
        return battleManager.findMatch(playerId);
    }
    public static void saveModel(DataModel model){
        try {
            model.saveModel(socialID);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Cannot save Model " +
                    ServerUtil.getModelKeyName(model.getClass().getSimpleName(), socialID));
        }
    }
    public static void saveModel(long userID,DataModel model){
        try {
            model.saveModel(userID);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Cannot save Model " +
                    ServerUtil.getModelKeyName(model.getClass().getSimpleName(), userID));
        }
    }
    public static boolean endMatch(int id){
        return battleManager.endMatch(id);
    }
    public static boolean cancelFindMatch(int id) {
        return battleManager.cancelFindMatch(id);
    }
    public static DataModel getModel(long userID,Class c,int type){
        DataModel dataModel = null;
        try {
            dataModel = (DataModel) DataModel.getModel(userID, c);
            if (dataModel != null){
                return dataModel;
            }
            dataModel = DataModelFactory.create(userID, type);
            try {
                dataModel.saveModel(userID);
                return dataModel;
            } catch (Exception e) {
                System.out.println("Cannot save Model " +
                        ServerUtil.getModelKeyName(c.getSimpleName(), userID));
            }
        } catch (Exception e) {
            System.out.println("Cannot get Model " +
                    ServerUtil.getModelKeyName(c.getSimpleName(), socialID));
            return null;
        }
        return dataModel;
    }
    public static String getNewId(String className){
        return getIdController().genNewID(className);
    }
    public static IDController getIdController() {
        return idController;
    }
    public static Shop getShop() {
        return shop;
    }

    public static BattleObjectFactory getBattleObjectFactory() {
        return battleObjectFactory;
    }
    public static BattleController findBattleByUser(int userId){
        return battleManager.findBattleByUser(userId);
    }
    public static void registerBotInfo(PlayerInfo botInfo){
        if (botInfoList.get(botInfo.getID()) != null){
            return;
        }
        botInfoList.put(botInfo.getID(),botInfo);
        botUserList.put(botInfo.getID(), IDController.createFakeUserWithId(botInfo.getID()));
    }
    public static PlayerInfo getBotInfo(int botId){
        return  botInfoList.get(botId);
    }
    public static User getBotUser(int botID){return  botUserList.get(botID);}
    public static void putStr(ByteBuffer bf, String value) {
        byte[] var4 = BinaryHelper.a(value);
        Integer var5 = var4.length;
        bf.putShort(var5.shortValue());
        bf.put(var4);
    }

}
