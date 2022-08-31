package model.Bullet;

import model.Define.ModelDefine;
import model.Tower.AttackTower;

public class ChasingBullet extends Bullet {
    public ChasingBullet(AttackTower tower){
        super(tower, ModelDefine.BULLET_TYPE_CHASING);
    }
    public void update(double dt){
        super.update(dt);
        double monsterRadius;
        if (this.targetMonster != null && this.targetMonster.getIsAlive()){
            this.targetPos = this.targetMonster.getCurPos();
            monsterRadius = this.targetMonster.getHitRadius();
        }
        else {
            monsterRadius = 0;
        }

        if (this.curPos.getDistance(this.targetPos) - monsterRadius < this.speed*dt){
            this.curPos = this.targetPos;
            if (this.targetMonster != null && this.targetMonster.getIsAlive()){
                this.targetMonster.hit(this.damage);
            }
            this.isAlive = false;
        }
        else {
            this.curPos.translate(this.targetPos,this.speed,dt);
        }

//        System.out.println("ChasingBullet battleObjectId: "+this.battleObjectId);
//        System.out.println("ChasingBullet curPos: " + this.curPos.x + " " + this.curPos.y);
//        System.out.println("ChasingBullet isAlive: "+this.isAlive);

    }
}
