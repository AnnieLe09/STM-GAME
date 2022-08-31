package util.supportClass;

import util.vector.VecInt;

public class Pos {
    public double x;
    public double y;
    public double z;
    public Pos(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    public Pos(double x,double y,double z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public Pos(double x,double y){
        this.x = x;
        this.y = y;
        this.z = 0;
    }
    public Pos(Pos p){
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
    }
    public double getDistance(Pos obj) {
        return Math.sqrt((this.x - obj.x)*(this.x - obj.x) + (this.y - obj.y)*(this.y - obj.y) +
                (this.z - obj.z)*(this.z - obj.z));
    }
    static public double getDistance(Pos pos1, Pos pos2) {
        return Math.sqrt((pos1.x - pos2.x)*(pos1.x - pos2.x) + (pos1.y - pos2.y)*(pos1.y - pos2.y) +
                (pos1.z - pos2.z)*(pos1.z - pos2.z));

    }
    public void plusWithVecInt (VecInt a, double dt, double speed){
        this.x+=a.x*dt*speed;
        this.y+=a.y*dt*speed;
    }
    public void translate(Pos des, double dt, double speed){
        double distance = this.getDistance(des);
        double timeToDes = distance/speed;
        this.x+=(des.x-this.x)/timeToDes*dt;
        this.y+=(des.y-this.y)/timeToDes*dt;
        this.z+=(des.z-this.z)/timeToDes*dt;
    }
    public boolean equals(Pos p){
        if (p == null){
            return false;
        }
        return (this.x == p.x && this.y == p.y && this.z == p.z);
    }
    public VecInt toCell (){
        return new VecInt((int)this.x,(int)this.y);
    }


}
