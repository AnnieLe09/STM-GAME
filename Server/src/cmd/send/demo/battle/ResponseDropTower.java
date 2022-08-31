package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;

import java.nio.ByteBuffer;

public class ResponseDropTower extends BaseMsg {
    private int tick;
    private int i;
    private int j;
    private BattleController battleController;
    private boolean isSwap;
    public ResponseDropTower(Short error, int tick, int i, int j,
            BattleController battleController, boolean isSwap) {
        super(CmdDefine.DROP_TOWER,error);
        this.tick = tick;
        this.i = i;
        this.j = j;
        this.battleController = battleController;
        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(tick);
        bf.putInt(i);
        bf.putInt(j);
        if (this.battleController == null){
            return packBuffer(bf);
        }
        ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
        bf = responseBattleStatus.getStatusByteBuffer(bf, this.battleController, this.isSwap);
        return packBuffer(bf);
    }
}
