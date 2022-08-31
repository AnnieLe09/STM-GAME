package model.buff.towerbuff.towercellbuff;

import model.Define.ModelDefine;
import model.Map.Cell;
import model.Tower.Tower;
import model.buff.towerbuff.SpellTowerBuff;
import model.buff.towerbuff.TowerBuff;
import util.readJson.ModelJson;
import util.readJson.ReadJson;

import java.util.ArrayList;

public class TowerCellBuff extends TowerBuff {
    protected Cell cell;
    protected ArrayList<Tower> towers;

    public TowerCellBuff(int towerBuffType, Cell cell) {
        super(towerBuffType,1);
        cell.addBuff(towerBuffType + 1, this);
        this.cell = cell;
        //towers = new ArrayList<>();
        this.battleObjectId = "TowerCellBuff_"+towerBuffType;
    }

    public Cell getCell() {
        return cell;
    }
    /*
    public TowerCellBuff clone(){
        TowerCellBuff clone = new TowerCellBuff(this.towerBuffType,this.cell);
        return clone;
    }
     */

    @Override
    public void updateBuff(double dt) {
        this.isActive = true;
        /*
        for (Tower tower : towers) {
            if (tower != null && tower.getCell() != this.cell) {
                tower.removeBuff(this);
            }
        }
        towers.removeIf(tower -> (tower == null) || (tower.getCell() != this.cell));
        if (this.cell.getObstacleType() == ModelDefine.CELL_OBSTACLE_TOWER) {
            Tower tower = (Tower) cell.getObstacle();
            this.towers.add(tower);
            tower.addBuff(this);
        }

         */
    }
}

