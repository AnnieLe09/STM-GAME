package model.Define;

import util.supportClass.Pos;
import util.vector.VecInt;

public class ModelDefine {

    //Model
    public static final long MODEL_SOCIAL_ID = 154582707200165253L;
    public static final int MODEL_ID_CONTROLLER = 1 ;
    public static final int MODEL_SHOP = 2 ;
    public static final int MODEL_BATTLE_OBJECT_FACTORY = 3;
    public static final int MODEL_BATTLE_CONTROLLER_GENERAL = 4;

    private ModelDefine() {

    }
    // Max int
    public static final int MAX_INT = 1000000007;
    // VECINT_NULL
    public static final VecInt VECINT_NULL = new VecInt(MAX_INT,MAX_INT);

    // POS_NULL
    public static final Pos POS_NULL = new Pos(MAX_INT,MAX_INT,MAX_INT);

    // Direction of monster
    public static final int DIR_SELF = -1;
    public static final int DIR_UP = 0;
    public static final int DIR_DOWN = 1;
    public static final int DIR_RIGHT = 2;
    public static final int DIR_TOP_RIGHT = 3;
    public static final int DIR_BOTTOM_RIGHT = 4;
    public static final int DIR_LEFT = 5;
    public static final int DIR_TOP_LEFT = 6;
    public static final int DIR_BOTTOM_LEFT = 7;
    public static final int DIR_NULL = -100;

    // Delta Dir Cell
    public static final VecInt DELTA_UP = new VecInt(-1,0);
    public static final VecInt DELTA_LEFT = new VecInt(0,-1);
    public static final VecInt DELTA_DOWN = new VecInt(1,0);
    public static final VecInt DELTA_RIGHT = new VecInt(0,1);
    public static final VecInt DELTA_SELF = new VecInt(0,0);

    // Delta Dir POS


    // Card
    public static final short CARD_MAX_EVOLUTION = 3;

    // Chest
    public static final String[] chest_Name = {"0.jbk;"};

    //Buff
    public static final short BUFF_TOWERBUFF = 1;
    public static final short BUFF_TARGETBUFF = 2;
    public static final short BUFF_SPELLTOWERBUFF = 3;
    // Map
    public static final short MAP_MAX_ROW = 6;
    public static final short MAP_MAX_COLUMN = 8;

    public static final short MAP_PUT_TOWER = -4;
    public static final short MAP_AMOUNT_BUFF_CELL = 3;
    public static final short MAP_NORMAL_CELL = 0;
    public static final short MAP_BUFF_CELL = 10;
    public static final short MAP_TREE_CELL = -10;
    public static final short MAP_HOLE_CELL = -100;

    public static final short MAP_TREE = -10;
    public static final short MAP_HOLE = -20;
    public static final short MAP_MAX_TREE = 2;
    public static final short MAP_MAX_HOLE = 1;

    public static final short MAP_TOWER = -5;

    // Cell
    public static final short CELL_OBSTACLE_NONE = 0;
    public static final short CELL_OBSTACLE_TREE = 1;
    public static final short CELL_OBSTACLE_HOLE = 2;
    public static final short CELL_OBSTACLE_TOWER = 3;
    public static final short CELL_OBSTACLE_OUT = 4;

    public static final short CELL_BUFF_NONE = 0;
    public static final short CELL_BUFF_DAMAGE = 1;
    public static final short CELL_BUFF_ATTACK_SPEED = 2;
    public static final short CELL_BUFF_RANGE= 3;
    //PLAYGAME
    public static final Pos MONSTER_START_POS = new Pos(0.5,1.0);
    public static final Pos MONSTER_END_POS = new Pos((double) MAP_MAX_ROW - 0.5,
            (double) MAP_MAX_COLUMN - 1);
    public static final VecInt MONSTER_START_CELL = new VecInt(0,0);
    public static final VecInt MONSTER_END_CELL = new VecInt(MAP_MAX_ROW - 1,MAP_MAX_COLUMN - 1);
    public static final int MONSTER_START_DIR = DIR_LEFT;
    public static final int START_HP = 20;
    public static final int START_ENERGY = 15;
    public static final int NORMAL_MONSTER_DAMAGE_HP = 1;
    public static final int BOSS_MONSTER_DAMAGE_HP = 5;
    public static final int ENERGY_PER_HP = 10;
    public static final int TICK_PER_TOWER_ACTIVE = 60;
    public static final int amountCardInHand = 4;
    public static final int amountFirstTowerInHand = 2;

    public static final long TIME_PER_ROUND = 20;
    public static final long AMOUNT_ROUND = 20;
    public static final long MAX_TIME_FOR_MATCH = 1000L*TIME_PER_ROUND*AMOUNT_ROUND*2;
    public static final int UP_TROPHY_WHEN_END_GAME = 10;

    //Time
    public static final int TICK_PER_SECOND = 60;
    public static final double SECOND_PER_TICK = 1.0/ TICK_PER_SECOND;
    public static final int TICK_PER_MONSTER = 60;
    public static final int MIN_TIME_SUMMON_BOT_NEXT = 1000;
    public static final int MAX_TIME_SUMMON_BOT_NEXT = 3000;

    //Shop
    public static final int LoginItemSlot = 3;

    //FindMatch
    public static final int FINDMATCH_MAX_WAITING = 4;
    public static final int FINDMATCH_TROPHY_DIFFERENT  = 100;
    public static final int FINDMATCH_START_FLAG = 9000;
    public static final int FINDMATCH_WAITING_FLAG = 9001;
    public static final long FINDMATCH_TIME_TOTAL_WAITING = 60000;
    public static final long FINDMATCH_TIME_STEP_WAITING = 5000;


    // ERROR
    public static final int ERROR_PLAYER_NULL = -1;
    //Bullet
    public static final int BULLET_TYPE_CHASING = 1;
    public static final int BULLET_TYPE_POSITION = 2;
    //Tower
    public static final int TOWER_MAX_STAT = 3;
    //Time


    public static final int BOSS_ATTACK_NORMAL= 0;
    public static final int BOSS_ATTACK_ONLY= 1;
    public static final int BOSS_ATTACK_NO_ATTACK= 2;

    public static final int BOSS_SKILL_NO_SKILL = 0;
    public static final int BOSS_SKILL_DEMON_TREE = 1;
    public static final int BOSS_SKILL_DESERT_KING = 2;
    public static final int BOSS_SKILL_ICE_MAN = 3;
    public static final int BOSS_SKILL_GOLEM = 4;
    public static final int BOSS_SKILL_MOC_TINH = 5;

    public static final double BOSS_DEMON_TREE_HP_RATE = 0.03;
    public static final int BOSS_DEMON_TREE_RANGE = 2;

    public static final int BOSS_MOC_TINH_MAX_MINION = 5;
    public static final int BOSS_MOC_TINH_TIME_TO_RELEASE = 120;
}

