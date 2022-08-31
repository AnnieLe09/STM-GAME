package cmd.send.demo.inventory;


import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.Inventory.Inventory;

import java.nio.ByteBuffer;
import java.util.Set;

public class ResponseRequestInventoryInfo extends BaseMsg {
    Inventory inventory;

    public ResponseRequestInventoryInfo(Short error,Inventory inventory) {
        super(CmdDefine.GET_INVENTORY_INFO,error);
        this.inventory = inventory;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        int amountOfChosenCards = inventory.getAmountOfChosenCards();
        Set<Integer> chosenCards = inventory.getChosenCardList();
        bf.putInt(amountOfChosenCards);
        for(int id:chosenCards){
            bf.putInt(id);
            bf.putInt(inventory.getCard(id).getLevel());
            bf.putInt(inventory.getCard(id).getExp());
        }

        int amountOfCardCollections = inventory.getAmountOfCardCollections();
        Set<Integer> cardCollections = inventory.getCardCollectionList();
        bf.putInt(amountOfCardCollections);
        for(int id:cardCollections){
            bf.putInt(id);
            bf.putInt(inventory.getCard(id).getLevel());
            bf.putInt(inventory.getCard(id).getExp());
        }
        return packBuffer(bf);
    }
}

