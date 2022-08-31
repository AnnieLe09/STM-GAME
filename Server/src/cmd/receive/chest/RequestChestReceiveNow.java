package cmd.receive.chest;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;
import cmd.error_Default_Value.Error_g;

import java.nio.ByteBuffer;


public class RequestChestReceiveNow extends BaseCmd {
    private int id;
    private int g;
    public RequestChestReceiveNow(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            id = readInt(bf);
            g = readInt(bf);
        } catch (Exception e) {
            id = Error_ID.error_ID;
            g = Error_g.error_g;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getID() {
        return id;
    }
    public int getG() {
        return g;
    }
}