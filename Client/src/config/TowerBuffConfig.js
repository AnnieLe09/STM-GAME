GC.SPELLTOWERBUFF = {};
GC.SPELLTOWERBUFF.ID = 3;

GC.TOWERBUFF = {};
GC.TOWERBUFF.ID = 1;
GC.TOWERBUFF.LIST = {
    "0": {
        "name": "cellDamage",
        "durationType": "unlimited",
        "effects": {
            "1":
                {
                    "name": "damageUp",
                    "type": "damageAdjustment",
                    "value": 0.25
                }

        }
    },
    "1": {
        "name": "cellAttackSpeed",
        "durationType": "unlimited",
        "effects": {
            "1":
                {
                    "name": "attackSpeedUp",
                    "type": "attackSpeedAdjustment",
                    "value": 0.25
                }

        }
    },
    "2": {
        "name": "cellRange",
        "durationType": "unlimited",
        "effects": {
            "1":
                {
                    "name": "rangeUp",
                    "type": "rangeAdjustment",
                    "value": 0.25
                }

        }
    },
    "3": {
        "name": "attackAura - goatAura",
        "durationType": "unlimited",
        "effects": {
            "1":
                {
                    "name": "damageUp",
                    "type": "damageAdjustment",
                    "value": 0.2
                },
            "2":
                {
                    "name": "damageUp",
                    "type": "damageAdjustment",
                    "value": 0.25
                },
            "3":
                {
                    "name": "damageUp",
                    "type": "damageAdjustment",
                    "value": 0.35
                }
        },
        "effectsUseCardLevel": true
    },
    "4": {
        "name": "attackSpeedAura - snakeAura",
        "durationType": "unlimited",
        "effects": {
            "1":
                {
                    "name": "attackSpeedUp",
                    "type": "attackSpeedAdjustment",
                    "value": 0.2
                },
            "2":
                {
                    "name": "attackSpeedUp",
                    "type": "attackSpeedAdjustment",
                    "value": 0.25
                },
            "3":
                {
                    "name": "attackSpeedUp",
                    "type": "attackSpeedAdjustment",
                    "value": 0.35
                },
        },
        "effectsUseCardLevel": true
    },
    "5": {
        "name": "icemanAbility",
        "durationType": "limited",
        "duration": {
            "1": 3000
        },
        "effects": {
            "1":
                {
                    "name": "frozen",
                    "type": "disable"
                }
        },
        "state": "frozen"
    },
    "6": {
        "name": "potionFrozen",
        "durationType": "limited",
        "duration": {
            "1": 2000
        },
        "durationUseCardLevel": true,
        "effects": {
            "1":
                {
                    "name": "frozen",
                    "type": "disable"
                }
        },
        "state": "frozen"
    }
}