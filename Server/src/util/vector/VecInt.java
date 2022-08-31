package util.vector;

import util.supportClass.Pos;

public class VecInt {
    public int x;
    public int y;
    public VecInt(int x, int y){
        this.x = x;
        this.y = y;
    }
    public VecInt(VecInt v){
        this.x = v.x;
        this.y = v.y;
    }
    public VecInt clone(){
        return new VecInt(this);
    }
    public boolean equals(VecInt p){
        if (p == null){
            return false;
        }
        return (this.x == p.x && this.y == p.y);
    }
    public static VecInt createCellFromInt(int index, int column){
        return new VecInt(index/column,index % column);
    }
    public static VecInt[] createListCellFromListInt(int[] index, int column){
        VecInt[] cells = new VecInt[index.length];
        for(int i=0;i<index.length;i++){
            cells[i] = createCellFromInt(index[i],column);
        }
        return cells;
    }
    public VecInt plus(VecInt a){
        return new VecInt(this.x+a.x,this.y+a.y);
    }
    public Pos toPos(){
        return new Pos(this.x +0.5,this.y + 0.5);
    }
}
