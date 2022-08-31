package util.vector;

public class VecLong {
    public long x;
    public long y;
    public VecLong(long x,long y){
        this.x = x;
        this.y =y;
    }
    public VecLong(VecLong v){
        this.x = v.x;
        this.y = v.y;
    }
    public VecLong clone(){
        return new VecLong(this);
    }
}
