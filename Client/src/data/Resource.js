/**
 * Created by GSN on 6/2/2015.
 */


var res = {
    //font
    FONT_BITMAP_NUMBER_1:"fonts/number_1.fnt",
    FONT_BITMAP_DICE_NUMBER: "fonts/diceNumber.fnt",
    //zcsd
    //screen
    ZCSD_SCREEN_MENU:"zcsd/screen_menu.json",
    ZCSD_SCREEN_NETWORK:"zcsd/screen_network.json",
    ZCSD_SCREEN_LOCALIZATION:"zcsd/screen_localize.json",
    ZCSD_SCREEN_DRAGON_BONES:"zcsd/screen_dragon_bones.json",
    ZCSD_SCREEN_DECRYPTION:"zcsd/screen_decryption.json",
    ZCSD_SCREEN_ZALO:"zcsd/screen_zalo.json",
    //popup
    ZCSD_POPUP_MINI_GAME:"zcsd/game/mini_game/PopupMiniGame.json",

    //images
    Slot1_png : "zcsd/slot1.png",
    //fonts
    FONT_SUPERCELL_MAGIC: "Assets/font/SVN-Supercell Magic.ttf",
    //layers and node
    JSON_LOGIN_LAYER: "sprites/Login/LoginLayer.json",
    JSON_MAIN_LAYER: "sprites/Template/MainLayer.json",
    JSON_LOBBY_LAYER: "sprites/Lobby/LobbyLayer.json",
    JSON_CHEST_NODE: "sprites/Lobby/Chest.json",
    JSON_OPEN_CHEST_LAYER: "sprites/Lobby/OpenChestLayer.json",
    JSON_GET_CHEST_LAYER: "sprites/Lobby/GetChestLayer.json",
    JSON_INVENTORY_LAYER: "sprites/Inventory/InventoryLayer.json",
    JSON_CARD_INFO_LAYER: "sprites/Inventory/CardInfoLayer.json",
    JSON_END_MATCH_LAYER: "EndMatchLayer.json",
    JSON_CARD_INFO_CELL: "sprites/Inventory/CardInfoCell.json",
    JSON_CARD_UPGRADE_LAYER: "sprites/Inventory/CardUpgradeLayer.json",
    JSON_CARD_NODE: "sprites/Inventory/Card.json",
    JSON_GENRAL_CARD_NODE: "GeneralCardUI.json",
    //Shop
    JSON_SHOP_LAYER: "ShopLayer.json",
    JSON_ITEM_SLOT_NODE: "ItemSlotUI.json",
    CHEST_SPRITE: "Assets/common/common_treasure.png",
    ICON_GOLD: "Assets/common/common_icon_gold_small.png",
    ICON_GEM: "Assets/common/common_icon_g_small.png",
    ORANGE_BTN: "Assets/common/common_btn_orange.png",
    JSON_BUY_ITEM_LAYER: "BuyItemLayer.json",

    // Test
    ASSASIN_SPRITE: "Assets/monster/frame/assassin/monster_assassin_run_0000.png",


    //tab images
    PNG_SELECTED_TAB: "sprites/Template/Resources/lobby_page_btn_selecting.png",
    PNG_TAB_0: "sprites/Template/Resources/lobby_page_btn_0.png",
    PNG_TAB_1: "sprites/Template/Resources/lobby_page_btn_1.png",

    // Find match scene
    ui_matching_json: "FindMatchLayer.json",

    // Battle scene
    river_spine_json: "Assets/map/fx/ho_nuoc.json",
	river_spine_atlas: "Assets/map/fx/ho_nuoc.atlas",

	ui_battle_scene_json:  "BattleScene.json",

	cell_sprite: "Assets/battle/battle_item_cell.png",
	transparent_cell: "Assets/battle/UI/ui_transparent_square.png",
	cell_buff_damage: "Assets/battle/battle_item_damage.png",
	cell_buff_speed: "Assets/battle/battle_item_attack_speed.png",
	cell_buff_rage: "Assets/battle/battle_item_range.png",

    timer_sprite: "Assets/battle/battle_timer.png",
    
    //spine files for card upgrade
    ATLAS_CARD_UPGRADE: "Assets/lobby/fx/card_upgrade_ready.atlas",
    JSON_CARD_UPGRADE: "Assets/lobby/fx/card_upgrade_ready.json",
    PNG_CARD_UPGRADE: "Assets/lobby/fx/card_upgrade_ready.png",

    //glow effect
    PLIST_GLOW: "Assets/lobby/fx/miniature_rarity_particle_1.plist",

    // Tree and hole
    TREE_SPRITE: "Assets/map/map_forest_obstacle_2.png",
    HOLE_SPRITE: "Assets/battle/UI/ui_hole.png",

    // Monster
    PLIST_ASSASIN: "Assets/monster/atlas/assassin.plist",
    PNG_ASSASIN: "Assets/monster/atlas/assassin.png",

    PLIST_BAT: "Assets/monster/atlas/bat.plist",
    PNG_BAT: "Assets/monster/atlas/bat.png",

    PLIST_DARK_GIANT: "Assets/monster/atlas/dark_giant.plist",
    PNG_DARK_GIANT: "Assets/monster/atlas/dark_giant.png",

    PLIST_DEMON_TREE_MINION: "Assets/monster/atlas/demon_tree_minion.plist",
    PNG_DEMON_TREE_MINION: "Assets/monster/atlas/demon_tree_minion.png",

    PLIST_DEMON_TREE: "Assets/monster/atlas/demon_tree.plist",
    PNG_DEMON_TREE: "Assets/monster/atlas/demon_tree.png",

    PLIST_DESERT_KING: "Assets/monster/atlas/desert_king.plist",
    PNG_DESERT_KING: "Assets/monster/atlas/desert_king.png",

    PLIST_GIANT: "Assets/monster/atlas/giant.plist",
    PNG_GIANT: "Assets/monster/atlas/giant.png",

    PLIST_GOLEM_MINION: "Assets/monster/atlas/golem_minion.plist",
    PNG_GOLEM_MINION: "Assets/monster/atlas/golem_minion.png",

    PLIST_GOLEM: "Assets/monster/atlas/golem.plist",
    PNG_GOLEM: "Assets/monster/atlas/golem.png",

    PLIST_ICEMAN: "Assets/monster/atlas/iceman.plist",
    PNG_ICEMAN: "Assets/monster/atlas/iceman.png",

    PLIST_NINJA: "Assets/monster/atlas/ninja.plist",
    PNG_NINJA: "Assets/monster/atlas/ninja.png",

    PLIST_SATYR: "Assets/monster/atlas/satyr.plist",
    PNG_SATYR: "Assets/monster/atlas/satyr.png",

    PLIST_SWORDSMAN: "Assets/monster/atlas/swordsman.plist",
    PNG_SWORDSMAN: "Assets/monster/atlas/swordsman.png",

    enemy_cicle_spine_json: "Assets/battle/fx/enemy_circle.json",
	enemy_cicle_spine_atlas: "Assets/battle/fx/enemy_circle.atlas",
    HP_SPRITE: "Assets/battle/battle_target_hp.png",
    HP_BACK_GROUND: "Assets/battle/battle_target_hp_background.png",

    PNG_TOWER_RANGE: "Assets/battle/battle_tower_range_player.png",

    ATLAS_RESULT_WIN: "Assets/battle_result/fx/fx_result_win.atlas",
    JSON_RESULT_WIN: "Assets/battle_result/fx/fx_result_win.json",

    ATLAS_RESULT_LOSE: "Assets/battle_result/fx/fx_result_lose.atlas",
    JSON_RESULT_LOSE: "Assets/battle_result/fx/fx_result_lose.json",

    ATLAS_RESULT_DRAW: "Assets/battle_result/fx/fx_result_draw.atlas",
    JSON_RESULT_DRAW: "Assets/battle_result/fx/fx_result_draw.json",

    POINT: "Assets/largeBrush.png",
    s_fire: "Assets/fire.png",

    JSON_DEMON_TREE: "Assets/monster/fx/fx_boss_demon_tree.json",
    ATLAS_DEMON_TREE: "Assets/monster/fx/fx_boss_demon_tree.atlas",

    JSON_DESERT_KING: "Assets/monster/fx/fx_boss_sand_king.json",
    ATLAS_DESERT_KING: "Assets/monster/fx/fx_boss_sand_king.atlas",

    JSON_MOC_TINH: "Assets/monster/fx/fx_boss_jungle_god.json",
    ATLAS_MOC_TINH: "Assets/monster/fx/fx_boss_jungle_god.atlas",

    SPRITE_BALLOON: "Assets/battle/UI/ui_balloon_2.png",
    GESTURE_1: "Assets/battle/UI/ui_gesture_1.png",
    GESTURE_3: "Assets/battle/UI/ui_gesture_3.png",
    GESTURE_5: "Assets/battle/UI/ui_gesture_5.png",
    GESTURE_6: "Assets/battle/UI/ui_gesture_6.png",
    GESTURE_7: "Assets/battle/UI/ui_gesture_7.png",
    GESTURE_8: "Assets/battle/UI/ui_gesture_8.png",
    GESTURE_9: "Assets/battle/UI/ui_gesture_9.png",
    GESTURE_11: "Assets/battle/UI/ui_gesture_11.png",

    NEXT_AVT: {
        "0": "Assets/card/miniature_monster_swordsman.png",
        "1": "Assets/card/miniature_monster_assassin.png",
        "2": "Assets/card/miniature_monster_giant.png",
        "3": "Assets/card/miniature_monster_bat.png",
        "4": "Assets/card/miniature_monster_ninja.png",
        "5": "Assets/card/miniature_boss_dark_giant.png",
        "6": "Assets/card/miniature_boss_satyr.png",
        "7": "Assets/card/miniature_boss_desert_king.png",
        "8": "Assets/card/miniature_boss_iceman.png",
        "9": "Assets/card/miniature_boss_golem.png",
        "11": "Assets/card/miniature_boss_demon_tree.png"
    }
};

var g_resources = [
];
