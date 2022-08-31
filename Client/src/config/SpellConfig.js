SPELL_PATH = "Assets/potion/";
GC.SPELL = {
    CLASS: Spell
}
GC.SPELL.LIST = {
    "0": {
        "name": "Cầu Lửa",
        "energy": 8,
        "map": 0,
        "action": {
            "type": "instant"
        },
        "radius": 1.2,
        "adjust": {
            "player": {
                "type": "damage",
                "value": 50
            }
        },
        "adjustUseCardLevel": true,
        "statPath": "card_potion_fireball",
        "animPath": SPELL_PATH + "effect_atk_fire",
        "animArr": ["animation_bottom"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "damage": "50",
                "range": "0.8"
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_fireball.png",
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "range": "Khoảng tác dụng"
            }
        ],
        "range": 0.8
    },
    "1": {
        "name": "Đóng Băng",
        "energy": 8,
        "map": 0,
        "action": {
            "type": "instant"
        },
        "radius": 1.2,
        "adjust": {
            "player": {
                "type": "targetBuffType",
                "value": 2
            },
            "enemy": {
                "type": "towerBuffType",
                "value": 6
            }
        },
        "statPath": "card_potion_frozen",
        "animPath": SPELL_PATH + "effect_atk_ice",
        "animArr": ["animation_bottom"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "effectTime": "5s",
                "range": "0.8"
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_frozen.png",
        "displayFields": [
            {
                "effectTime": "Thời gian tác dụng"
            },
            {
                "range": "Khoảng tác dụng"
            }
        ],
        "range": 0.8
    },
    "2": {
        "name": "Hồi máu",
        "energy": 12,
        "map": 1,
        "action": {
            "type": "field",
            "durationType": "limited",
            "duration": 3000,
            "radius": 2.0
        },
        "adjust": {
            "enemy": {
                "type": "targetBuffType",
                "value": 3
            }
        },
        "hp": 2,
        "frequency": 0.1,
        "statPath": "card_potion_heal",
        "animPath": SPELL_PATH + "effect_buff_heal",
        "animArr": ["animation_full"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "hpHeal": "2 máu / 0.1 s",
                "effectTime": "4s",
                "existTime": "3s"
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_heal.png",
        "displayFields": [
            {
                "hpHeal": "Hồi máu"
            },
            {
                "effectTime": "Thời gian tác dụng"
            },
            {
                "existTime": "Thời gian tồn tại"
            }
        ],
        "range": 0.8
    },
    "3": {
        "name": "Tăng tốc",
        "energy": 12,
        "map": 1,
        "action": {
            "type": "field",
            "durationType": "limited",
            "duration": 3000,
            "radius": 2.0
        },
        "adjust": {
            "enemy": {
                "type": "targetBuffType",
                "value": 4
            }
        },
        "statPath": "card_potion_speed_up",
        "animPath": SPELL_PATH + "effect_buff_speed",
        "animArr": ["animation_full"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "hpHeal": "2 máu / 0.1 s",
                "effectTime": "4s",
                "existTime": "3s"
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_speed_up.png",
        "displayFields": [
            {
                "hpHeal": "Hồi máu"
            },
            {
                "effectTime": "Thời gian tác dụng"
            },
            {
                "existTime": "Thời gian tồn tại"
            }
        ],
        "range": 0.8
    },
    "4": {
        "name": "Lò xo",
        "energy": 6,
        "map": 0,
        "action": {
            "type": "field",
            "durationType": "unlimited",
            "duration": -1,
            "radius": 2.0
        },
        "adjust": {
            "enemy": {
                "type": "targetBuffType",
                "value": -1
            }
        },
        "statPath": "card_potion_trap",
        "animPath": SPELL_PATH + "fx_trap/",
        "animArr": ["animation_full"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "range": "0.2",
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_trap.png",
        "displayFields": [
            {
                "range": "Vùng tác dụng"
            }
        ],
        "range": 0.2
    },
    "5": {
        "name": "Sức mạnh",
        "energy": 10,
        "map": 0,
        "action": {
            "type": "field",
            "durationType": "limited",
            "duration": 3000,
            "radius": 2.0
        },
        "adjust": {
            "enemy": {
                "type": "targetBuffType",
                "value": 1.5
            }
        },
        "statPath": "card_potion_power",
        "animPath": SPELL_PATH + "tower_strength_fx",
        "animArr": ["attack_1"],
        "animWidth": 287,
        "animHeight": 287,
        "stat": {
            "1": {
                "damageDelta": "150%",
                "effectTime": "1.5s"
            },
            "2": {

            },
            "3": {

            }
        },
        "avatar": "card_potion_power.png",
        "displayFields": [
            {
                "damageDelta": "Sát thương"
            },
            {
                "effectTime": "Thời gian tác dụng"
            },
        ],
        "range": 0.6
    }

}