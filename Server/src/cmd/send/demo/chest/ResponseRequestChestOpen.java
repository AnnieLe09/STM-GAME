package cmd.send.demo.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestChestOpen extends BaseMsg {
    int id;

    public ResponseRequestChestOpen(Short error,int id) {
        super(CmdDefine.CHEST_OPEN,error);
        this.id = id;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        return packBuffer(bf);
    }
}

