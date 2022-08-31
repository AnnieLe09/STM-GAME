package cmd.send.demo.shop;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.Chest.Chest;
import model.Shop.Shop;

import java.nio.ByteBuffer;

public class ResponseRequestShopInfo extends BaseMsg {
    private Shop shop;

    public ResponseRequestShopInfo(Short error,Shop shop) {
        super(CmdDefine.GET_SHOP_INFO,error);
        this.shop = shop;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        //----------------- Pack Time Remaining ----------------------
        long timeRemaining = shop.getTimeRemaining();
        bf.putInt((int) timeRemaining);

        // ----------------- Pack Chest ---------------------
        int chestSlot = shop.getLoginItem().getChestSlot();
        int[] chestIDs = shop.getLoginItem().getChestIDs();
        int[] priceChests = shop.getLoginItem().getPriceOfChests();
        bf.putInt(chestSlot);
        for(int i=0;i<chestSlot;i++){
            bf.putInt(chestIDs[i]);
            Chest chest = shop.getLoginItem().getChest(chestIDs[i]);
            putStr(bf,chest.getName());
            bf.put(chest.getIsReceive());
            bf.putInt(priceChests[i]);

            bf.putInt(chest.getGold());
            int[] cardID = chest.getCardID();
            int[] amountOfCard = chest.getAmountOfCard();
            bf.putInt(cardID.length);
            for(int j=0;j<cardID.length;j++){
                bf.putInt(cardID[j]);
                bf.putInt(amountOfCard[j]);
            }

        }


        //----------------- Pack Cards ----------------------

        int[] cardID = shop.getLoginItem().getCardID();
        int[] amountOfCard = shop.getLoginItem().getAmountOfCard();
        byte[] isBoughtCards = shop.getLoginItem().getIsBoughtCards();
        bf.putInt(cardID.length);
        for(int i=0;i<cardID.length;i++){
            bf.putInt(cardID[i]);
            bf.putInt(amountOfCard[i]);
            bf.put(isBoughtCards[i]);
        }

        return packBuffer(bf);
    }
}