package model.Map;

import model.Battle.Player;
import model.Define.ModelDefine;
import model.Tower.Tower;
import model.buff.Buff;
import model.buff.towerbuff.towercellbuff.TowerCellBuff;
import util.vector.VecInt;

public class Cell {
    private Buff buff;
    private VecInt posInMap;
    private Map map;
    private int obstacleType;
    private Object obstacle;
    private int buffType;
    private Player player;

    public Cell(VecInt posInMap, Map map, Player player){
        this.posInMap = posInMap.clone();
        this.map = map;
        this.obstacleType = ModelDefine.CELL_OBSTACLE_NONE;
        this.obstacle = null;
        this.buff = null;
        this.player = player;
        this.buffType = 0;
    }

    public VecInt getPosInMap() {
        return posInMap;
    }

    public void addObstacle(int obstacleType){
        this.obstacleType = obstacleType;
    }
    public void addBuff(int buffType,Buff buff){
        this.buffType = buffType;
        this.buff = buff;
    }
    public void removeBuff(){
        this.buffType = 0;
        this.buff = null;
    }

    public void addBuff(int buffType){
        this.buffType = buffType;
        this.buff = null;
        this.buff = new TowerCellBuff(buffType - 1,this);
        if (this.buff!= null){
            this.player.addBuff(this.buff);
        }
    }

    public int getObstacleType() {
        return obstacleType;
    }

    public Object getObstacle() {
        return obstacle;
    }

    public Buff getBuff() {
        return buff;
    }

    public int getBuffType() {
        return buffType;
    }

    public Map getMap() {
        return map;
    }
    public boolean addTower(Tower tower){
        if (this.obstacleType != ModelDefine.CELL_OBSTACLE_NONE){
            return false;
        }
        this.obstacleType = ModelDefine.CELL_OBSTACLE_TOWER;
        this.obstacle = tower;
        if (this.buffType !=0){
            tower.addBuff(this.buff);
        }
        return true;
    }
    public boolean dropTower(){
        if (this.obstacleType != ModelDefine.CELL_OBSTACLE_TOWER){
            return false;
        }
        Tower tower1 = (Tower) (this.obstacle);
        if (!tower1.dropTower()){
            return false;
        }
        this.obstacleType = ModelDefine.CELL_OBSTACLE_NONE;
        this.obstacle = null;
        return true;
    }
}
