package cmd.send.demo.shop;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseRequestShopCardBuying extends BaseMsg {
    int id;

    public ResponseRequestShopCardBuying(Short error,int id) {
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