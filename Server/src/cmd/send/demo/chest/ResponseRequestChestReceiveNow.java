package cmd.send.demo.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestChestReceiveNow extends BaseMsg {
    int id;
    int g;

    public ResponseRequestChestReceiveNow(Short error,int id,int g) {
        super(CmdDefine.CHEST_RECEIVE_NOW,error);
        this.id = id;
        this.g = g;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        bf.putInt(g);
        return packBuffer(bf);
    }
}
