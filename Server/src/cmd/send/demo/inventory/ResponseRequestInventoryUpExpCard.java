package cmd.send.demo.inventory;


import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestInventoryUpExpCard extends BaseMsg {
    int id;
    int exp;

    public ResponseRequestInventoryUpExpCard(Short error,int id, int exp) {
        super(CmdDefine.INVENTORY_UP_EXP_CARD,error);
        this.id = id;
        this.exp = exp;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        bf.putInt(this.id);
        bf.putInt(this.exp);

        return packBuffer(bf);
    }
}

