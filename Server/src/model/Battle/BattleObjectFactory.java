package model.Battle;

import controller.IDController;
import controller.MainController;
import model.Define.CardDefine;
import model.Inventory.Card;
import model.Inventory.Inventory;
import model.Monster.Monster;
import model.Spell.*;
import model.Tower.AttackTower;
import model.Tower.SupportTower;
import util.readJson.TowerJson;
import util.database.DataModel;

import java.util.Hashtable;
import java.util.LinkedList;

public class BattleObjectFactory extends DataModel {

    private Hashtable<Integer, BattleObject> battleObjects;
    public BattleObjectFactory(){
        super();
    }
    public  BattleObject createBattleObject(int battleObjectType, int battleObjectTypeId, int level){
        switch (battleObjectType) {
            case CardDefine.TOWER_OBJECT:
                TowerJson towerJson = new TowerJson();
                String type = towerJson.get(new String[]{"tower",String.valueOf(battleObjectTypeId),"archetype"});
                if (type.equals("attack") || type.equals("magic"))
                    return new AttackTower(battleObjectTypeId);
                if (type.equals("support"))
                    return new SupportTower(battleObjectTypeId);
                return null;

            case CardDefine.MONSTER_OBJECT:
                return new Monster(battleObjectTypeId, level, 1, null, false);
            case CardDefine.SPELL_OBJECT:
                switch (battleObjectTypeId){
                    case 0: return new FireballSpell(level);
                    case 1: return new FrozenSpell(level);
                    case 2: return new HealSpell(level);
                    case 3: return new SpeedUpSpell(level);
                    case 4: return new TrapSpell(level);
                    case 5: return new PowerSpell(level);
                }

            /*
            case ModelDefine.TOWER_OBJECT:
                return new Tower(this.lastId,battleObjectTypeId);
            case ModelDefine.SPELL_OBJECT:
                return new Spell(this.lastId,battleObjectTypeId);

             */
            default:
                return null;
        }
    }
    public static LinkedList<BattleObject> createBattleObjects(int uID, int num){
        //todo
        LinkedList<BattleObject> list = new LinkedList<>();
        Inventory inventory = IDController.getPlayerByID(uID).getInventory();
        int[] listCardID = inventory.randomChosenCard(num);
        for(int i = 0; i < num; ++i){
            Card card = inventory.getCard(listCardID[i]);
            list.add(MainController.getBattleObjectFactory().createBattleObject
                    (card.getType(), card.getBattleObjectTypeId(), card.getLevel()));
        }
        return list;
    }

}
