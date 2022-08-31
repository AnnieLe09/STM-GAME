package model.Bullet;

import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.AttackTower;
import model.buff.Buff;
import model.buff.targetbuff.TargetBuff;

public class MagicBullet extends Bullet {
    private TargetBuff buff;
    public MagicBullet(AttackTower tower){
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

            this.buff =new TargetBuff(this.targetBuffType,3);
            this.buff.setStat(this.stat);
            this.buff.setBattleObjectId(this.battleObjectId + "_Buff_");
            this.buff.startTimeRemaining();
            this.player.addBuff(this.buff);

            for(Monster monster: this.player.getMonsterInMapList()) {
                monsterRadius = monster.getHitRadius();
                if (this.curPos.getDistance(monster.getCurPos()) <= this.radius + monsterRadius) {
                    monster.hit(damage);
                    monster.addBuff(this.buff);
                }
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
