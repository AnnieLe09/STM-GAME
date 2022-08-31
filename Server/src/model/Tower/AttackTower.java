package model.Tower;

import model.Bullet.Bullet;
import model.Bullet.BulletFactory;
import model.Define.ModelDefine;
import model.Monster.Monster;
import model.buff.Buff;
import model.buff.Effect;
import util.readJson.TowerJson;
import util.supportClass.Pos;

import java.util.LinkedList;
import java.util.Vector;

public class AttackTower extends Tower {
    transient private String bulletType;
    transient private int bulletTargetBuffType;
    transient private AttackTowerStat[] attackTowerStats;
    private Monster targetMonster;
    private double curTimeWaiting;
    private Pos targetPos;
    private boolean isShootBullet;
    private double attackAnimationTime;
    private double shootAnimationTime;
    private int numBulletShooted;

    public AttackTower(int towerId) {
        //super(towerId,"AttackTower");
        super(towerId, 1); //test
        this.attackTowerStats = new AttackTowerStat[ModelDefine.CARD_MAX_EVOLUTION + 1];
        readAttackTowerJson();
        this.curTimeWaiting = 0;
        this.curAttackSpeed = this.attackTowerStats[this.curStat].getAttackSpeed();
        this.curDamage = this.attackTowerStats[this.curStat].getDamage();
        this.curRange = this.attackTowerStats[this.curStat].getRange();
        this.targetMonster = null;
        this.isStartAttack = false;
        this.isShootBullet = false;
        this.numBulletShooted = 0;
        this.targetPos = new Pos(this.curPos);
    }

    public void readAttackTowerJson() {
        TowerJson towerJson = new TowerJson();

        String pointer = towerJson.get();
        pointer = towerJson.getWithJsonString(pointer, "tower");
        pointer = towerJson.getWithJsonString(pointer, String.valueOf(this.objectId));

        this.bulletType = towerJson.getWithJsonString(pointer, "bulletType");
        this.bulletTargetBuffType = towerJson.getIntWithJsonString(pointer, "bulletTargetBuffType");
        this.attackAnimationTime = towerJson.getDoubleWithJsonString(pointer, "attackAnimationTime");
        this.shootAnimationTime = towerJson.getDoubleWithJsonString(pointer, "shootAnimationTime");
        this.attackTowerStats[0] = null;
        for (int i = 1; i < this.attackTowerStats.length; i++) {
            this.attackTowerStats[i] = new AttackTowerStat(pointer, i);
        }

    }

    public void update(double dt) {
        super.update(dt);
        if (!this.isActive) {
            return;
        }
        if (this.curTick > 1000){
            int aaaaa=6;
        }
        this.updateWithStatAndBuff();
        if (this.curTimeWaiting < dt) {
            if (this.curTimeWaiting >= 0 && !this.isStartAttack) {
                if (this.targetMonster == null) {
                    this.targetMonster = null;
                }
                if (this.targetMonster == null || !this.targetMonster.getIsAlive()
                        || this.curPos.getDistance(this.targetMonster.getCurPos())
                        - this.targetMonster.getHitRadius() > this.curRange) {
                    this.findTargetMonster();
                }
                if (this.targetMonster != null && this.targetMonster.getAttackType() != ModelDefine.BOSS_ATTACK_ONLY){
                    this.findOnlyTargetMonster();
                }


                if (this.targetMonster != null) {
                    this.curTimeWaiting = 0;
                    this.isStartAttack = true;
                    this.targetPos = this.targetMonster.getCurPos();
                } else {
                    this.curTimeWaiting = 0;
                }
            } else {
                if (this.isStartAttack) {
                    if (this.attackAnimationTime / 1000 - this.curTimeWaiting * (-1) < dt) {
                        this.curTimeWaiting = this.curAttackSpeed / 1000;
                        if (!this.isShootBullet) {
                            this.shootBullet();
                        }
                        this.isStartAttack = false;
                        this.isShootBullet = false;
                    } else {
                        if (!this.isShootBullet && this.shootAnimationTime / 1000 - this.curTimeWaiting * (-1) < dt) {
                            this.shootBullet();
                        }
                        this.curTimeWaiting -= dt;
                    }
                }
            }
        } else {
            this.curTimeWaiting -= dt;
        }

//        System.out.println("AttackTower battleObjectId: "+this.battleObjectId);
//        System.out.println("AttackTower D A R: " + this.curDamage + " " + this.curAttackSpeed + " "+ this.curRange);
//        System.out.println("AttackTower curTimeWaiting: "+this.curTimeWaiting);
//        System.out.println("AttackTower isStartAttack: "+this.isStartAttack);
//        System.out.println("AttackTower isShootBullet: "+this.isShootBullet);

    }



    private void updateWithStatAndBuff() {
        this.curAttackSpeed = this.attackTowerStats[this.curStat].getAttackSpeed();
        this.curDamage = this.attackTowerStats[this.curStat].getDamage();
        this.curRange = this.attackTowerStats[this.curStat].getRange();

        this.buffs.removeIf(buff -> (buff == null ||!buff.getIsActive()));
        for(Buff buff:this.buffs){
            if (!buff.getIsActive()){
                continue;
            }
            Vector<Effect> effects = buff.getEffectList();
            int index;
            if (effects.size() > 2){
                index = this.curStat;
            }
            else {
                index = 1;
            }
            Effect effect = effects.get(index);
            if (effect.getName().equals("damageUp")){
                this.curDamage += this.attackTowerStats[this.curStat].getDamage() * effect.getValue();;
            }
            if (effect.getName().equals("attackSpeedUp")){
                this.curAttackSpeed -= this.attackTowerStats[this.curStat].getAttackSpeed() * effect.getValue();
            }
            if (effect.getName().equals("rangeUp")){
                this.curRange += this.attackTowerStats[this.curStat].getRange() * effect.getValue();;
            }
        }

        if (this.curDamage < 0) {
            this.curDamage = 0;
        }
        if (this.curAttackSpeed < 0){
            this.curAttackSpeed = 0;
        }
        if (this.curRange < 0){
            this.curRange = 0;
        }

    }

    private void shootBullet() {
        this.isShootBullet = true;
        this.numBulletShooted += 1;
        Bullet bullet = BulletFactory.create(this);
        player.addBullet(bullet);
    }

    private void findTargetMonster() {
        if (this.curTick > 1000){
            int aaaaa=6;
        }
        this.targetMonster = null;
        LinkedList<Monster> monsterList = this.player.getMonsterInMapList();
        for (Monster monster : monsterList) {
            if (monster.getIsAlive()) {
                if (this.curPos.getDistance(monster.getCurPos()) <= this.curRange) {
                    if (this.targetMonster == null) {
                        this.targetMonster = monster;
                    } else {
                        if (this.curPos.getDistance(this.targetMonster.getCurPos()) <
                                this.curPos.getDistance(monster.getCurPos())) {
                            this.targetMonster = monster;
                        }
                    }
                }
            }

        }
    }

    private void findOnlyTargetMonster() {
        LinkedList<Monster> monsterList = this.player.getMonsterInMapList();
        for (Monster monster : monsterList) {
            if (monster.getIsAlive() && monster.getAttackType() == ModelDefine.BOSS_ATTACK_ONLY) {
                if (this.curPos.getDistance(monster.getCurPos()) <= this.curRange) {
                    this.targetMonster = monster;
                    return;
                }
            }

        }
    }

    public double getCurDamage() {
        return curDamage;
    }

    public AttackTowerStat getAttackTowerStat() {
        return this.attackTowerStats[this.curStat];
    }

    public Monster getTargetMonster() {
        return targetMonster;
    }

    public Pos getTargetPos() {
        return targetPos;
    }

    public String getBulletType() {
        return bulletType;
    }

    public AttackTower clone() {
        AttackTower clone = new AttackTower(this.objectId);
        super.clone(clone);
        clone.curTimeWaiting = this.curTimeWaiting;
        clone.targetMonster = this.targetMonster;
        clone.isStartAttack = this.isStartAttack;
        clone.isShootBullet = this.isShootBullet;
        clone.numBulletShooted = this.numBulletShooted;
        clone.curDamage = this.curDamage;
        clone.curRange = this.curRange;
        clone.curAttackSpeed = this.curAttackSpeed;
        return clone;
    }

    public double getCurTimeWaiting() {
        return curTimeWaiting;
    }

    public boolean getIsShootBullet() {
        return this.isShootBullet;
    }

    public int getNumBulletShooted() {
        return numBulletShooted;
    }

    public int getBulletTargetBuffType() {
        return bulletTargetBuffType;
    }
}
