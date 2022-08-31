package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpGold extends BaseMsg {
    int gold;

    public ResponseRequestCheatUpGold(Short error,int gold) {
        super(CmdDefine.CHEAT_UP_GOLD,error);
        this.gold = gold;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(gold);
        return packBuffer(bf);
    }
}