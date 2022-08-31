package model.Battle;

import controller.MainController;
import model.Define.CardDefine;
import util.supportClass.Pos;
import util.database.DataModel;

public class BattleObject extends DataModel {
    protected String battleObjectId;
    protected String name;
    protected String className;
    protected int level;
    protected Pos curPos = new Pos(0,0);
    protected  int orderId;
    protected int objectId;

    protected BattleObject(String className, int objectId, int level){
        super();
        this.className = className;
        this.level = level;
        this.objectId = objectId;
        this.battleObjectId = MainController.getIdController().genNewID(this.className);
        initOrderId(className, objectId);
    }

    private void initOrderId(String className, int objectId) {
        orderId = CardDefine.TYPE_INDEX.get(className) + objectId;
    }

    // getters va setters
    public String getName() {
        return name;
    }

    public String getClassName() {
        return className;
    }

    public String getBattleObjectId() {
        return battleObjectId;
    }

    public Pos getCurPos() {
        return new Pos (curPos);
    }

    public int getOrderId() {
        return orderId;
    }

    public int getObjectId() {
        return objectId;
    }

    public void setCurPos(Pos curPos) {
        this.curPos = curPos;
    }

    public BattleObject clone(BattleObject clone){
        clone.orderId = this.orderId;
        clone.battleObjectId = this.battleObjectId;
        return clone;
    }

}

