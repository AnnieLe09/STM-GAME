package cmd.send.demo.battle;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;
import model.Chest.Chest;

import java.nio.ByteBuffer;

public class ResponseBattleReward extends BaseMsg {
    private int trophy;
    private Chest chest;
    public ResponseBattleReward(Short error,int trophy, Chest chest) {
        super(CmdDefine.BATTLE_REWARD,error);
        this.trophy = trophy;
        this.chest = chest;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(trophy);
        if (chest == null){
            bf.putInt(0);
        }
        else {
            bf.putInt(1);
            int chestId = chest.getId();
            bf.putInt(chestId);
            putStr(bf,chest.getName());
            bf.putInt(chest.getTimeRemaining());
            bf.putInt(chest.getGold());
            int[] cardID = chest.getCardID();
            int[] amountOfCard = chest.getAmountOfCard();
            bf.putInt(cardID.length);
            for(int i=0;i<cardID.length;i++){
                bf.putInt(cardID[i]);
                bf.putInt(amountOfCard[i]);
            }

        }
        return packBuffer(bf);
    }
}
