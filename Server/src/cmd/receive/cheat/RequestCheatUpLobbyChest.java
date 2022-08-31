package cmd.receive.cheat;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;



public class RequestCheatUpLobbyChest extends BaseCmd{

    public RequestCheatUpLobbyChest(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }

}