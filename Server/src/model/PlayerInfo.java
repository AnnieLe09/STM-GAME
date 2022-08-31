package model;

import cmd.obj.demo.DemoDirection;
import cmd.obj.demo.MaxPosition;
import model.Battle.BattleCard;
import model.Battle.BattleObjectFactory;
import model.Battle.Player;
import model.Bullet.Bullet;
import model.Chest.ChestController;
import model.Inventory.Inventory;
import model.Map.Map;
import model.Monster.Monster;
import model.Shop.Shop;
import model.Tower.Tower;
import util.supportClass.RandomInt;
import util.database.DataModel;

import java.awt.*;
import java.util.LinkedList;

public class PlayerInfo extends DataModel implements Cloneable {
    // Zing me
    /*
    - avatar
- name
- trophy
- level
- exp
- gold
- g
- inventory
- chests
     */
    private int id;
    private String name;
    private int avatar;
    private int trophy;
    private int level;
    private int exp;
    private int gold;
    private int g;
    protected int type;


    private Inventory inventory;
    private ChestController chestController;
    private Shop shop;

    private BattleObjectFactory battleObjectFactory;


    public Point position;
    private static int orange = 5;


    public PlayerInfo(int id, String name) {
        super();
        orange+=1;
        this.id = id;
        this.name = name;
        this.avatar = RandomInt.randInt(1,6);
        this.trophy = 0;
        this.level = 0;
        this.exp = 0;
        this.gold = 0;
        this.g = 0;

        this.battleObjectFactory = new BattleObjectFactory();
        this.chestController= new ChestController();
        this.inventory = new Inventory(this);
        this.shop = new Shop(this);



        position = new Point(0, 0);

        this.type = 0;

    }
    @Override
    public Object clone() throws CloneNotSupportedException {
        PlayerInfo cloneItem = (PlayerInfo) super.clone();
        return cloneItem;
    }
    public String toString() {
        return String.format("%s|%s", id, name);
    }

    public Point move(short direction) {
        if (direction == DemoDirection.UP.getValue()) {
            position.x++;
        } else if (direction == DemoDirection.DOWN.getValue()) {
            position.x--;
        } else if (direction == DemoDirection.RIGHT.getValue()) {
            position.y++;
        } else {
            position.y--;
        }

        position.x = position.x % MaxPosition.X;
        position.y = position.y % MaxPosition.Y;

        return position;
    }

    public String getName() {
        return name;
    }

    /* Add By HanhND2 */
    public int getID() {
        return this.id;
    }
    public int getAvatar() {
        return this.avatar;
    }
    public int getTrophy() {
        return this.trophy;
    }
    public int getLevel() {
        return this.level;
    }
    public int getExp() {
        return this.exp;
    }
    public int getGold() {
        return this.gold;
    }
    public int getG() {
        return this.g;
    }
    public int upGold(int gold){
        this.gold += gold;
        if (this.gold < 0) {
            this.gold = 0;
        }
        return this.gold;
    }
    public int upG(int g){
        this.g += g;
        if (this.g < 0){
            this.g = 0;
        }
        return this.g;
    }
    public int upTrophy(int trophy){
        this.trophy += trophy;
        if (this.trophy < 0){
            this.trophy = 0;
        }
        return this.trophy;
    }

    public Inventory getInventory() {
        return this.inventory;
    }

    public Shop getShop() {
        return shop;
    }

    public ChestController getChestController() {
        return this.chestController;
    }
    

    /*        */
    public String setName(String name) {
        this.name = name;
        return this.getName();
    }

    public int getType() {
        return type;
    }
}
