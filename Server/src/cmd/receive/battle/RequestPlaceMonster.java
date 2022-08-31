package cmd.receive.battle;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;

import java.nio.ByteBuffer;

public class RequestPlaceMonster extends BaseCmd {
    private int tick;
    private String battleObjectId;
    public RequestPlaceMonster(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            tick = readInt(bf);
            battleObjectId = readString(bf);
        } catch (Exception e) {
            CommonHandle.writeErrLog(e);
        }
    }

    public int getTick() {
        return tick;
    }

    public String getCardId() {
        return battleObjectId;
    }

}
