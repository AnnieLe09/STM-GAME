package cmd.receive.user;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

public class RequestResetUserInfo extends BaseCmd {
    public RequestResetUserInfo(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
}
