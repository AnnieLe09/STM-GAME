package cmd.send.demo.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.Chest.Chest;
import model.Chest.ChestController;

import java.nio.ByteBuffer;
import java.util.ArrayList;

public class ResponseRequestLobbyChestInfo extends BaseMsg {
    ChestController chestController;

    public ResponseRequestLobbyChestInfo(Short error,ChestController chestController) {
        super(CmdDefine.GET_LOBBY_CHEST_INFO,error);
        this.chestController = chestController;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        bf.putInt(chestController.getAmountOfLobbyChest());
        ArrayList<Integer> chestList = chestController.getLobbyChests();

        for(int id:chestList){
            Chest chest = chestController.getChest(id);
            bf.putInt(id);
            putStr(bf, chest.getName());
            bf.put(chest.getIsOpen());
            bf.put(chest.getIsReceive());
            bf.putInt(chest.getTimeRemaining());

            bf.putInt(chest.getGold());
            int[] cardID = chest.getCardID();
            int[] amountOfCard = chest.getAmountOfCard();
            bf.putInt(cardID.length);
            for(int i=0;i<cardID.length;i++){
                bf.putInt(cardID[i]);
                bf.putInt(amountOfCard[i]);
            }


        }
        return packBuffer(bf);
    }
}

