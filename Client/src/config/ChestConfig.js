GC.CHEST = {
    NUM: 4,
    STATUS:{
        EMPTY: 0,
        WAITING: 1,
        OPENING: 2,
        FINISHED: 3,
        SHOP: 4,
    },
    HEIGHT: 120,
    WIDTH: 94,
    MARGIN: 10,
    SECOND_PER_COIN: 600
};
GC.CHEST.TREASURES = {
    "0": {
        "name": "Rương Gỗ",
        "rewards": [
            {
                "minGold": 10,
                "maxGold": 20,
                "minFragment": 10,
                "maxFragment": 20,
                "cardSlots": 2
            }
        ],
        "unlockDuration": 10800,
        "image": "Assets/lobby/treasure/common_treasure_tutorial.png",
        "anim": "Assets/lobby/treasure/fx/fx_chest_lv1"
    }
};