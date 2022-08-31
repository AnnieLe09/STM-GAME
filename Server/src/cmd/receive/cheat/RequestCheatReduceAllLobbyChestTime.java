package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_negative;

import java.nio.ByteBuffer;



public class RequestCheatReduceAllLobbyChestTime extends BaseCmd{
    private int time;
    public RequestCheatReduceAllLobbyChestTime(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            time = readInt(bf);
        } catch (Exception e) {
            time = Error_negative.error_negative;
            CommonHandle.writeErrLog(e);
        }
    }
    public int getTime() {
        return time;
    }
}