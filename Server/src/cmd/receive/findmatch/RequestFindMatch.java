package cmd.receive.findmatch;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;

import java.nio.ByteBuffer;

public class RequestFindMatch extends BaseCmd {
    public RequestFindMatch(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {

        } catch (Exception e) {

            CommonHandle.writeErrLog(e);
        }
    }
}
