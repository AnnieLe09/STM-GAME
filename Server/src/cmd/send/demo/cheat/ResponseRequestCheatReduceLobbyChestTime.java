package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatReduceLobbyChestTime extends BaseMsg {
    int id;
    int time;

    public ResponseRequestCheatReduceLobbyChestTime(Short error,int id,int time) {
        super(CmdDefine.CHEAT_REDUCE_LOBBY_CHEST_TIME_REMAINING,error);
        this.id = id;
        this.time = time;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        bf.putInt(time);
        return packBuffer(bf);
    }
}