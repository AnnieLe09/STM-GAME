package cmd.send.demo.findmatch;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import controller.BattleController;
import model.Battle.BattleObject;
import model.Battle.Player;
import model.Define.ModelDefine;
import model.PlayerInfo;

import java.nio.ByteBuffer;
import java.util.Iterator;
import java.util.LinkedList;

public class ResponseCancelFindMatch extends BaseMsg {
    public ResponseCancelFindMatch(Short error) {
        super(CmdDefine.CANCEL_FIND_MATCH,error);
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
