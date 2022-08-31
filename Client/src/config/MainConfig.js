var GC = GC || {};
GC.ERROR = {
    SUCCESS: 0,
    ERROR: 1
};

const INF = 99999;

GC.TAB = {
    Z_ORDER: 10,
    LAYERS: [ShopLayer, InventoryLayer, LobbyLayer, FriendsLayer, ClanLayer],
    DEFAULT_LAYER: 2,
    shopBtn: 0,
    inventoryBtn: 1,
    lobbyBtn: 2,
    friendsBtn: 3,
    clanBtn: 4
};

GC.INVENTORY = {
    BATTLE_CARDS:{
        NUM: 8,
        COL: 4,
        GAP: 10
    },
    COLLECTION_CARDS:{
        COL: 4,
        GAP: 10
    }
}
