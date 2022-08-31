GC.CARD = {
    HEIGHT: 130,
    WIDTH: 87,
    NAMES: ["0","1","2","3","4","5","6","0","1","2","3","0",    "0","1","2","3","4","5"],
    TYPES: ["TOWER","TOWER","TOWER","TOWER","TOWER","TOWER","TOWER","MONSTER","MONSTER","MONSTER","MONSTER","MONSTER","SPELL", "SPELL", "SPELL", "SPELL", "SPELL", "SPELL"],
    STATS:  [1, 2, 4],
    MAX_LEVEL: 10
};
GC.CARD_INFO = {
    Z_ORDER: 20,
    ICON_PATH: "Assets/card/stat_icon/stat_icon_",
    ICON:{
        "damage": "damage.png", 
        "attackSpeed": "attack_speed.png", 
        "range": "range.png", 
        "attackType": "bullet_radius.png"
    }
};
GC.CARD.LEVELS = {
    "2": {
      "fragments": 5,
      "gold": 5
    },
    "3": {
      "fragments": 10,
      "gold": 10
    },
    "4": {
      "fragments": 20,
      "gold": 20
    },
    "5": {
      "fragments": 50,
      "gold": 50
    },
    "6": {
      "fragments": 100,
      "gold": 100
    },
    "7": {
      "fragments": 200,
      "gold": 200
    },
    "8": {
      "fragments": 300,
      "gold": 300
    },
    "9": {
      "fragments": 400,
      "gold": 400
    },
    "10": {
      "fragments": 500,
      "gold": 500
    }
};