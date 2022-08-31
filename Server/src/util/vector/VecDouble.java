package util.vector;

public class VecDouble {
    public double x;
    public double y;
    public VecDouble(double x,double y){
        this.x = x;
        this.y =y;
    }
    public VecDouble(VecDouble v){
        this.x = v.x;
        this.y = v.y;
    }
    public VecDouble clone(){
        return new VecDouble(this);
    }
}
