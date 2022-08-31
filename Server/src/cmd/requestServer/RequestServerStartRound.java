package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerStartRound extends RequestServer{
    private int tick;
    public RequestServerStartRound(int tick){
        super(CmdDefine.START_ROUND);
        this.tick = tick;
    }
    public int getTick() {
        return tick;
    }

}
