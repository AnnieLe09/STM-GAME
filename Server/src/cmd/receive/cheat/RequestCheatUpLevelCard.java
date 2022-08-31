package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;



public class RequestCheatUpLevelCard extends BaseCmd{
    private int id;
    private int level;
    public RequestCheatUpLevelCard(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            id = readInt(bf);
            level = readInt(bf);
        } catch (Exception e) {
            id = Error_ID.error_ID;
            level = Error_negative.error_negative;
            CommonHandle.writeErrLog(e);
        }
    }
    public int getId() {
        return id;
    }
    public int getLevel() {
        return level;
    }
}