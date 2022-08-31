package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponsePlaceOpponentTower extends BaseMsg {
    private int tick;
    private String battleId;
    private int i;
    private int j;
    private BattleController battleController;
    private boolean isSwap;
    public ResponsePlaceOpponentTower(Short error, int tick, String battleId, int i, int j,
                                      BattleController battleController, boolean isSwap) {
        super(CmdDefine.PLACE_OPPONENT_TOWER,error);
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
        bf.putInt(i);
        bf.putInt(j);
        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
        bf = responseBattleStatus.getStatusByteBuffer(bf, this.battleController, this.isSwap);
        return packBuffer(bf);
    }
}
