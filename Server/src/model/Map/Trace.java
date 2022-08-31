package model.Map;


import util.vector.VecInt;

public class Trace {
    public VecInt curCell;
    public VecInt nextCell;
    public int dir;
    public int distance;    public boolean visited;
    public Trace(VecInt curCell, VecInt nextCell, int dir, int distance){
        this.curCell = new VecInt(curCell);
        this.nextCell = new VecInt(nextCell);
        this.dir = dir;
        this.distance = distance;
        this.visited = false;
    }
    public void setTrace(VecInt curCell, VecInt nextCell, int dir, int distance, boolean visited){
        this.curCell = new VecInt(curCell);
        this.nextCell = new VecInt(nextCell);
        this.dir = dir;
        this.distance = distance;
        this.visited = visited;
    }

}
