package cmd.send.demo.inventory;


import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestInventoryUpLevelCard extends BaseMsg {
    int id;
    int level;
    int exp;

    public ResponseRequestInventoryUpLevelCard(Short error,int id, int level,int exp) {
        super(CmdDefine.INVENTORY_UP_LEVEL_CARD,error);
        this.id = id;
        this.level = level;
        this.exp = exp;
    }

    @Override
    public byte[] createData() {

        ByteBuffer bf = makeBuffer();
        bf.putInt(this.id);
        bf.putInt(this.level);
        bf.putInt(this.exp);

        return packBuffer(bf);
    }
}

