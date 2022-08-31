package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpLevelCard extends BaseMsg {
    int id;
    int level;

    public ResponseRequestCheatUpLevelCard(Short error,int id,int level) {
        super(CmdDefine.CHEAT_UP_LEVEL_CARD,error);
        this.id = id;
        this.level = level;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        bf.putInt(level);
        return packBuffer(bf);
    }
}