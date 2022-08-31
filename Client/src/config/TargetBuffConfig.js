GC.TARGETBUFF = {};
GC.TARGETBUFF.ID = 2;

GC.TARGETBUFF.LIST = {
    "0": {
        "name": "bulletOilGun",
        "durationType": "limited",
        "duration": {
            "1": 1000,
            "2": 1000,
            "3": 1000
        },
        "durationUseCardLevel": true,
        "effects": {
            "1":
                {
                    "name": "slow",
                    "type": 1,
                    "value": -0.5
                },

            "2":
                {
                    "name": "slow",
                    "type": 1,
                    "value": -0.5
                },

            "3":
                {
                    "name": "slow",
                    "type": 1,
                    "value": -0.5
                }
        },
        "state": "sticky"
    },
    "1": {
        "name": "bulletIceGun",
        "durationType": "limited",
        "duration": {
            "1": 1500,
            "2": 1500,
            "3": 1500
        },
        "durationUseCardLevel": true,
        "effects": {
            "1":
                {
                    "name": "frozen",
                    "type": "immobilize"
                },

            "2":
                {
                    "name": "frozen",
                    "type": "immobilize"
                },

            "3":
                {
                    "name": "frozen",
                    "type": "immobilize"
                },
        },
        "state": "frozen"
    },
}