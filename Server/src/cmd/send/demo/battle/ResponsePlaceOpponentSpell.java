package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponsePlaceOpponentSpell extends BaseMsg {
    private int tick;
    private String battleId;
    private double i;
    private double j;
    private boolean isSwap;
    private BattleController battleController;
    public ResponsePlaceOpponentSpell(Short error, int tick, String battleId, double i, double j, BattleController battleController, boolean isSwap) {
        super(CmdDefine.PLACE_OPPONENT_SPELL,error);
        this.tick = tick;
        this.battleId = battleId;
        this.i = i;
        this.j = j;
        this.battleController = battleController;
        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(tick);
        putStr(bf, battleId);
        bf.putDouble(i);
        bf.putDouble(j);
        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
        bf = responseBattleStatus.getStatusByteBuffer(bf, battleController, isSwap);
        return packBuffer(bf);
    }
}
