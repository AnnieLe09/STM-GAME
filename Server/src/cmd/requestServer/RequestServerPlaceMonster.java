package cmd.requestServer;

import cmd.CmdDefine;

public class RequestServerPlaceMonster extends RequestServer{
    private int tick;
    private String battleObjectId;


    public RequestServerPlaceMonster(int tick, String cardId){
        super(CmdDefine.PLACE_MONSTER);
        this.tick = tick;
        this.battleObjectId = cardId;

    }

    public int getTick() {
        return tick;
    }

    public String getCardId() {
        return battleObjectId;
    }

}
