package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;



public class RequestCheatUpGold extends BaseCmd{
    private int gold;
    public RequestCheatUpGold(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            gold = readInt(bf);
        } catch (Exception e) {
            gold = Error_negative.error_negative;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getGold() {
        return gold;
    }
}