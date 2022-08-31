package model.Define;

import util.vector.VecInt;

public class MonsterDefine {
    public static final VecInt START_CELL = new VecInt(0,0);
    public static final VecInt END_CELL = new VecInt(MapDefine.HEIGHT - 1,MapDefine.WIDTH - 1);
    public static final int NORMAL_STATUS = 0;
    public static final int COLLISION_STATUS = 1;
    public static final int WAITING_STATUS = 2;
    public static final int FLYING_STATUS = 3;
    public static final int PASSING_STATUS = 4;
}
