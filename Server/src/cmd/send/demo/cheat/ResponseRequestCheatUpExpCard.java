package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpExpCard extends BaseMsg {
    int id;
    int exp;

    public ResponseRequestCheatUpExpCard(Short error,int id,int exp) {
        super(CmdDefine.CHEAT_UP_EXP_CARD,error);
        this.id = id;
        this.exp = exp;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        bf.putInt(exp);
        return packBuffer(bf);
    }
}