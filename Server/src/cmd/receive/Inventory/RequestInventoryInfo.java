package cmd.receive.Inventory;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;


public class RequestInventoryInfo extends BaseCmd {
    public RequestInventoryInfo(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
}