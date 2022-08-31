package model.Define;

import com.sun.javafx.collections.MappingChange;

import java.util.HashMap;
import java.util.Map;

public class CardDefine {
    // Card Object
    public static final short MONSTER_OBJECT = 1;
    public static final short TOWER_OBJECT = 2;
    public static final short SPELL_OBJECT = 3;

    public static final int[] OBJECT_IDS = new int[]{0, 1, 2, 3, 4 , 5 , 6 , 0, 1, 2, 3, 0, 0, 1, 2, 3, 4, 5};
    public static final short[] OBJECT_TYPES = new short[]{TOWER_OBJECT, TOWER_OBJECT, TOWER_OBJECT, TOWER_OBJECT, TOWER_OBJECT, TOWER_OBJECT, TOWER_OBJECT,
            MONSTER_OBJECT, MONSTER_OBJECT, MONSTER_OBJECT, MONSTER_OBJECT, MONSTER_OBJECT, SPELL_OBJECT, SPELL_OBJECT, SPELL_OBJECT, SPELL_OBJECT, SPELL_OBJECT, SPELL_OBJECT};
    public static final Map<String, Integer> TYPE_INDEX = new HashMap<String, Integer>() {{
        put("Tower", 0);
        put("Monster", 7);
        put("Spell", 12);
    }};
}
