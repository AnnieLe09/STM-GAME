package model.bot;

import bitzero.server.entities.User;
import bitzero.util.datacontroller.business.DataController;
import bitzero.util.datacontroller.business.DataControllerException;
import cmd.requestServer.RequestServerPlaceMonster;
import cmd.requestServer.RequestServerPlaceSpell;
import cmd.requestServer.RequestServerPlaceTower;
import cmd.requestServer.RequestServerUpgradeTower;
import controller.BattleController;
import controller.IDController;
import controller.MainController;
import extension.FresherExtension;
import manager.Battle.BattleManager;
import model.Battle.BattleObject;
import model.Battle.BattleObjectFactory;
import model.Battle.Player;
import model.Define.ModelDefine;
import model.Map.Cell;
import model.Map.Map;
import model.Monster.Monster;
import model.Spell.*;
import model.Tower.AttackTower;
import model.Tower.Tower;
import model.buff.Buff;
import service.server.BattleServerHandler;
import util.database.DataHandler;
import util.supportClass.RandomInt;
import util.vector.VecInt;

import java.util.ArrayList;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

public class Bot extends Player {
    private User user;
    private int curMiLiSecond;
    private int curBotTick;
    private boolean isEndMatch;
    public Bot(int player_ID, BattleController battleController) {
        super(player_ID, battleController);
        this.user = IDController.getUserByID(this.info.getID());

        this.isEndMatch = false;
        this.curMiLiSecond = 0;
        this.scheduleSommonBot();


    }

    public void scheduleSommonBot(){
        int nextMiLiSummonBot = RandomInt.randInt(ModelDefine.MIN_TIME_SUMMON_BOT_NEXT,ModelDefine.MAX_TIME_SUMMON_BOT_NEXT);
        Timer timer = new Timer();
        TimerTask tt = new TimerTask() {
            public void run(){
                summonBot(nextMiLiSummonBot);
                timer.cancel();
            }
        };
        timer.schedule(tt, nextMiLiSummonBot);
    }
    public void summonBot(int nextMiLiSummonBot) {
        try {
            if (this.isEndMatch){
                return;
            }
            this.curMiLiSecond += nextMiLiSummonBot;
            this.curBotTick = this.curMiLiSecond*60/1000+1;
            MainController.findBattleByUser(this.info.getID()).update(this.curBotTick - 1);
            if (this.curHp <= 0){
                this.isEndMatch = true;
            }
            doAction();
            if (this.isEndMatch){
                return;
            }
            //  Block of code to try
        }
        catch(Exception e) {
            //  Block of code to handle errors
        }

        this.scheduleSommonBot();



    }

    public void doAction() {
        //Todo something
        int actionType = getActionType();
        switch (actionType){
            case 0:
                placeTower();
                break;
            case 1:
                placeMonster();
                break;
            case 2:
                placeSpell();
                break;
            case 3:
                upgradeTower();
                break;

        }
    }

    public int getActionType() {
        return RandomInt.randInt(0,3);
    }

    public void placeTryTower(){
        Tower tower = null;
        for(int i=0;i<4;i++){
            if (battleObjects.get(i).getClassName().equals("Tower")){
                tower = (Tower) battleObjects.get(i);
            }
        }
        if (tower == null){
            return;
        }
        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceTower(
                this.curBotTick,tower.getBattleObjectId(),RandomInt.randInt(1,5),RandomInt.randInt(0,6)));
    }
    public void placeTrySpell(){
        Spell spell = null;
        for(int i=0;i<4;i++){
            if (battleObjects.get(i).getClassName().equals("Spell")){
                spell = (Spell) battleObjects.get(i);
            }
        }
        if (spell == null){
            return;
        }
        VecInt cell = new VecInt(RandomInt.randInt(1,5),RandomInt.randInt(0,6));
        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceSpell(
                this.curBotTick,spell.getBattleObjectId(),cell.x+0.5,cell.y+0.5));
    }

    public void placeTryMonster(){
        Monster monster = null;
        for(int i=0;i<4;i++){
            if (battleObjects.get(i).getClassName().equals("Monster")){
                monster = (Monster) battleObjects.get(i);
            }
        }
        if (monster == null){
            return;
        }
        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceMonster(
                this.curBotTick,monster.getBattleObjectId()));
    }
    public void addBattleServerHandler(BattleServerHandler battleServerHandler) {
        //this.scheduleSommonBot();
    }
    public void endMatch() {
        super.endMatch();
        this.isEndMatch = true;
    }
    public VecInt setCellToPlaceTower(){

        VecInt[] buffCells = this.map.getBuffCells();
        Monster tempMonster = new Monster(0, 1, 1, "test", true);
        ArrayList<VecInt> tempPath = tempMonster.getTempPath(this.map);
        ArrayList<VecInt> curPath = recoverPath(tempPath,tempMonster);
        VecInt buffCellChosen = setBuffCellToPlaceTower(buffCells,curPath);
        if (buffCellChosen!=null){
            return buffCellChosen;
        }
        ArrayList<VecInt> bestPath = this.map.getLongestPath(ModelDefine.MONSTER_START_CELL,
                ModelDefine.MONSTER_END_CELL,this.map.getShowArr());

        VecInt curPathCellChosen = setCurPathCellChosen(curPath,bestPath);
        if (curPathCellChosen!=null){
            return curPathCellChosen;
        }
        VecInt neighborCellChosen = setNeighborCellChosen(curPath);
        if (neighborCellChosen != null)
        {
            return neighborCellChosen;
        }

        return new VecInt(RandomInt.randInt(1,5),RandomInt.randInt(0,6));
        //todo something

    }

    public VecInt setNeighborCellChosen(ArrayList<VecInt> curPath) {
        ArrayList<VecInt> neighborCells = new ArrayList<>();
        for(VecInt cell: curPath){
            ArrayList<VecInt> neighbors = this.map.get8Neighbours(cell, this.map.getShowArr());
            neighborCells.addAll(neighbors);
        }
        if (neighborCells.size() == 0){
            return null;
        }
        neighborCells.removeIf(cell -> checkCellInCurPath(cell,curPath));
        return neighborCells.get(RandomInt.randInt(0,neighborCells.size() - 1));
    }

    public boolean checkCellInCurPath(VecInt cell, ArrayList<VecInt> curPath) {
        for(VecInt cell1: curPath){
            if (cell.equals(cell1)){
                return true;
            }
        }
        return false;
    }

    public VecInt setCurPathCellChosen(ArrayList<VecInt> curPath, ArrayList<VecInt> bestPath) {
        for(int i=0;i<curPath.size();i++){
            if (i >= bestPath.size() || !bestPath.get(i).equals(curPath.get(i))){
                return curPath.get(i);
            }
        }
        return null;

    }

    public VecInt setBuffCellToPlaceTower(VecInt[] buffCells, ArrayList<VecInt> curPath) {
        VecInt bestBuffCell = null;
        int maxCount = 0;
        for(int i=0;i<buffCells.length;i++){
            VecInt buffCell = buffCells[i];
            if (this.map.getCell(buffCell).getObstacleType() != ModelDefine.CELL_OBSTACLE_NONE){
                continue;
            }
            int count = 0;
            ArrayList<VecInt> buffCellNeighbors = this.map.get8Neighbours(buffCell, this.map.getShowArr());
            for(VecInt buffCellNeighbor: buffCellNeighbors)
                for(VecInt cellInCurPath: curPath){
                    if (buffCellNeighbor.equals(cellInCurPath)){
                        count+=1;
                    }
                }
            if (count > maxCount){
                maxCount = count;
                bestBuffCell = buffCell;
            }

        }
        return bestBuffCell;
    }

    public ArrayList<VecInt> recoverPath(ArrayList<VecInt> tempPath,Monster monster) {
        //todo something
        VecInt curCell = new VecInt(tempPath.get(0));
        ArrayList<VecInt> path = new ArrayList<>();
        path.add(new VecInt(curCell));
        int k = 1;
        while (k < tempPath.size()){
            if (curCell.equals(tempPath.get(k)))
            {
                k++;
                if (k >= tempPath.size()){
                    return path;
                }
            }
            int dir = monster.getDirection(curCell,tempPath.get(k));
            switch(dir) {
                case ModelDefine.DIR_DOWN:
                    curCell.x+=1;
                    break;
                case ModelDefine.DIR_UP:
                    curCell.x-=1;
                    break;
                case ModelDefine.DIR_RIGHT:
                    curCell.y+=1;
                    break;
                case ModelDefine.DIR_LEFT:
                    curCell.y-=1;
                    break;
                default:
                    return path;
            }
            path.add(new VecInt(curCell));
        }
        return path;
    }

    public void placeTower(){
        Tower tower = null;
        ArrayList<Tower> towers = new ArrayList<>();
        for(int i=0;i<ModelDefine.amountCardInHand;i++){
            if (battleObjects.get(i).getClassName().equals("Tower")){
                tower = (Tower) battleObjects.get(i);
                towers.add(tower);
            }
        }
        if (tower == null){
            return;
        }

        tower = towers.get(RandomInt.randInt(0,towers.size() - 1));

        ArrayList<Tower> attackTowers = new ArrayList<>();
        for(Tower tower1: towers){
            if (tower1.getArchetype().equals("attack")) {
                attackTowers.add(tower1);
            }
        }

        // Uu tien thap tan cong (AttackTower)
        if (attackTowers.size() > 0){
            tower = attackTowers.get(RandomInt.randInt(0,attackTowers.size() - 1));
        }

        VecInt cell = setCellToPlaceTower();

        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceTower(
                this.curBotTick,tower.getBattleObjectId(),cell.x,cell.y));
    }
    public void placeMonster(){
        Monster monster = null;
        ArrayList<Monster> monsters = new ArrayList<>();
        for(int i=0;i<ModelDefine.amountCardInHand;i++){
            if (battleObjects.get(i).getClassName().equals("Monster")){
                monster = (Monster) battleObjects.get(i);
                monsters.add(monster);
            }
        }
        if (monster == null){
            return;
        }
        monster = monsters.get(RandomInt.randInt(0,monsters.size() - 1));
        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceMonster(
                this.curBotTick,monster.getBattleObjectId()));
    }
    public void placeSpell(){
        Spell spell = null;
        ArrayList<Spell> spells = new ArrayList<>();
        for(int i=0;i<ModelDefine.amountCardInHand;i++){
            if (battleObjects.get(i).getClassName().equals("Spell")){
                spell = (Spell) battleObjects.get(i);
                spells.add(spell);
            }
        }
        if (spell == null || this.curEnergy < spell.getEnergy()){
            return;
        }
        spell = spells.get(RandomInt.randInt(0,spells.size()-1));

        int k = spell.getObjectId();
        Player player;
        if (k == 0 || k == 1|| k == 4 || k==5){
            player = this;
        }
        else player = MainController.findBattleByUser(this.info.getID()).getOpponent(this.info.getID());

        VecInt cell = spell.getBestCellToPlace(player);
        if (cell == null){
            return;
        }
        BattleServerHandler.handleServerRequest(user,new RequestServerPlaceSpell(
                this.curBotTick,spell.getBattleObjectId(),cell.x+0.5,cell.y+0.5));
    }
    public void upgradeTower(){
        Tower tower = null;
        ArrayList<Tower> towers = new ArrayList<>();
        for(int i=0;i<ModelDefine.amountCardInHand;i++){
            if (battleObjects.get(i).getClassName().equals("Tower")){
                tower = (Tower) battleObjects.get(i);
                towers.add(tower);
            }
        }
        if (tower == null){
            return;
        }

        tower = towers.get(RandomInt.randInt(0,towers.size() - 1));
        Tower towerChosen = null;

        for(Tower tower1:this.towerInMapList){
            if (tower.getObjectId() == tower1.getObjectId()){
                if (towerChosen == null){
                    towerChosen = tower1;
                }
                else
                {
                    if (tower1.getCurDamage() > towerChosen.getCurDamage() ){
                        towerChosen = tower1;
                        break;
                    }
                    if (tower1.getCurAttackSpeed() > towerChosen.getCurAttackSpeed() ){
                        towerChosen = tower1;
                        break;
                    }
                    if (tower1.getCurRange() > towerChosen.getCurRange() ){
                        towerChosen = tower1;
                        break;
                    }

                }
            }
        }
        if (towerChosen == null){
            return;
        }
        VecInt cell = towerChosen.getCell().getPosInMap();
        BattleServerHandler.handleServerRequest(user,new RequestServerUpgradeTower(
                this.curBotTick,tower.getBattleObjectId(),cell.x,cell.y));
    }
    public boolean checkTypeCardInHand(String type){
        for(int i = 0; i < ModelDefine.amountCardInHand;i++){
            if (this.battleObjects.get(i).getClassName().equals(type)){
                return true;
            }
        }
        return false;
    }
    public boolean checkMonsterInHand(){
        return this.checkTypeCardInHand("Monster");
    }
    public boolean checkSpellInHand(){
        return this.checkTypeCardInHand("Spell");
    }
    public boolean checkTowerInHand(){
        return this.checkTypeCardInHand("Tower");
    }
}
