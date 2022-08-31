package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponseEndMatch extends BaseMsg {
    int hp0;
    int hp1;
    private BattleController battleController;
    private boolean isSwap;
    public ResponseEndMatch(Short error, int hp0, int hp1, BattleController battleController, boolean isSwap) {
        super(CmdDefine.END_MATCH,error);
        this.hp0 = hp0;
        this.hp1 = hp1;
        this.battleController = battleController;
        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(hp0);
        bf.putInt(hp1);
        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
        bf = responseBattleStatus.getStatusByteBuffer(bf, this.battleController, this.isSwap);
        return packBuffer(bf);
    }
}
