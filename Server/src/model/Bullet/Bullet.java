package model.Bullet;

import model.Battle.Player;
import model.Monster.Monster;
import model.Tower.AttackTower;
import model.Tower.Tower;
import util.supportClass.Pos;
import util.database.DataModel;

import java.util.Vector;

public class Bullet implements Cloneable {
    protected int type;
    protected Pos curPos;
    protected double radius;
    protected Monster targetMonster;
    protected Pos targetPos;
    protected double speed;
    protected double damage;
    protected boolean isAlive;
    protected AttackTower tower;
    protected String battleObjectId;
    protected Player player;
    protected boolean isComeBack;
    protected Vector<Monster> hittedMonster;
    protected int stat;
    protected int targetBuffType;

    public Bullet(AttackTower tower,int type){
        this.type = type;
        this.isAlive = true;
        this.tower = tower;
        this.damage = this.tower.getCurDamage();
        this.radius =this.tower.getAttackTowerStat().getBulletRadius();
        this.speed = this.tower.getAttackTowerStat().getBulletSpeed()/10;
        this.stat = this.tower.getCurStat();
        this.targetBuffType = this.tower.getBulletTargetBuffType();
        this.curPos = this.tower.getCurPos();
        this.targetMonster = this.tower.getTargetMonster();
        this.targetPos = this.tower.getTargetPos();
        this.battleObjectId = this.tower.getBattleObjectId() + "_Bullet_"+this.tower.getNumBulletShooted();
        this.player = this.tower.getPlayer();
    }

    public void update(double dt){

    }
    public boolean getIsAlive(){
        return this.isAlive;
    }

    public String getBattleObjectId() {
        return this.battleObjectId;
    }

    public Pos getTargetPos() {
        return targetPos;
    }

    public Monster getTargetMonster() {
        return targetMonster;
    }

    public Pos getCurPos() {
        return curPos;
    }

    public double getDamage() {
        return damage;
    }

    public double getRadius() {
        return radius;
    }

    public double getSpeed() {
        return speed;
    }

    public int getType() {
        return type;
    }

    public AttackTower getTower() {
        return tower;
    }

    public Vector<Monster> getHittedMonster() {
        return null;
    }
    public boolean getIsComeBack(){
        return true;
    }

    public int getStat() {
        return this.stat;
    }

    public int getTargetBuffType() {
        return this.targetBuffType;
    }
}
