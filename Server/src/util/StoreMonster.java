package util;

import model.Monster.Monster;

public class StoreMonster {

    public Monster monster;
    public int tick;

    public StoreMonster(Monster monster, int tick){
        this.monster = monster;
        this.tick = tick;
    }
}
