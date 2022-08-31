CARD_PATH = "Assets/card/";
EXT = ".png";

TOWER_ANIMATION_PATH = "Assets/tower/plistFrame/"
TOWER_FRAME_PATH = "Assets/tower/Frame/"

GC.TOWER = {
    TICK_ACTIVE: 60,
    CLASS: Tower,
    TYPES:{
        DAMAGE: 1,
        MAGIC: 2,
        SUPPORT: 3
    },
    TARGETS:{
        WALKER: 1,
        FLYER: 2,
        TOWER: 3
    },
    DAMAGE_TYPES:{
        UNIQUE: {
            VALUE: 1,
            TEXT: "Đơn"
        },
        SPREAD: {
            VALUE: 2,
            TEXT: "Lan"
        },
        SUPPORT: {
            VALUE: 3,
            TEXT: "Hỗ trợ"
        }
    },
    BULLET_TYPES:{
        NONE: 1,
        CHASING: 2,
        POSITION: 3,
        BOOMERANG: 4,

    },
    BULLET_CLASS: [CannonBulletUI,WizardBulletUI,BoomerangBulletUI,OilBulletUI,IceBulletUI,null,null],
    EFFECT_TYPES:{
        DAMAGE: 1,
        TOWER_LEVEL: 2
    }
};
GC.TOWER.MIN_LEVEL = 1;
GC.TOWER.MAX_LEVEL = 10;
/*GC.TOWER.CANNON = {
    AVATAR: "card_tower_cannon",
    EVOLUTION_NUM: 3,
    EVOLUTION_PATH: "miniature_tower_cannon_",
    NAME: "Pháo Cú",
    TYPE: GC.TOWER.TYPES.DAMAGE,
    TARGETS: [GC.TOWER.TARGETS.WALKER, GC.TOWER.TARGETS.FLYER],
    DAMAGE_TYPE_ID: GC.TOWER.DAMAGE_TYPES.UNIQUE,
    BULLET_TYPE: GC.TOWER.BULLET_TYPES.TARGET,
    REQUIRED_ENERGY: 8,
    EFFECT_TYPE: GC.TOWER.EFFECT_TYPES.DAMAGE,
    DISPLAYED_ATTRIBUTES: ["DAMAGE", "ATTACK_SPEED", "ATTACK_RANGE", "DAMAGE_TYPE"],
    ATTRIBUTES_DICTIONARY: {
        DAMAGE: "Sát Thương",
        ATTACK_SPEED: "Tốc Bắn",
        ATTACK_RANGE: "Tầm Bắn",
        DAMAGE_TYPE: "Loại Bắn"
    }
};
GC.TOWER.CANNON.EVOLUTION = [
    {
        DAMAGE: 10,
        ATTACK_SPEED:0.6,
        ATTACK_RANGE: 1.5,
        BULLET_RANGE: 0,
        BULLET_SPEED: 50,
        BUILD_TIME: 1,
        BK: 1,
        DAMAGE_TYPE: GC.TOWER.CANNON.DAMAGE_TYPE_ID.TEXT,
        
    },
    {
        DAMAGE: 15,
        ATTACK_SPEED:0.5,
        ATTACK_RANGE: 1.7,
        BULLET_RANGE: 0,
        BULLET_SPEED: 50,
        BUILD_TIME: 1,
        BK: 1,
        DAMAGE_TYPE:GC.TOWER.CANNON.DAMAGE_TYPE_ID.TEXT,
    },
    {
        DAMAGE: 30,
        ATTACK_SPEED:0.4,
        ATTACK_RANGE: 2,
        BULLET_RANGE: 0,
        BULLET_SPEED: 50,
        BUILD_TIME: 1,
        BK: 1,
        DAMAGE_TYPE: GC.TOWER.CANNON.DAMAGE_TYPE_ID.TEXT,
    },
];*/
GC.TOWER.LIST = {
    "0": {
        "name": "Pháo Cú",
        "archetype": GC.TOWER.TYPES.DAMAGE,
        "targetType": [GC.TOWER.TARGETS.WALKER, GC.TOWER.TARGETS.FLYER],
        "bulletType": GC.TOWER.BULLET_TYPES.CHASING,
        "bulletTargetBuffType": -1,
        "energy": 8,
        //"attackAnimationTime": 360,
        //"shootAnimationTime": 20,
        "attackAnimationTime": 594,
        "shootAnimationTime": 33,
        "stat": {
          "1": {
            "damage": 10.0,
            "attackSpeed": 600,
            "range": 1.5,
            "bulletRadius": 0.0,
            "bulletSpeed": 50,
            "attackType": GC.TOWER.DAMAGE_TYPES.UNIQUE.TEXT
          },
          "2": {
            "damage": 15.0,
            "attackSpeed": 500,
            "range": 1.7,
            "bulletRadius": 0.0,
            "bulletSpeed": 50,
            "attackType": GC.TOWER.DAMAGE_TYPES.UNIQUE.TEXT
          },
          "3": {
            "damage": 30.0,
            "attackSpeed": 400,
            "range": 2.0,
            "bulletRadius": 0.0,
            "bulletSpeed": 50,
            "attackType": GC.TOWER.DAMAGE_TYPES.UNIQUE.TEXT
          }
        },

        "multiScale": 4,
        "dirNum": 9,
        "animPlist": "tower_cannon",
        "animDirAttackNum": 9,
        "animDirIdleNum": 15,
        "bulletAvatar": "cannon_1_2/tower_cannon_bullet_0000.png",
        "avatar": "card_tower_cannon.png",
        "statPath": "miniature_tower_cannon_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.UNIQUE,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }    
        ],
      },

    "1": {
        "name": "Quạ Pháp Sư",
        "archetype": GC.TOWER.TYPES.DAMAGE,
        "targetType": [GC.TOWER.TARGETS.WALKER],
        "bulletType": GC.TOWER.BULLET_TYPES.POSITION,
        "bulletTargetBuffType": -1,
        "energy": 12,
        "attackAnimationTime": 594,
        "shootAnimationTime": 231,
        //"attackAnimationTime": 594,
        //"shootAnimationTime": 231,
        "stat": {
            "1": {
                "damage": 5.0,
                "attackSpeed": 2200,
                "range": 1.5,
                "bulletRadius": 1.0,
                "bulletSpeed": 30,
                "attackType": GC.TOWER.DAMAGE_TYPES.SPREAD.TEXT
            },
            "2": {
                "damage": 8.0,
                "attackSpeed": 2000,
                "range": 1.7,
                "bulletRadius": 1.0,
                "bulletSpeed": 30,
                "attackType": GC.TOWER.DAMAGE_TYPES.SPREAD.TEXT
            },
            "3": {
                "damage": 20.0,
                "attackSpeed": 1800,
                "range": 2.0,
                "bulletRadius": 1.0,
                "bulletSpeed": 30,
                "attackType": GC.TOWER.DAMAGE_TYPES.SPREAD.TEXT
            }
        },
        "multiScale": 6,
        "dirNum": 9,
        "animPlist": "tower_wizard",
        "animDirAttackNum": 9,
        "animDirIdleNum": 15,
        "bulletAvatar": "wizard_1_2/tower_wizard_bullet_0000.png",
        "avatar": "card_tower_wizard.png",
        "statPath": "miniature_tower_wizard_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.SPREAD,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],
    },

    "2": {
        "name": "ếch - boomerang",
        "archetype": GC.TOWER.TYPES.DAMAGE,
        "targetType": [GC.TOWER.TARGETS.WALKER, GC.TOWER.TARGETS.FLYER],
        "bulletType": GC.TOWER.BULLET_TYPES.BOOMERANG,
        "bulletTargetBuffType": -1,
        "energy": 10,
        "attackAnimationTime": 726,
        "shootAnimationTime": 231,
        "stat": {
            "1": {
                "damage": 3.0,
                "attackSpeed": 1500,
                "range": 2.0,
                "bulletRadius": 0.0,
                "bulletSpeed": 30
            },
            "2": {
                "damage": 5.0,
                "attackSpeed": 1300,
                "range": 2.3,
                "bulletRadius": 0.0,
                "bulletSpeed": 30
            },
            "3": {
                "damage": 8.0,
                "attackSpeed": 1000,
                "range": 2.8,
                "bulletRadius": 0.0,
                "bulletSpeed": 30
            }
        },
        "multiScale": 4,
        "dirNum": 9,
        "animPlist": "tower_boomerang",
        "animDirAttackNum": 11,
        "animDirIdleNum": 14,
        "bulletAvatar": "boomerang_1_2/tower_boomerang_bullet_1_0000.png",
        "avatar": "card_tower_boomerang.png",
        "statPath": "miniature_tower_boomerang_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.UNIQUE,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],
    },

    "3": {
        "name": "Thỏ Xả Nhớt",
        "archetype": GC.TOWER.TYPES.MAGIC,
        "targetType": [GC.TOWER.TARGETS.WALKER, GC.TOWER.TARGETS.FLYER],
        "bulletType": GC.TOWER.BULLET_TYPES.CHASING,
        "bulletTargetBuffType": 0,
        "energy": 12,
        "attackAnimationTime": 726,
        "shootAnimationTime": 297,
        //"attackAnimationTime": 726,
        //"shootAnimationTime": 297,
        "stat": {
            "1": {
                "damage": 0.0,
                "attackSpeed": 2000,
                "range": 1.5,
                "bulletRadius": 0.6,
                "bulletSpeed": 40
            },
            "2": {
                "damage": 0.0,
                "attackSpeed": 1800,
                "range": 1.6,
                "bulletRadius": 0.8,
                "bulletSpeed": 40
            },
            "3": {
                "damage": 0.0,
                "attackSpeed": 1600,
                "range": 1.7,
                "bulletRadius": 1.0,
                "bulletSpeed": 40
            }
        },
        "multiScale": 5,
        "dirNum": 9,
        "animPlist": "tower_oil_gun",
        "animDirAttackNum": 11,
        "animDirIdleNum": 14,
        "imageBullet": 0,
        "bulletAvatar": "oil_gun_1_2/tower_oil_gun_bullet_0003.png",
        "avatar": "card_tower_oil_gun.png",
        "statPath": "miniature_tower_oil_gun_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.SPREAD,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],
    },
    "4": {
        "name": "Gấu Bắc Cực",
        "archetype": GC.TOWER.TYPES.MAGIC,
        "targetType": [GC.TOWER.TARGETS.WALKER, GC.TOWER.TARGETS.FLYER],
        "bulletType": GC.TOWER.BULLET_TYPES.CHASING,
        "bulletTargetBuffType": 1,
        "energy": 10,
        "attackAnimationTime": 660,
        "shootAnimationTime": 33,
        "stat": {
            "1": {
                "damage": 0.0,
                "attackSpeed": 3400,
                "range": 1.8,
                "bulletRadius": 0.0,
                "bulletSpeed": 60
            },
            "2": {
                "damage": 0.0,
                "attackSpeed": 3200,
                "range": 2.0,
                "bulletRadius": 0.0,
                "bulletSpeed": 60
            },
            "3": {
                "damage": 0.0,
                "attackSpeed": 3000,
                "range": 2.2,
                "bulletRadius": 0.0,
                "bulletSpeed": 60
            }
        },
        "multiScale": 4,
        "dirNum": 9,
        "animPlist": "tower_ice_gun",
        "animDirAttackNum": 10,
        "animDirIdleNum": 14,
        "imageBullet": 0,
        "bulletAvatar": "ice_gun_1_2/tower_ice_gun_bullet_0000.png",
        "avatar": "card_tower_ice_gun.png",
        "statPath": "miniature_tower_ice_gun_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.SPREAD,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],
    },
    "5": {
        "name": "Dê phát động",
        "archetype": GC.TOWER.TYPES.SUPPORT,
        "targetType": [GC.TOWER.TARGETS.TOWER],
        "bulletType": GC.TOWER.BULLET_TYPES.NONE,
        "auraTowerBuffType": 3,
        "energy": 12,
        "attackAnimationTime": 300,
        "shootAnimationTime": 0,
        "stat": {
            "1": {
                "range": 1.2
            },
            "2": {
                "range": 1.8
            },
            "3": {
                "range": 2.5
            }
        },
        "multiScale": 5,
        "dirNum": 1,
        "animPlist": "tower_damage",
        "animDirAttackNum": 15,
        "animDirIdleNum": 17,
        "avatar": "card_tower_damage.png",
        "statPath": "miniature_tower_damage_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.UNIQUE,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],
    },

    "6": {
        "name": "Rắn tóc đỏ",
        "archetype": GC.TOWER.TYPES.SUPPORT,
        "targetType": [GC.TOWER.TARGETS.TOWER],
        "bulletType": GC.TOWER.BULLET_TYPES.NONE,
        "auraTowerBuffType": 4,
        "energy": 12,
        "attackAnimationTime": 300,
        "shootAnimationTime": 0,
        "stat": {
            "1": {
                "range": 1.2
            },
            "2": {
                "range": 1.8
            },
            "3": {
                "range": 2.5
            }
        },
        "multiScale": 5,
        "dirNum": 1,
        "animPlist": "tower_attack_speed",
        "animDirAttackNum": 16,
        "animDirIdleNum": 16,
        "avatar": "card_tower_attack_speed.png",
        "statPath": "miniature_tower_attack_speed_",
        "attackTypeId": GC.TOWER.DAMAGE_TYPES.UNIQUE,
        "effectType": GC.TOWER.EFFECT_TYPES.DAMAGE,
        "displayFields": [
            {
                "damage": "Sát thương"
            },
            {
                "attackSpeed": "Tốc bắn"
            },
            {
                "range": "Tầm bắn"
            },
            {
                "attackType": "Loại bắn"
            }
        ],


    }

}