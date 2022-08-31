package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerEndMatch extends RequestServer{
    private int tick;

    public RequestServerEndMatch(int tick){
        super(CmdDefine.END_MATCH);
        this.tick = tick;
    }
    public int getTick() {
        return tick;
    }

}
