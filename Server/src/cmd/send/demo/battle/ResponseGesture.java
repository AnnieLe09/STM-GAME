package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponseGesture extends BaseMsg {
    private int tick;
    private String battleId;
//    private BattleController battleController;
//    private  boolean isSwap;

    public ResponseGesture(Short error, int tick, String battleId) {
        super(CmdDefine.GESTURE,error);
        this.tick = tick;
        this.battleId = battleId;
//        this.battleController = battleController;
//        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(tick);
        putStr(bf,this.battleId);
//        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
//        bf = responseBattleStatus.getStatusByteBuffer(bf, this.battleController, this.isSwap);
        return packBuffer(bf);
    }
}
