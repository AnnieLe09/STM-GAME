package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestCheatReduceAllLobbyChestTime extends BaseMsg {
    int[] id_time;

    public ResponseRequestCheatReduceAllLobbyChestTime(Short error,int[] id_time) {
        super(CmdDefine.CHEAT_REDUCE_ALL_LOBBY_CHEST_TIME_REMAINING,error);
        this.id_time = id_time;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        int amountOfId = id_time.length / 2;
        bf.putInt(amountOfId);
        for (int i=0;i<amountOfId;i++){
            bf.putInt(id_time[i*2]);
            bf.putInt(id_time[i*2+1]);
        }
        return packBuffer(bf);
    }
}