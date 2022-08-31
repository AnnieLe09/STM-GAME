package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerPlaceTower extends RequestServer{
    private int tick;
    private String cardId;
    private int i;
    private int j;

    public RequestServerPlaceTower(int tick, String cardId, int i, int j){
        super(CmdDefine.PLACE_TOWER);
        this.tick = tick;
        this.cardId = cardId;
        this.i = i;
        this.j = j;
    }
    public int getTick() {
        return tick;
    }

    public String getCardId() {
        return cardId;
    }

    public int getI() {
        return i;
    }

    public int getJ() {
        return j;
    }
}
