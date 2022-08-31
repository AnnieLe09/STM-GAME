package model.Battle;

import model.Define.ModelDefine;

import java.util.Hashtable;
import java.util.LinkedList;

public class BattleAction {
    private int userId;
    private int actionId;
    private Hashtable<String, Object>fields;
    public BattleAction(int userId, int actionId, Hashtable<String, Object>fields){
        this.userId = userId;
        this.actionId = actionId;
        this.fields = fields;
    }
}
