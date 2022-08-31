package util.vector;

public class VecIntLong {
    public int x;
    public long y;
    public VecIntLong(int x, long y){
        this.x =x;
        this.y = y;
    }
    public VecIntLong(VecIntLong v){
        this.x = v.x;
        this.y = v.y;
    }
    public VecIntLong clone(){
        return new VecIntLong(this);
    }
}
