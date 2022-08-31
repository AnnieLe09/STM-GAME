package cmd.send.demo.inventory;


import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestInventoryChangeCard extends BaseMsg {
    int collectionCardID;
    int chosenCardID;

    public ResponseRequestInventoryChangeCard(Short error,int collectionCardID, int chosenCardID) {
        super(CmdDefine.INVENTORY_CHANGE_CARD,error);
        this.collectionCardID = collectionCardID;
        this.chosenCardID = chosenCardID;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        bf.putInt(this.collectionCardID);
        bf.putInt(this.chosenCardID);

        return packBuffer(bf);
    }
}

