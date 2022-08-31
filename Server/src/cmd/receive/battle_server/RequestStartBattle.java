package cmd.receive.battle_server;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;

public class RequestStartBattle extends BaseCmd {
    public RequestStartBattle(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
}
