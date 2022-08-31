package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;



public class RequestCheatUpTrophy extends BaseCmd{
    private int trophy;
    public RequestCheatUpTrophy(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            trophy = readInt(bf);
        } catch (Exception e) {
            trophy = Error_negative.error_negative;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getTrophy() {
        return trophy;
    }
}