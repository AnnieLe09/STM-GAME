package cmd.receive.Inventory;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.error_Default_Value.Error_ID;

import java.nio.ByteBuffer;


public class RequestInventoryChangeCard extends BaseCmd {
    private int collectionCardID;
    private int chosenCardID;
    public RequestInventoryChangeCard(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            collectionCardID = readInt(bf);
            chosenCardID = readInt(bf);
        } catch (Exception e) {
            collectionCardID = Error_ID.error_ID;
            chosenCardID = Error_ID.error_ID;
            CommonHandle.writeErrLog(e);
        }
    }

    public int getCollectionCardID() {
        return collectionCardID;
    }

    public int getChosenCardID() {
        return chosenCardID;
    }
}