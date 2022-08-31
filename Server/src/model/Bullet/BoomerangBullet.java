package model.Bullet;

import model.Define.ModelDefine;
import model.Monster.Monster;
import model.Tower.AttackTower;
import util.supportClass.Pos;

import java.util.LinkedList;
import java.util.Vector;

public class BoomerangBullet extends Bullet {
    public BoomerangBullet(AttackTower tower){

        super(tower, ModelDefine.BULLET_TYPE_CHASING);

        this.isComeBack = false;
        this.hittedMonster = new Vector<>();
    }
    public int countTimeHitted (Monster monster,Vector<Monster> arr){
        int count = 0;
        for(int  i = 0;i<arr.size();i++){
            if (monster == arr.get(i)){
                count += 1;
            }
        }
        return count;
    }

    public void updateGo (double dt){
        System.out.println("Boomerang Go");
        if (this.curPos.getDistance(this.targetPos) < this.speed*dt){
            this.curPos = new Pos(this.targetPos);
            this.isComeBack = true;
            this.targetPos = new Pos(this.tower.getCurPos());
            this.hittedMonster.clear();
            //TODO something
        }
        else {
            System.out.println("speed + dt: "+this.speed + " "+dt);
            this.curPos.translate(this.targetPos,dt,this.speed);
        }

        System.out.println("Boomerang LogicPoint: " + this.curPos.x + " " +this.curPos.y );

        LinkedList<Monster> monsters = this.player.getMonsterInMapList();
        for(Monster monster: monsters){
            if (monster != null && monster.isAlive){
                double monsterRadius = monster.getHitRadius();
                if (this.curPos.getDistance(monster.getCurPos()) <=
                        this.radius + monsterRadius && this.countTimeHitted(monster,this.hittedMonster) < 1){
                    monster.hit(this.damage);
                    this.hittedMonster.add(monster);
                }
            }
        }
    }

    public void updateComeBack (double dt){
        System.out.println("Boomerang Come Back");
        if (this.curPos.getDistance(this.targetPos) < this.speed*dt){
            this.curPos = new Pos(this.targetPos);
            this.isAlive = false;;
            //TODO something
        }
        else {
            System.out.println("speed + dt: "+this.speed + " "+dt);
            this.curPos.translate(this.targetPos,dt,this.speed);
        }

        System.out.println("Boomerang LogicPoint: " + this.curPos.x + " " +this.curPos.y );

        LinkedList<Monster> monsters = this.player.getMonsterInMapList();
        for(Monster monster: monsters){
            if (monster != null && monster.isAlive){
                double monsterRadius = monster.getHitRadius();
                if (this.curPos.getDistance(monster.getCurPos()) <=
                        this.radius + monsterRadius && this.countTimeHitted(monster,this.hittedMonster) < 1){
                    monster.hit(this.damage);
                    this.hittedMonster.add(monster);
                }
            }
        }
    }
    public void update(double dt){
        super.update(dt);
        if (this.isComeBack){
            this.updateComeBack(dt);
        }
        else {
            this.updateGo(dt);
        }
    }
    public boolean getIsComeBack(){
        return this.isComeBack;
    }
    public Vector<Monster> getHittedMonster(){
        return this.hittedMonster;
    }
}
