package cmd.receive.shop;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;


public class RequestShopInfo extends BaseCmd {
    public RequestShopInfo(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
}