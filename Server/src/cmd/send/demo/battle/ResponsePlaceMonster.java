package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponsePlaceMonster extends BaseMsg {
    private int tick;
    private String battleId;
    public ResponsePlaceMonster(Short error, int tick, String battleId) {
        super(CmdDefine.PLACE_MONSTER,error);
        this.tick = tick;
        this.battleId = battleId;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(tick);
        putStr(bf,this.battleId);
        return packBuffer(bf);
    }
}
