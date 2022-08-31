GC.MAP = {
    WIDTH: 8,
    HEIGHT: 6,
    MAX_NUM_TREE: 2,
    MAX_NUM_HOLE: 1,
    TREE: -10,
    HOLE: -20,
    OUT: -1,
    
    P_WIDTH: 539,
    P_HEIGHT: 385,
};

const BUFF = {
    NO_BUFF: 0,
    DAMAGE: 1,
    ATTACK_SPEED: 2,
    RANGE: 3,
}

const OBSTACLE = {
    NO_OBSTACLE: 0,
    TREE: 1,
    HOLE: 2,
    TOWER: 3,
    OUT: 4,
}

GC.MAP.CELL = {
    P_WIDTH: 77,
    P_HEIGHT: 77,
    BUFF: {
        DAME: 1,
        SPEED: 2,
        RANGE: 3,
    },
    REMAINDER: 91 - 77,
};

GC.MAP.CELL.RELATIVE = {
    TREE: {
        X: 0.1,
        Y: 0.3,
    },
    HOLE: {
        X: 0,
        Y: 0.23,
    }
}