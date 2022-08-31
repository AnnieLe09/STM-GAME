package controller;

import bitzero.server.entities.User;
import model.Battle.BattleObject;
import model.Battle.BattleRecord;
import model.Battle.BattleStatus;
import model.Battle.Player;
import model.Bullet.Bullet;
import model.Chest.Chest;
import model.Define.BotDefine;
import model.Define.ModelDefine;
import model.Map.Map;
import model.Monster.Monster;
import model.PlayerInfo;
import model.Spell.Spell;
import model.Tower.Tower;
import model.Map.Cell;
import model.Monster.Monster;
import model.bot.Bot;
import model.bot.BotAttack1;
import model.bot.BotDefend1;
import model.bot.bot_info.BotInfoAttack1;
import model.bot.bot_info.BotInfoDefend1;
import service.battle.BattleHandler;
import service.server.BattleServerHandler;
import util.supportClass.Pos;
import util.vector.VecInt;
import model.Map.Cell;
import model.Monster.Monster;
import util.vector.VecInt;
import model.Map.Cell;
import model.Monster.Monster;
import util.vector.VecInt;
import java.util.LinkedList;

public class BattleController implements Cloneable {
    private boolean isCreateReward;
    private String id;
    private String className;
    private Player[] players;
    private int curTick;
    private int curRound;
    private int startRoundTick;
    private BattleRecord battleRecord;
    private int[][] systemMonsterTypes;
    private int curSystemMonsterNum;
    public BattleController(int playerId1, int playerId2){
        this.className = "BattleController";
        players = new Player[2];
        setPlayers(playerId1, playerId2);
        systemMonsterTypes = new int[20][3];
        systemMonsterTypes = Monster.createSystemMonsterTypes();
        this.id = MainController.getIdController().genNewID(this.className);
        this.battleRecord = new BattleRecord();
        this.curRound = -1;
        this.startRound(0);
        this.curTick = -1;
        this.isCreateReward = false;
    }
    public BattleController(){

    }
    @Override
    public Object clone() throws CloneNotSupportedException {
        System.out.println("BattleController: clone");
        BattleController cloneItem = (BattleController) super.clone();
        /*cloneItem.players = new Player[2];
        for(int i = 0; i < 2; ++i){
            cloneItem.players[i] = (Player) cloneItem.players[i].clone();
        }*/
        return cloneItem;
    }
    public void setPlayers(int playerId1, int playerId2){
        players[0] = setOnePlayer(playerId1);
        players[1] = setOnePlayer(playerId2);
    }
    public Player setOnePlayer(int playerId){
        if (playerId >= 0){
            return new Player(playerId,this);
        }
        else {
            return this.addBot(playerId);
        }
    }
    public Player addBot(int playerId){
        PlayerInfo botInfo = IDController.getPlayerByID(playerId);
        switch (botInfo.getType()){
            case BotDefine.BotInfoAttack1:
                return new BotAttack1(playerId,this);
            case BotDefine.BotInfoDefend1:
                return new BotDefend1(playerId,this);

        }
        return new BotDefend1(playerId,this);
    }
    public Player getPlayer(int id) {
        if (players[0].getInfo().getID() == id){
            return players[0];
        }
        if (players[1].getInfo().getID() == id){
            return players[1];
        }
        return null;
    }
    public Player getOpponent(int id) {
        if (players[0].getInfo().getID() == id){
            return players[1];
        }
        if (players[1].getInfo().getID() == id){
            return players[0];
        }
        return null;
    }
    public User getOpponentUser(int id) {
        if (players[0].getInfo().getID() == id){
            return IDController.getUserByPlayer(players[1]);
        }
        if (players[1].getInfo().getID() == id){
            return IDController.getUserByPlayer(players[0]);
        }
        return null;
    }
    public Player[] getPlayers() {
        return players;
    }

    public int[][] getSystemMonsterTypes() {
        return systemMonsterTypes;
    }

    public int getCurRound() {
        return curRound;
    }

    public int getCurTick() {
        return curTick;
    }

    public int getCurSystemMonsterNum() {
        return curSystemMonsterNum;
    }

    public int getStartRoundTick() {
        return startRoundTick;
    }

    public void update(int nextTick){
        if (nextTick < curTick){
            return;
        }
        System.out.println("BattleController: update tick " + String.valueOf(nextTick));
        for(int i = curTick + 1; i <= nextTick; ++i) {
            if(checkEndMatch()){
                return;
            }
            curTick++;
            /*if(curTick > nextTick) {
                curTick = nextTick;
                return;
            }*/
            releaseTrappedMonsters();
            if(curTick == getNextStartRoundTick()){
                startRound(curTick);
            }
            int releaseMonsterNum = Math.max(players[0].getSystemMonsters().size(), players[1].getSystemMonsters().size());
            if((releaseMonsterNum > 0) && (curTick == getNextReleaseTick())){
                releaseSystemMonster();
                curSystemMonsterNum++;
            }
            for(int j = 0; j < 2; ++j){
//                System.out.println("Player "+j);
                players[j].update(ModelDefine.SECOND_PER_TICK);
            }
        }
    }

    private void releaseTrappedMonsters() {
        for(int i = 0; i < 2; ++i) {
            if(this.curTick % 60 == 0){
                this.players[i].releaseTrappedMonster();
            }

        }
    }

    public boolean startRound(int tick){
        //LinkedList<Monster> monsterListPlayer1 = this.creatSystemMonster(playerManager2,round);
        //playerManager1.startRound(tick,monsterListPlayer1);
        curRound++;
        System.out.println("BattleController: start round " + String.valueOf(curRound));
        curTick = tick;
        startRoundTick = tick;
        curSystemMonsterNum = 1;
        if(curRound != 0){
            for(int i = 0; i < 2; ++i){
//                System.out.println("player " + i);
                players[i].startRound(Monster.createSystemMonsters(curRound - 1, players[1-i].getTotalStatTower(), systemMonsterTypes[curRound - 1], players[i]));
                //players[i].startRound(Monster.createSystemMonsters(curRound - 1, 0, systemMonsterTypes[curRound - 1], players[i]));
                //battleRecord.addStatus(new BattleStatus(this));
            }
        }
        releaseSystemMonster();
        return true;
    }

    private void releaseSystemMonster(){
        for(int i = 0; i < 2; ++i){
//            System.out.println("==========Release monster of player " + String.valueOf(i) + " at tick " +curTick + "start tick, next tick: " + startRoundTick + " " + getNextReleaseTick() +"===========");
            players[i].releaseSystemMonster();
        }
    }
    public String getId() {
        return id;
    }
    public void placeSpell(int userId, String cardId, double posI, double posJ){
        System.out.println("BattleController: place spell " + cardId);
        Player player = getPlayer(userId);
        if(player != null){
            //Player player = players[0];
            //player.addSpell(cardId, posI, posJ);
            Spell spell = (Spell)player.getBattleObjectById(cardId);
            if(spell != null && player.decreaseEnergy(spell.getEnergy())){
                //battleObjects.remove(spell);
                player.dropCard(cardId);
                spell.setCurPos(new Pos(posI, posJ));
                if(spell.getMap() == 0){
                    player.addSpell(spell);
                }
                else if(spell.getMap() == 1){
                    getOpponent(player.getPlayer_ID()).addSpell(spell);
                }
            }
            else{
                System.out.println("Player: cannot find spell");
            }
            //battleRecord.addStatus(new BattleStatus(this));
        }
        else{
            System.out.println("BattleController: Cannot find player");
        }
    }
    public boolean placeMonster(int userId, String cardId, int tick){

        System.out.println("BattleController: place monster " + cardId);
        Player currPlayer = getPlayer(userId);
        Player opponentPlayer = getOpponent(userId);

        if(opponentPlayer != null){
            Monster monster = (Monster) currPlayer.getBattleObjectById(cardId);
            if(monster != null){
                currPlayer.dropCard(cardId);
                this.update(tick);
                return opponentPlayer.createPlaceMonster(monster.getObjectId(), tick, currPlayer);
            }
        }
        return false;
    }

    public boolean makeGesture(int userId, String monsterId, int tick){
        // userId dang la userId cua minh => set cho doi thu

        System.out.println("BattleController: make gesture " + monsterId);
        Player opponentPlayer = getOpponent(userId);

        if(opponentPlayer != null){
            this.update(tick);
            return opponentPlayer.makeGesture(monsterId);
        }
        return false;
    }

    public synchronized void reward(){

        System.out.println("Reward: "+this.isCreateReward);
        if (this.isCreateReward){
            return;
        }

        this.isCreateReward = true;
        int hp1 = players[0].getCurHp();
        int hp2 = players[1].getCurHp();
        if (hp1 == hp2){
            return;
        }
        boolean[] kq = new boolean[2];
        kq[0] = (hp1 > hp2);
        kq[1] = (hp2 > hp1);
        for(int i = 0; i < 2; ++i){
            PlayerInfo playerInfo = players[i].getInfo();
            Chest chest = null;
            if (kq[i]){
                playerInfo.upTrophy(ModelDefine.UP_TROPHY_WHEN_END_GAME);
                int chestId = playerInfo.getChestController().createChest();
                if (chestId >= 0){
                    chest = playerInfo.getChestController().getChest(chestId);
                }
            }
            else {
                playerInfo.upTrophy(ModelDefine.UP_TROPHY_WHEN_END_GAME * (-1));
            }
            BattleHandler.sendReward(playerInfo.getTrophy(),chest,IDController.getUserByID(playerInfo.getID()));
            try {
                playerInfo.saveModel(playerInfo.getID());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    public void endMatch(){
        for(int i = 0; i < 2; ++i){
            players[i].endMatch();
        }
        reward();
    }
    public boolean checkEndMatch(){
        for(int i = 0; i < 2; ++i){
            if(players[i].getCurHp() <= 0){
                //endMatch();
                return true;
            }
        }
        if(curRound == ModelDefine.AMOUNT_ROUND && this.curTick == getNextStartRoundTick() - 1){
            //endMatch();
            return true;
        }
        return false;
    }
    private long getNextStartRoundTick(){
        return this.startRoundTick + ModelDefine.TICK_PER_SECOND * ModelDefine.AMOUNT_ROUND;
    }
    private long getNextReleaseTick(){
        return this.startRoundTick + curSystemMonsterNum * ModelDefine.TICK_PER_MONSTER;
    }
    public void addBattleStatus(){
        System.out.println("Battle Status");
        BattleController battleController = new BattleController();
        try{
            battleController = (BattleController) this.clone();
            System.out.println("tick " + String.valueOf(battleController.getCurTick()) + " spell num: " + String.valueOf(battleController.getPlayers()[0].getSpellNum()));
        }catch (CloneNotSupportedException a){
            a.printStackTrace();
        }
        battleRecord.addStatus(battleController);
    }
    public boolean isSwapUser(int id) {
        if (players[0].getInfo().getID() == id) {
            return false;
        }
        return true;
    }
    public boolean placeTower(int userId, int tick, String cardId, int posI, int posJ){
        System.out.println("BattleController: place tower " + cardId);
        Player player = getPlayer(userId);
        if(player != null){
            //Player player = players[0];
            VecInt cellPoint = new VecInt(posI,posJ);
            this.update(tick);
            boolean flag = player.addTower(cardId, cellPoint, this.curTick);
            return flag;
        }
        else{
            System.out.println("BattleController: Cannot find player");
            return false;
        }

    }
    public boolean upgradeTower(int userId, int tick, String cardId, int posI, int posJ){
        System.out.println("BattleController: upgrade tower " + cardId);
        Player player = getPlayer(userId);
        if(player != null){
            //Player player = players[0];
            VecInt cellPoint = new VecInt(posI,posJ);
            this.update(tick);
            boolean flag = player.upgradeTower(cardId, cellPoint);
            //battleRecord.addStatus(new BattleStatus(this));
            return flag;
        }
        else{
            System.out.println("BattleController: Cannot find player");
            return false;
        }

    }

    public boolean dropTower(int userId, int tick, int posI, int posJ) {
        System.out.println("BattleController: drop tower " + posI +" " + posJ);
        Player player = getPlayer(userId);
        if(player != null){
            //Player player = players[0];
            VecInt cellPoint = new VecInt(posI,posJ);
            this.update(tick);
            boolean flag = player.dropTower(cellPoint);
            //battleRecord.addStatus(new BattleStatus(this));
            return flag;
        }
        else{
            System.out.println("BattleController: Cannot find player");
            return false;
        }
    }

    public int getHpOfPlayer(int playerId) {
        Player player = getPlayer(playerId);
        return player.getCurHp();
    }
    public void addBattleServerHandler(BattleServerHandler battleServerHandler) {
        players[0].addBattleServerHandler(battleServerHandler);
        players[1].addBattleServerHandler(battleServerHandler);
    }
}
