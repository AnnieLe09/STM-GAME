package cmd.receive.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;

public class RequestDropTower extends BaseCmd {
    private int tick;
    private int i;
    private int j;
    public RequestDropTower(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            tick = readInt(bf);
            i = readInt(bf);
            j = readInt(bf);
        } catch (Exception e) {
            CommonHandle.writeErrLog(e);
        }
    }

    public int getTick() {
        return tick;
    }

    public int getI() {
        return i;
    }

    public int getJ() {
        return j;
    }
}
