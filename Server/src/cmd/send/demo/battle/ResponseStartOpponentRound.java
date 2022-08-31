package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponseStartOpponentRound extends BaseMsg {
    private int tick;
    private boolean isSwap;
    private BattleController battleController;
    public ResponseStartOpponentRound(Short error, int tick, BattleController battleController, boolean isSwap) {
        super(CmdDefine.START_OPPONENT_ROUND,error);
        System.out.println("====== Send reponse start opponent round");
        this.tick = tick;
        this.battleController = battleController;
        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(tick);
        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
        bf = responseBattleStatus.getStatusByteBuffer(bf, battleController, isSwap);
        return packBuffer(bf);
    }
}
