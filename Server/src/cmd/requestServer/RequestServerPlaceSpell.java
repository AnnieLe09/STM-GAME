package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerPlaceSpell extends RequestServer{
    private int tick;
    private String cardId;
    private double i;
    private double j;

    public RequestServerPlaceSpell(int tick, String cardId, double i, double j){
        super(CmdDefine.PLACE_SPELL);
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

    public double getI() {
        return i;
    }

    public double getJ() {
        return j;
    }
}
