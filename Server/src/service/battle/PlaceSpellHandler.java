package service.battle;

import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import cmd.receive.battle.RequestPlaceSpell;
import cmd.receive.battle.RequestPlaceTower;
import cmd.requestServer.RequestServerPlaceSpell;
import cmd.send.demo.battle.ResponsePlaceOpponentSpell;
import cmd.send.demo.battle.ResponsePlaceSpell;
import controller.BattleController;
import controller.MainController;
import service.FindMatchHandler;

public class PlaceSpellHandler {
    public static BattleController process(User user, RequestPlaceSpell requestPlaceSpell){
        //processInput(requestPlaceTower);
        //main flow trong truong hop mang tot
        System.out.println("PlaceSpellHandler: start");
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            battleController.update(requestPlaceSpell.getTick());
            battleController.placeSpell(user.getId(), requestPlaceSpell.getCardId(), requestPlaceSpell.getI(), requestPlaceSpell.getJ());
            //battleController.update(requestPlaceSpell.getTick());
        }
        else{
            System.out.println("Cannot find battle controller");
        }
        //Luu vao record
        return battleController;
    }

    public static BattleController process(User user, RequestServerPlaceSpell requestServerPlaceSpell){
        //processInput(requestPlaceTower);
        //main flow trong truong hop mang tot
        System.out.println("PlaceSpellHandler: start");
        BattleController battleController = MainController.findBattleByUser(user.getId());
        if(battleController != null){
            battleController.update(requestServerPlaceSpell.getTick());
            battleController.placeSpell(user.getId(), requestServerPlaceSpell.getCardId(),
                    requestServerPlaceSpell.getI(), requestServerPlaceSpell.getJ());
            //battleController.update(requestPlaceSpell.getTick());
        }
        else{
            System.out.println("Cannot find battle controller");
        }
        //Luu vao record
        return battleController;
    }
}
