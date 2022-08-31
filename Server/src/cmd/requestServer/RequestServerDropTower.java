package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerDropTower extends RequestServer{
    private int tick;
    private int i;
    private int j;

    public RequestServerDropTower(int tick, int i, int j){
        super(CmdDefine.DROP_TOWER);
        this.tick = tick;
        this.i = i;
        this.j = j;
    }
    public int getTick() {
        return tick;
    }

    public int getI() {
        return i;
    }

    public int getJ() {
        return j;
    }
}
