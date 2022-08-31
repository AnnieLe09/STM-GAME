package model.bot.bot_info;

import model.Define.BotDefine;
import model.PlayerInfo;

public class BotInfoDefend1 extends PlayerInfo {
    public BotInfoDefend1(int id, String name) {
        super(id, name);
        this.type = BotDefine.BotInfoDefend1;
        this.changeCard();
    }

    public void changeCard(){

    }
}
