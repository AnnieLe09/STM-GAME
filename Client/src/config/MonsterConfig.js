GC.MONSTER = {};
GC.MONSTER = {
    "multiplier": {
        "1": {
          "hp": 1,
          "numberMonsters": 1
        },
        "2": {
          "hp": 5,
          "numberMonsters": 2
        },
        "3": {
          "hp": 10,
          "numberMonsters": 3
        },
        "4": {
          "hp": 10,
          "numberMonsters": 4
        },
        "5": {
          "hp": 20,
          "numberMonsters": 5
        },
        "6": {
          "hp": 20,
          "numberMonsters": 6
        },
        "7": {
          "hp": 30,
          "numberMonsters": 7
        }
      },
      "monster": {
        "0": {
          "name": "swordsman",
          "category": "normal",
          "class": "land",
          "hp": 18,
          "speed": 0.8,
          "hitRadius": 0.2,
          "weight": 30,
          "ability": -1,
          "energy": 1,
          "gainEnergy": 1,
          "numberMonsters": 3,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2,

          "avatar": "card_monster_swordsman.png",
          "statPath": "miniature_monster_swordsman",
          "stat": {
            "1": {
                "hp": "18",
                "speed": "0.8",
                "number": "1"
            },
            "2": {

            },
            "3": {

            }
            },
            "displayFields": [
                {
                    "hp": "Máu"
                },
                {
                    "speed": "Tốc chạy"
                },
                {
                    "number": "Số lượng"
                }
                ],
        },

        "1": {
          "name": "assassin",
          "category": "normal",
          "class": "land",
          "hp": 12,
          "speed": 1.4,
          "hitRadius": 0.15,
          "weight": 15,
          "ability": -1,
          "energy": 1,
          "gainEnergy": 1,
          "numberMonsters": 3,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2,

          "avatar": "card_monster_assassin.png",
          "statPath": "miniature_monster_assassin",
          "stat": {
            "1": {
                "hp": "12",
                "speed": "1.4",
                "number": "1"
            },
            "2": {

            },
            "3": {

            }
            },
            "displayFields": [
                {
                    "hp": "Máu"
                },
                {
                    "speed": "Tốc chạy"
                },
                {
                    "number": "Số lượng"
                }
                ],
        },
        "2": {
          "name": "giant",
          "category": "normal",
          "class": "land",
          "hp": 82,
          "speed": 0.5,
          "hitRadius": 0.5,
          "weight": 200,
          "ability": -1,
          "energy": 1,
          "gainEnergy": 3,
          "numberMonsters": 1,
          "delay_per_frame": 0.1,
          "collisionRadius": 0.2,

          "avatar": "card_monster_giant.png",
          "statPath": "miniature_monster_giant",
          "stat": {
            "1": {
                "hp": "82",
                "speed": "0.5",
                "number": "1"
            },
            "2": {

            },
            "3": {

            }
            },
            "displayFields": [
                {
                    "hp": "Máu"
                },
                {
                    "speed": "Tốc chạy"
                },
                {
                    "number": "Số lượng"
                }
                ],
        },

        "3": {
          "name": "bat",
          "category": "normal",
          "class": "aerial",
          "hp": 14,
          "speed": 1,
          "hitRadius": 0.2,
          "weight": 25,
          "ability": -1,
          "energy": 1,
          "gainEnergy": 2,
          "numberMonsters": 3,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2,

          "avatar": "card_monster_bat.png",
          "statPath": "miniature_monster_bat",
          "stat": {
            "1": {
                "hp": "14",
                "speed": "1",
                "number": "1"
            },
            "2": {

            },
            "3": {

            }
            },
            "displayFields": [
                {
                    "hp": "Máu"
                },
                {
                    "speed": "Tốc chạy"
                },
                {
                    "number": "Số lượng"
                }
                ],
        },

        "4": {
          "name": "ninja",
          "category": "normal",
          "class": "land",
          "hp": 30,
          "speed": 0.2,
          "hitRadius": 0.2,
          "weight": 30,
          "ability": 0,
          "energy": 1,
          "gainEnergy": 1,
          "numberMonsters": 3,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "5": {
          "name": "darkGiant",
          "category": "boss",
          "class": "land",
          "hp": 800,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 500,
          "ability": -1,
          "gainEnergy": 15,
          "priority": true,
          "delay_per_frame": 0.1,
          "collisionRadius": 0.2
        },
        "6": {
          "name": "satyr",
          "category": "boss",
          "class": "land",
          "hp": 400,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 300,
          "ability": 1,
          "gainEnergy": 15,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "7": {
          "name": "desertKing",
          "category": "boss",
          "class": "land",
          "hp": 300,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 300,
          "ability": 2,
          "gainEnergy": 15,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "8": {
          "name": "iceman",
          "category": "boss",
          "class": "land",
          "hp": 400,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 400,
          "ability": 3,
          "gainEnergy": 15,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "9": {
          "name": "golem",
          "category": "boss",
          "class": "land",
          "hp": 500,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 600,
          "ability": 4,
          "gainEnergy": 15,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "10": {
          "name": "golemMinion",
          "category": "minion",
          "class": "land",
          "hp": 50,
          "speed": 0.2,
          "hitRadius": 0.3,
          "weight": 100,
          "ability": -1,
          "gainEnergy": 2,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "11": {
          "name": "demonTree",
          "category": "boss",
          "class": "land",
          "hp": 400,
          "speed": 0.125,
          "hitRadius": 0.65,
          "weight": 400,
          "ability": 5,
          "gainEnergy": 15,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        },
        "12": {
          "name": "demonTreeMinion",
          "category": "minion",
          "class": "land",
          "hp": 30,
          "speed": 0.3,
          "hitRadius": 0.2,
          "weight": 50,
          "ability": -1,
          "gainEnergy": 2,
          "delay_per_frame": 0.05,
          "collisionRadius": 0.2
        }
    }
};

GC.MONSTER.GENERATION = {
  ROUND: {
    "1": {
      "monster_type": [0],
      "rate": [1]
    },
    "2": {
      "monster_type": [1],
      "rate": [1]
    },
    "3": {
      "monster_type": [1],
      "rate": [1]
    },
    "4": {
      "monster_type": [1,1],
      "rate": [0.2,0.8]
    },
    "5": {
      "monster_type": [3],
      "rate": [1]
    },
    "6": {
      "monster_type": [1,1],
      "rate": [0.5,0.5]
    },
    "7": {
      "monster_type": [2],
      "rate": [1]
    },
    "8": {
      "monster_type": [2,1],
      "rate": [0.5,0.75]
    },
    "9": {
      "monster_type": [2,1],
      "rate": [0.8,0.4]
    },
    "10": {
      "monster_type": [3],
      "rate": [1]
    },
    "11": {
      "monster_type": [1,1,1],
      "rate": [0.5,0.5,0.5]
    },
    "12": {
      "monster_type": [1,1,1],
      "rate": [0.75,0.5,0.5]
    },
    "13": {
      "monster_type": [1,1,2],
      "rate": [0.75,0.5,0.2]
    },
    "14": {
      "monster_type": [1,1,2],
      "rate": [0.75,0.5,0.5]
    },
    "15": {
      "monster_type": [3,1],
      "rate": [1,1]
    },
    "16": {
      "monster_type": [1,1],
      "rate": [1,1]
    },
    "17": {
      "monster_type": [1,2],
      "rate": [1,1]
    },
    "18": {
      "monster_type": [1,1,1],
      "rate": [1,1,0.5]
    },
    "19": {
      "monster_type": [1,1,2],
      "rate": [1,1,1]
    },
    "20": {
      "monster_type": [3,1,2],
      "rate": [1,1,1]
    }
  },

  BASE: {
	"0": 3,
	"1": 3,
	"2": 1,
	"3": 3
  },

  MULTIPLIER: {
	"0": {
		"hp": 1,
		"monster": 1
	  },
	  "1": {
		"hp": 5,
		"monster": 2
	  },
	  "2": {
		"hp": 10,
		"monster": 3
	  },
	  "3": {
		"hp": 10,
		"monster": 4
	  },
	  "4": {
		"hp": 20,
		"monster": 5
	  },
	  "5": {
		"hp": 20,
		"monster": 6
	  },
	  "6": {
		"hp": 30,
		"monster": 7
	  }
	}
}
  

GC.MONSTER.DIRECTION = {
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    TOP_RIGHT: 3,
    BOTTOM_RIGHT: 4,

    LEFT: 5,
    TOP_LEFT: 6,
    BOTTOM_LEFT: 7,
}
GC.MONSTER.STATUS = {
  NORMAL: 0,
  COLLISION: 1,
  WAITING: 2,
  FLYING: 3,
  PASSING: 4
}