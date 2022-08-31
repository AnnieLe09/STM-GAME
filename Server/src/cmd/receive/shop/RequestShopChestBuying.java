package cmd.receive.shop;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;

import java.nio.ByteBuffer;


public class RequestShopChestBuying extends BaseCmd {
    private int id;
    public RequestShopChestBuying(DataCmd dataCmd) {
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

    public int getID() {
        return id;
    }
}