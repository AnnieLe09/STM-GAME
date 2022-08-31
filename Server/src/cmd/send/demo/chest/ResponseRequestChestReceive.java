package cmd.send.demo.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestChestReceive extends BaseMsg {
    int id;

    public ResponseRequestChestReceive(Short error,int id) {
        super(CmdDefine.CHEST_RECEIVE,error);
        this.id = id;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        return packBuffer(bf);
    }
}
