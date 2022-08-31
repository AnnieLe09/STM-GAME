package cmd.send.demo.findmatch;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.send.demo.battle.ResponseBattleStatus;
import controller.BattleController;
import model.Battle.BattleObject;
import model.Battle.Player;
import model.Define.ModelDefine;
import model.PlayerInfo;

import java.nio.ByteBuffer;
import java.util.Iterator;
import java.util.LinkedList;

public class ResponseFindMatch extends BaseMsg {
    // define what to send
    BattleController battleController;
    Player[] players;
    int num;

    boolean isSwap;
    public ResponseFindMatch(Short error, BattleController battleController, boolean isSwap) {
        super(CmdDefine.FIND_MATCH,error);
        this.battleController = battleController;
        this.players = new Player[2];
        if(isSwap == false){
            for(int i = 0; i < 2; ++i){
                this.players[i] = battleController.getPlayers()[i];
            }
        }
        else{
            for(int i = 0; i < 2; ++i){
                this.players[i] = battleController.getPlayers()[1 - i];
            }
        }

        System.out.println("Response");

        this.isSwap = isSwap;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        if(battleController.getCurTick() <= 0){
            Player myself = players[0];
            // Lay thong tin doi thu
            Player opponent = players[1];

            PlayerInfo opponentInfo = opponent.getInfo();
            bf.putInt(opponentInfo.getAvatar());
            putStr(bf, opponentInfo.getName());
            System.out.println("Opponent name: " + String.valueOf(opponentInfo.getName()));
            bf.putInt(opponentInfo.getTrophy());

            // Gui loai system monster
            for(int i = 0; i < 20; ++i){
                for(int j = 0; j < 3; ++j){
                    bf.putInt(battleController.getSystemMonsterTypes()[i][j]);
                }
            }

            // Gui battle cards va map cua ban than va doi thu
            LinkedList<BattleObject>battleCards = myself.getBattleObjects();
            int cardNum = battleCards.size();
            bf.putInt(cardNum);
            for(int i = 0; i < 2; ++i){
                battleCards = players[i].getBattleObjects();
                Iterator<BattleObject>cardItr = battleCards.iterator();
                while(cardItr.hasNext()){
                    BattleObject object = cardItr.next();
                    putStr(bf, object.getBattleObjectId());
                    bf.putInt(object.getOrderId());
                }

                int[][] map = players[i].getMap().getNativeArr();
                for(int u = 0; u < ModelDefine.MAP_MAX_ROW; ++u){
                    for(int v = 0; v < ModelDefine.MAP_MAX_COLUMN; ++v){
                        bf.putInt(map[u][v]);
                        System.out.print(map[u][v]+" ");
                    }
                    System.out.println();
                }
                System.out.println();
            }
        }
        else{
            ResponseBattleStatus responseBattleStatus = new ResponseBattleStatus((short)0);
            bf = responseBattleStatus.getStatusByteBuffer(bf, battleController, isSwap);
        }
        return packBuffer(bf);
    }
}
