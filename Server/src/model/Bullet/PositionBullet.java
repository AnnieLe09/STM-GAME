package model.Bullet;

import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.AttackTower;

public class PositionBullet extends Bullet {
    public PositionBullet(AttackTower tower){
        super(tower, ModelDefine.BULLET_TYPE_POSITION);
    }
    public void update(double dt){
        super.update(dt);

        if (this.curPos.getDistance(this.targetPos) < this.speed*dt){
            this.curPos = this.targetPos;
            this.isAlive = false;
            for(Monster monster: this.player.getMonsterInMapList()) {
                Double monsterRadius = monster.getHitRadius();
                if (this.curPos.getDistance(monster.getCurPos()) <= this.radius + monsterRadius) {
                    monster.hit(damage);
                }
            }
        }
        else {
            this.curPos.translate(this.targetPos,this.speed,dt);
        }

        System.out.println("PositionBullet battleObjectId: "+this.battleObjectId);
        System.out.println("PositionBullet curPos: " + this.curPos.x + " " + this.curPos.y);
        System.out.println("PositionBullet isAlive: "+this.isAlive);
    }
}
