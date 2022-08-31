package model.Bullet;

import model.Tower.AttackTower;
import model.Tower.Tower;

public class BulletFactory {
    public static Bullet create(AttackTower tower){
        if (tower.getArchetype().equals("magic")){
            return new MagicBullet(tower);
        }
        if (tower.getBulletType().equals("chasing")){
            return new ChasingBullet(tower);
        }

        if (tower.getBulletType().equals("boomerang")){
            return new BoomerangBullet(tower);
        }
        if (tower.getBulletType().equals("straight") ){
            return new PositionBullet(tower);
        }

        return null;
    }
}
