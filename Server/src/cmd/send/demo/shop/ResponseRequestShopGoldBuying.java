package cmd.send.demo.shop;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestShopGoldBuying extends BaseMsg {
    int id;

    public ResponseRequestShopGoldBuying(Short error,int id) {
        super(CmdDefine.SHOP_CARD_BUYING,error);
        this.id = id;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(id);
        return packBuffer(bf);
    }
}