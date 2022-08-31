package model.Shop;

import model.PlayerInfo;
import util.database.DataModel;

public class GoldBuying extends DataModel {
    private static final int[] amountOfGolds = {1000,2000,10000};
    private static final int[] priceOfGolds = {50,95,475};


    public GoldBuying() {
        super();
    }

    public boolean buyGold(PlayerInfo playerInfo, int type){
        if (playerInfo.getG() < priceOfGolds[type]) {
            return false;
        }
        playerInfo.upGold(amountOfGolds[type]);
        playerInfo.upG(priceOfGolds[type] * (-1));
        return true;
    }


}
