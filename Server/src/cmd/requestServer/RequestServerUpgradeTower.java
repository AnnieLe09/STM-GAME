package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerUpgradeTower extends RequestServer{
    private int tick;
    private String cardId;
    private int i;
    private int j;

    public RequestServerUpgradeTower(int tick, String cardId, int i, int j){
        super(CmdDefine.UPGRADE_TOWER);
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
