package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpG extends BaseMsg {
    int g;

    public ResponseRequestCheatUpG(Short error,int g) {
        super(CmdDefine.CHEAT_UP_G,error);
        this.g = g;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(g);
        return packBuffer(bf);
    }
}