package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;



public class RequestCheatUpG extends BaseCmd{
    private int g;
    public RequestCheatUpG(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            g = readInt(bf);
        } catch (Exception e) {
            g = Error_negative.error_negative;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getG() {
        return g;
    }
}