package controller;

import manager.Battle.BattleManager;
import model.Battle.BattleObjectFactory;
import model.Define.ModelDefine;
import model.Shop.Shop;
import util.database.DataModel;

public class DataModelFactory {

    public static DataModel create(long userID,int type) {
        switch (type) {
            case ModelDefine.MODEL_ID_CONTROLLER:
                return new IDController(userID);
            case ModelDefine.MODEL_SHOP:
                return new Shop();
            case ModelDefine.MODEL_BATTLE_OBJECT_FACTORY:
                return new BattleObjectFactory();
            case ModelDefine.MODEL_BATTLE_CONTROLLER_GENERAL:
                return new BattleManager(userID);

            default:
                return null;
        }
    }
}
