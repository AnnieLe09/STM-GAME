package cmd.receive.Inventory;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;

import java.nio.ByteBuffer;


public class RequestInventoryUpLevelCard extends BaseCmd {
    private int id;
    public RequestInventoryUpLevelCard(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            id = readInt(bf);
        } catch (Exception e) {
            id = Error_ID.error_ID;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getId() {
        return id;
    }

}