package cmd.send.demo.cheat;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.Chest.Chest;

import java.nio.ByteBuffer;

public class ResponseRequestCheatUpLobbyChest extends BaseMsg {
    Chest chest;

    public ResponseRequestCheatUpLobbyChest(Short error, Chest chest) {
        super(CmdDefine.CHEAT_UP_LOBBY_CHEST,error);
        this.chest = chest;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        if (chest != null) {
            bf.putInt(chest.getId());
            putStr(bf, chest.getName());

            bf.putInt(chest.getGold());
            int[] cardID = chest.getCardID();
            int[] amountOfCard = chest.getAmountOfCard();
            bf.putInt(cardID.length);
            for (int i = 0; i < cardID.length; i++) {
                bf.putInt(cardID[i]);
                bf.putInt(amountOfCard[i]);
            }
        }
        return packBuffer(bf);
    }
}