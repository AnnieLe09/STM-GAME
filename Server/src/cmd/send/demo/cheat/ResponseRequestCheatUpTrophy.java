package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpTrophy extends BaseMsg {
    int trophy;

    public ResponseRequestCheatUpTrophy(Short error,int trophy) {
        super(CmdDefine.CHEAT_UP_TROPHY,error);
        this.trophy = trophy;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(trophy);
        return packBuffer(bf);
    }
}