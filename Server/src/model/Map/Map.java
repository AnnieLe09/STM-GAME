package model.Map;

import model.Battle.Player;
import model.Define.MapDefine;
import model.Define.ModelDefine;
import model.Tower.Tower;
import model.buff.Buff;
import model.buff.towerbuff.towercellbuff.TowerCellBuff;
import util.supportClass.Pos;
import util.supportClass.RandomInt;
import util.vector.VecInt;
import util.database.DataModel;

import java.util.*;

public class Map extends DataModel implements Cloneable{
    private int nativeArr[][] ={{0,-1,-1,-1,-1,-1,-1,-1,-1},
            {0,0,0,0,0,0,0,-2,-1},
            {0,0,0,0,0,1,0,0,-1},
            {0,0,0,2,0,0,0,-3,-1},
            {0,0,0,0,0,3,0,0,-1},
            {0,-2,0,0,0,0,0,0,20}};
    private int[][] showArr;
    private Trace[][] traceArr;
    private LinkedList<VecInt> queue = new LinkedList<>();
    private VecInt[] buffCells;
    private ArrayList<VecInt> trees;
    private ArrayList<VecInt> holes;
    private ArrayList<VecInt> longestPath;
    private Cell[][] cellMatrix;
    private Player player;
    public Map(VecInt[] buffCells, Player player){
        super();
        this.buffCells = buffCells;
        this.player =player;
        genMap(buffCells);
        initShowArr();
        initTraceArr();
        initCellMatrix();
        updateShortestPath(ModelDefine.MONSTER_END_CELL);
        //System.out.println(nativeArr.toString());
    }


    @Override
    public Object clone() throws CloneNotSupportedException {
        Map cloneItem = (Map) super.clone();
        cloneItem.nativeArr = copyArr(cloneItem.nativeArr);
        cloneItem.showArr = copyArr(cloneItem.showArr);

        return cloneItem;
    }
    private int[][] copyArr(int[][] arr){
        int[][] res = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                res[i][j] = arr[i][j];
            }
        }
        return res;
    }
    public static boolean checkBuffCells(VecInt[] buffCells){
        for(int i=0;i<buffCells.length;i++){
            for(int j=i+1;j<buffCells.length;j++) {
                if ((Math.abs(buffCells[i].x - buffCells[j].x) <= 1)
                        && (Math.abs(buffCells[i].y - buffCells[j].y) <= 1)){
                    return false;
                }
            }
        }
        return true;
    }
    public static VecInt[] genBuffCells(int amount){
        while(true){
            int[] buffCellInts = RandomInt.randIntsDifference(1,
                    (ModelDefine.MAP_MAX_ROW-3)*(ModelDefine.MAP_MAX_COLUMN - 3) - 1,amount);
            VecInt[] buffCells = VecInt.createListCellFromListInt(buffCellInts,ModelDefine.MAP_MAX_COLUMN - 3);
            if (checkBuffCells(buffCells)){
                for(VecInt cell: buffCells){
                    cell.x += 2;
                    cell.y += 1;
                }
                return buffCells;
            }
        }

    }
    private void initNativeMap(VecInt[] buffCells){
        nativeArr = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                nativeArr[i][j] = 0;
                if (i == 0 || j == ModelDefine.MAP_MAX_COLUMN - 1) {
                    nativeArr[i][j] = -1;
                }
            }
        }

        nativeArr[0][0] = 0;
        nativeArr[ModelDefine.MAP_MAX_ROW - 1][ModelDefine.MAP_MAX_COLUMN - 1] = ModelDefine.START_HP;
        for(int i=0;i<buffCells.length;i++){
            this.nativeArr[buffCells[i].x][buffCells[i].y] = i+1;
        }
    }
    public ArrayList<VecInt> get4Neighbours(VecInt cell,int[][] arr){
        ArrayList<VecInt>  neighbours = new ArrayList<>();
        neighbours.add(new VecInt(cell.x + 1,cell.y));
        neighbours.add(new VecInt(cell.x - 1,cell.y));
        neighbours.add(new VecInt(cell.x,cell.y + 1));
        neighbours.add(new VecInt(cell.x,cell.y - 1));
        neighbours.removeIf(u -> !checkCell(u,arr));
        return neighbours;
    }
    public ArrayList<VecInt> get8Neighbours(VecInt cell, int[][] arr){
        ArrayList<VecInt>  neighbours = get4Neighbours(cell,arr);
        neighbours.add(new VecInt(cell.x + 1,cell.y + 1));
        neighbours.add(new VecInt(cell.x + 1,cell.y - 1));
        neighbours.add(new VecInt(cell.x - 1,cell.y + 1));
        neighbours.add(new VecInt(cell.x - 1,cell.y - 1));
        neighbours.removeIf(u -> !checkCell(u,arr));
        return neighbours;
    }

    // (0,0) is at the top-left conner, vertical is the first dimension (x) and horizontal is the second dimension(y);
    private ArrayList<int[]> get4NeighboursPriority(int[][] arr, int x, int y, int dir){
        ArrayList<int[]> temp = new ArrayList<>();
        if(x+1 < MapDefine.HEIGHT) temp.add(new int[]{x+1, y, ModelDefine.DIR_DOWN}); // Down
        if(y+1 < MapDefine.WIDTH) temp.add(new int[]{x, y+1, ModelDefine.DIR_RIGHT}); // Right
        if(x-1 >= 0) temp.add(new int[]{x-1, y, ModelDefine.DIR_UP}); // Up
        if(y-1 >= 0) temp.add(new int[]{x, y-1, ModelDefine.DIR_LEFT}); // Left

        ArrayList<int[]> temp2 = new ArrayList<>();
        for(int i = 0; i < temp.size(); i++){
            int[] a = temp.get(i);
            if(a[2] == dir && arr[a[0]][a[1]] >= 0) temp2.add(a);
        }
        for(int i = 0; i < temp.size(); i++){
            int[] a = temp.get(i);
            if(a[2] != dir && arr[a[0]][a[1]] >= 0) temp2.add(a);
        }

        return temp2;
    }

    private int hash(int x, int y){
        return x*MapDefine.WIDTH + y;
    }

    public ArrayList<VecInt> bfsShortedPath(VecInt startPosition, VecInt endPosition, int dir){
        LinkedList<int[]> queue = new LinkedList<>();
        queue.addLast(new int[]{startPosition.x, startPosition.y, dir}); // queue: [[x,y,dir], ...]

        int[] distance = new int[MapDefine.WIDTH*MapDefine.HEIGHT];
        VecInt[] ans = new VecInt[MapDefine.WIDTH*MapDefine.HEIGHT];

        for(int i = 0; i < MapDefine.WIDTH*MapDefine.HEIGHT; i++){
            distance[i] = ModelDefine.MAX_INT;
            ans[i] = null;
        }

        VecInt t = new VecInt(-1, -1);

        distance[this.hash(startPosition.x, startPosition.y)] = 0;
        ans[this.hash(startPosition.x, startPosition.y)] = t;

        while (queue.size() > 0) {
            int[] node = queue.removeFirst();

            if (node[0] == endPosition.x && node[1] == endPosition.y) {
                break;
            }

            ArrayList<int[]> temp = this.get4NeighboursPriority(this.showArr, node[0], node[1], node[2]); // temp: [[x,y,dir], ...]

            for (int i = 0; i < temp.size(); i++) {
                int[] cell = temp.get(i);
                if (distance[this.hash(cell[0], cell[1])] > distance[this.hash(node[0], node[1])]) {
                    distance[this.hash(cell[0], cell[1])] = distance[this.hash(node[0], node[1])];
                    ans[this.hash(cell[0], cell[1])] = new VecInt(node[0], node[1]);
                    queue.addLast(cell);
                }
            }
        }

        ArrayList<VecInt> x = new ArrayList<>();
        VecInt y = endPosition;
        x.add(y);

        while (!t.equals(ans[hash(y.x, y.y)])){
            if(ans[hash(y.x, y.y)] == null){
                System.out.println("No wayyyyy !!!");
                return null;
            }
            x.add(ans[hash(y.x, y.y)]);
            y = ans[hash(y.x, y.y)];
        }

        Collections.reverse(x);

        return x;
    }

    public ArrayList<VecInt> getCurvePoint(ArrayList<VecInt> arr){
        ArrayList<VecInt> listCurvePoint = new ArrayList<>();
        if (arr == null) return listCurvePoint;
        listCurvePoint.add(arr.get(0));
        if (arr.size() < 2) return listCurvePoint;

        boolean prev = (arr.get(1).x == arr.get(0).x); // 0 is horizontal, 1 is vertical

        for(int i = 2; i < arr.size(); i++){
            if(prev == (arr.get(i).x == arr.get(i-1).x)){
                continue;
            }
            listCurvePoint.add(arr.get(i-1));
            prev = (arr.get(i).x == arr.get(i-1).x);
        }
        listCurvePoint.add(arr.get(arr.size()-1));
        return listCurvePoint;
    }



    private void updateLongestPath(ArrayList<VecInt> path, ArrayList<VecInt> conPath,
                                   ArrayList<VecInt> bestPath, ArrayList<VecInt> bestConPath){
        bestPath.clear();
        for(VecInt cell: path){
            bestPath.add(cell.clone());
        }
        bestConPath.clear();
        for(VecInt vec: conPath){
            bestConPath.add(vec.clone());
        }
    }
    private boolean checkAddPath(ArrayList<VecInt> path,VecInt cell){
        int count = 0;
        for(VecInt cellPath: path){
            if (cell.equals(cellPath)){
                return false;
            }
            if (Math.abs(cellPath.x - cell.x) + Math.abs(cellPath.y - cell.y) == 1){
                count+=1;
            }
        }
        return (count <= 1);
    }
    private boolean checkShareSide(VecInt a,VecInt b){
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 1;
    }
    private boolean checkTangent(VecInt a, VecInt b){
        return ((Math.abs(a.x - b.x) <= 1) && (Math.abs(a.y - b.y) <= 1));
    }
    private boolean checkCrossroad(VecInt a, VecInt b, VecInt c){
        if (!checkShareSide(a,b) || !checkShareSide(b,c)){
            return false;
        }
        return a.x - b.x != b.x - c.x ||
                a.y - b.y != b.y - c.y;

    }
    private void findLongestPath(ArrayList<VecInt> path, ArrayList<VecInt> conPath,
                                 ArrayList<VecInt> bestPath, ArrayList<VecInt> bestConPath, VecInt des, int[][] arr ) {

        if (path.get(path.size() - 1).equals(des)){
            if (bestPath.size() == 0) {
                updateLongestPath(path,conPath,bestPath,bestConPath);
            }
            else {
                VecInt lastConPath = conPath.get(conPath.size() - 1);
                VecInt lastBestConPath = bestConPath.get(bestConPath.size() - 1);
                if (lastConPath.x > lastBestConPath.x)   {
                    updateLongestPath(path,conPath,bestPath,bestConPath);
                }
                else {
                    if (lastConPath.x == lastBestConPath.x) {
                        if (path.size() > bestPath.size()){
                            updateLongestPath(path,conPath,bestPath,bestConPath);
                        }
                        else {
                            if (path.size() == bestPath.size()) {
                                if (lastConPath.y > lastBestConPath.y){
                                    updateLongestPath(path,conPath,bestPath,bestConPath);
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            VecInt lastPath = path.get(path.size() - 1);
            ArrayList<VecInt> neighbours = get4Neighbours(lastPath,arr);
            for (VecInt cell: neighbours) {
                if (checkAddPath(path,cell.clone())){
                    VecInt lastConPath = conPath.get(conPath.size() - 1);
                    int numCellTangentBuffCell = lastConPath.x + arr[cell.x][cell.y];
                    int numChangeDir = lastConPath.y;
                    if (path.size() > 2){
                        VecInt preLastPath = path.get(path.size() - 2);
                        if (cell.x - lastPath.x != lastPath.x - preLastPath.x ||
                                cell.y - lastPath.y != lastPath.y - preLastPath.y ) {
                            numChangeDir+=1;
                        }
                    }
                    conPath.add(new VecInt(numCellTangentBuffCell,numChangeDir));
                    path.add(cell.clone());
                    findLongestPath(path,conPath,bestPath,bestConPath,des,arr);
                    path.remove(path.size() - 1);
                    conPath.remove(conPath.size() - 1);
                }
                if (path.get(path.size() - 1).equals(cell) && cell.equals(des)){
                    findLongestPath(path,conPath,bestPath,bestConPath,des,arr);
                }
            }

        }


    }
    public ArrayList<VecInt> getLongestPath(VecInt src, VecInt des, int[][] nativeArr){
        int[][] arr = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        copyArray(arr,nativeArr);
        arr[src.x][src.y] = 0;
        arr[des.x][des.y] = 0;
        for(VecInt buffCell: this.buffCells){
            //System.out.println(buffCell.x + "  " + buffCell.y);
            ArrayList<VecInt> neighbours = get8Neighbours(buffCell.clone(),arr);
            for(VecInt cell: neighbours){
                arr[cell.x][cell.y] = 1;
            }
        }


        for(VecInt buffCell: this.buffCells){
            arr[buffCell.x][buffCell.y] = -1;
        }

        /*
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                System.out.print(arr[i][j]+" ");
            }
            System.out.println();
        }

         */


        ArrayList<VecInt> path = new ArrayList<>();
        ArrayList<VecInt> conPath = new ArrayList<>();
        ArrayList<VecInt> bestPath = new ArrayList<>();
        ArrayList<VecInt> bestConPath = new ArrayList<>();
        path.add(src.clone());
        conPath.add(new VecInt(arr[src.x][src.y],0));
        findLongestPath(path,conPath,bestPath,bestConPath,des.clone(),arr);
        return bestPath;

        /*
        System.out.println(bestPath.size());
        for(VecInt vec: bestPath){
            System.out.println(vec.x + " " + vec.y);
        }
        System.out.println("------------------------------");
        for (VecInt vec: bestConPath){
            System.out.println("---- " + vec.x + " " + vec.y);
        }

         */

    }
    private  ArrayList<VecInt> randCells(){
        int[] arr = RandomInt.randIntsDifference(ModelDefine.MAP_MAX_COLUMN ,
                ModelDefine.MAP_MAX_ROW*ModelDefine.MAP_MAX_COLUMN-1,
                ModelDefine.MAP_MAX_ROW*ModelDefine.MAP_MAX_COLUMN-ModelDefine.MAP_MAX_COLUMN );

        ArrayList<VecInt> cells = new ArrayList<>();
        for(int u: arr){
            cells.add(new VecInt(u/ModelDefine.MAP_MAX_COLUMN, u%ModelDefine.MAP_MAX_ROW));
        }
        return cells;
    }
    private void putTree(){

        ArrayList<VecInt> cells = randCells();

        ArrayList<VecInt> crossRoads = new ArrayList<>();
        for(int i=1; i < longestPath.size() - 1;i++){
            if (checkCrossroad(longestPath.get(i - 1), longestPath.get(i), longestPath.get(i + 1))) {
                crossRoads.add(longestPath.get(i).clone());
            }
        }
        Boolean[] isThisCrossTangentTree = new Boolean[crossRoads.size()];
        Arrays.fill(isThisCrossTangentTree, false);
        int numTree = RandomInt.randInt(1,ModelDefine.MAP_MAX_TREE);
        for(VecInt cell: cells){
            boolean check = true;
            for(int i=0;i<crossRoads.size();i++){
                if (isThisCrossTangentTree[i] && checkTangent(cell,crossRoads.get(i))){
                    check = false;
                }
            }
            if (numTree == 0){
                break;
            }
            if (check) {
                boolean kt = true;
                ArrayList<VecInt> tmpCells = get8Neighbours(cell, nativeArr);
                if (nativeArr[cell.x][cell.y] != 0){
                    kt = false;
                }
                for(VecInt u: tmpCells){
                    if (nativeArr[u.x][u.y] != 0) {
                        kt = false;
                        break;
                    }
                }
                for (VecInt u: longestPath)
                    if (cell.equals(u)){
                        kt = false;
                        break;
                    }
                if (kt){
                    if (numTree == 0){
                        break;
                    }
                    numTree -=1;
                    nativeArr[cell.x][cell.y] = ModelDefine.MAP_TREE * -1;
                    for(int i=0;i<crossRoads.size();i++){
                        if (checkTangent(cell,crossRoads.get(i))){
                            isThisCrossTangentTree[i] = true;
                        }
                    }
                }

            }
        }
        this.trees = new ArrayList<>();
        int k=0;
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                if (nativeArr[i][j] == ModelDefine.MAP_TREE * (-1)) {
                    nativeArr[i][j]*=-1;
                    this.trees.add(new VecInt(i,j));
                    k+=1;
                }
            }
        }
        System.out.println();

    }
    void putHole(){
        ArrayList<VecInt> cells = randCells();
        this.holes = new ArrayList<>();
        for (VecInt cell: cells){
            boolean check = false;
            for(VecInt cellInPath: longestPath){
                if (checkTangent(cell,cellInPath)){
                    check = true;
                }
            }
            for(VecInt cellInPath: longestPath){
                if (cell.equals(cellInPath)){
                    check = false;
                }
            }
            for(VecInt buffCell: buffCells){
                if (checkTangent(buffCell,cell)){
                    check = false;
                }
            }
            for(VecInt treeCell: trees){
                if (checkTangent(treeCell,cell)){
                    check = false;
                }
            }

            if (check){
                nativeArr[cell.x][cell.y] = ModelDefine.MAP_HOLE;
                this.holes.add(new VecInt(cell));
                return;
            }
        }
    }
    public void genMap(VecInt[] buffCells){
        initNativeMap(buffCells);
        this.longestPath = getLongestPath(ModelDefine.MONSTER_START_CELL, ModelDefine.MONSTER_END_CELL, nativeArr);
        putTree();
        putHole();
    }
    public void copyArray(int[][] a, int[][] b){
        for(int i=0;i < ModelDefine.MAP_MAX_ROW; i++){
            System.arraycopy(b[i], 0, a[i], 0, ModelDefine.MAP_MAX_COLUMN);
        }
    }

    public void initShowArr(){
        showArr = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        this.copyArray(showArr,nativeArr);
    }
    public void initTraceArr(){
        traceArr = new Trace[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        for(int i=0;i < ModelDefine.MAP_MAX_ROW; i++){
            for(int j=0;j<ModelDefine.MAP_MAX_COLUMN;j++){
                this.traceArr[i][j] = new Trace(new VecInt(i,j),new VecInt(i,j),ModelDefine.DIR_SELF,ModelDefine.MAX_INT);
            }
        }
    }
    public void reInitTraceArr(){
        for(int i=0;i < ModelDefine.MAP_MAX_ROW; i++){
            for(int j=0;j<ModelDefine.MAP_MAX_COLUMN;j++){
                this.traceArr[i][j].setTrace(new VecInt(i,j),new VecInt(i,j),ModelDefine.DIR_SELF,ModelDefine.MAX_INT,false);
            }
        }
    }
    public int[][] getNativeArr() {
        int[][] arr = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        this.copyArray(arr,nativeArr);
        return arr;
    }
    public int[][] getShowArr() {
        int[][] arr = new int[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        this.copyArray(arr,showArr);
        return arr;
    }
    public VecInt getCellFromPos(Pos pos) {
        return new VecInt((int)pos.x,(int)pos.y);
    }
    public Pos getPosFromCell(VecInt cell){
        return new Pos(cell.x +0.5,cell.y + 0.5);
    }
    public boolean checkInArr(VecInt u){
        if (u.x < 0 || u.x >= ModelDefine.MAP_MAX_ROW || u.y < 0 || u.y >= ModelDefine.MAP_MAX_COLUMN){
            return  false;
        }
        return true;
    }
    public boolean checkCell(VecInt u){
        if (!checkInArr(u) || showArr[u.x][u.y] < 0){
            return false;
        }
        return true;
    }
    private boolean checkCell(VecInt u, int[][] arr){
        if (!checkInArr(u) || arr[u.x][u.y] < 0){
            return false;
        }
        return true;
    }
    public void updateTrace(VecInt curCell, int dir){
        if (!checkCell(curCell)){
            return;
        }
        VecInt nextCell;
        switch (dir) {
            case ModelDefine.DIR_UP:
                nextCell = curCell.plus(ModelDefine.DELTA_UP);
                break;
            case ModelDefine.DIR_LEFT:
                nextCell = curCell.plus(ModelDefine.DELTA_LEFT);
                break;
            case ModelDefine.DIR_DOWN:
                nextCell = curCell.plus(ModelDefine.DELTA_DOWN);
                break;
            case ModelDefine.DIR_RIGHT:
                nextCell = curCell.plus(ModelDefine.DELTA_RIGHT);
                break;
            default:
                return;
        }
        if (!checkInArr(nextCell)) {
            return;
        }

        Trace curTrace = traceArr[curCell.x][curCell.y];
        Trace nextTrace = traceArr[nextCell.x][nextCell.y];
        if (curTrace.distance+1 > nextTrace.distance){
            return;
        }
        if (curTrace.distance+1 == nextTrace.distance && -dir <= nextTrace.dir){
            return;
        }

        if (- dir == curTrace.dir){
            nextTrace.setTrace(nextCell,curTrace.nextCell,-dir,
                    curTrace.distance+1,nextTrace.visited);
        }
        else {
            nextTrace.setTrace(nextCell,curCell,-dir,
                    curTrace.distance+1,nextTrace.visited);
        }
        if (!nextTrace.visited) {
            queue.addLast(nextCell);
            nextTrace.visited = true;
        }
    }
    public void updateShortestPath(VecInt des){
        this.reInitTraceArr();
        VecInt u = new VecInt(des);
        traceArr[u.x][u.y].setTrace(des,des,ModelDefine.DIR_SELF,0,true);
        queue.clear();
        queue.addLast(u);
        while (queue.size() > 0){
            u = queue.removeFirst();
            updateTrace(u,ModelDefine.DIR_UP);
            updateTrace(u,ModelDefine.DIR_LEFT);
            updateTrace(u,ModelDefine.DIR_DOWN);
            updateTrace(u,ModelDefine.DIR_RIGHT);
        }
    }
    private VecInt setNextCell(VecInt des, VecInt src, Pos curPos){
        if (!checkCell(src)){
            VecInt curCell = this.getCellFromPos(curPos);
            if (!curCell.equals(src)) {
                return des;
            }

        }
        if (des.equals(ModelDefine.VECINT_NULL)) {
            des = src;
        }
        else {
            if (((curPos.getDistance(this.getPosFromCell(src)) + this.traceArr[src.x][src.y].distance)
                    < (curPos.getDistance(this.getPosFromCell(des)) + this.traceArr[des.x][des.y].distance))){
                des = src;
            }
        }
        return des;
    }
    public Pos getNextPos(Pos curPos){
        VecInt curCell = this.getCellFromPos(curPos);
        Pos curCellPos = this.getPosFromCell(curCell);
        VecInt nextCell = new VecInt(ModelDefine.VECINT_NULL);
        if (curPos.x == curCellPos.x){
            if (curPos.y > curCellPos.y){
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_RIGHT),curPos);
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_SELF),curPos);
            }
            if (curPos.y < curCellPos.y){
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_LEFT),curPos);
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_SELF),curPos);
            }
        }
        if (curPos.y == curCellPos.y){
            if (curPos.x > curCellPos.x){
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_DOWN),curPos);
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_SELF),curPos);
            }
            if (curPos.x < curCellPos.x){
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_UP),curPos);
                nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_SELF),curPos);
            }
        }
        if (curPos.equals(curCellPos)) {
            nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_DOWN),curPos);
            nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_RIGHT),curPos);
            nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_UP),curPos);
            nextCell = this.setNextCell(nextCell,curCell.plus(ModelDefine.DELTA_LEFT),curPos);
        }

        if (nextCell.equals(ModelDefine.VECINT_NULL)) return  null;
        return this.getPosFromCell(nextCell);

    }

    public boolean addTower(VecInt cellPoint, Tower tower) {
        if (!checkCell(cellPoint)) {
            return false;
        }
        Cell cell = this.cellMatrix[cellPoint.x][cellPoint.y];
        if (!cell.addTower(tower)){
            return false;
        }
        this.showArr[cellPoint.x][cellPoint.y] = ModelDefine.MAP_PUT_TOWER;
        //this.updateShortestPath(ModelDefine.MONSTER_END_CELL);
        return true;
    }
    public boolean dropTower(VecInt cellPoint) {
        Cell cell = this.getCell(cellPoint);
        if (cell == null){
            return false;
        }
        if (!cell.dropTower()){
            return false;
        }
        this.showArr[cellPoint.x][cellPoint.y] = this.nativeArr[cellPoint.x][cellPoint.y];
        return true;
    }
    private void initCellMatrix() {
        this.cellMatrix = new Cell[ModelDefine.MAP_MAX_ROW][ModelDefine.MAP_MAX_COLUMN];
        for(int i=0; i<ModelDefine.MAP_MAX_ROW; i++) {
            for (int j = 0; j < ModelDefine.MAP_MAX_COLUMN; j++) {
                Cell cell = new Cell(new VecInt(i,j),this, this.player);
                this.cellMatrix[i][j] = cell;
                switch(nativeArr[i][j]) {
                    case ModelDefine.CELL_BUFF_DAMAGE:
                        // code block
                        cell.addBuff(ModelDefine.CELL_BUFF_DAMAGE);
                        break;
                    case ModelDefine.CELL_BUFF_ATTACK_SPEED:
                        // code block
                        cell.addBuff(ModelDefine.CELL_BUFF_ATTACK_SPEED);
                        break;
                    case ModelDefine.CELL_BUFF_RANGE:
                        // code block
                        cell.addBuff(ModelDefine.CELL_BUFF_RANGE);
                        break;
                    case ModelDefine.MAP_TREE:
                        // code block
                        cell.addObstacle(ModelDefine.CELL_OBSTACLE_TREE);
                        break;
                    case ModelDefine.MAP_HOLE:
                        // code block
                        cell.addObstacle(ModelDefine.CELL_OBSTACLE_HOLE);
                        break;
                    case -1:
                        // code block
                        cell.addObstacle(ModelDefine.CELL_OBSTACLE_OUT);
                        break;

                    default:
                        // code block
                }
            }
        }
    }

    public Cell getCell(VecInt cellPoint) {
        if (!checkInArr(cellPoint)){
            return  null;
        }
        return this.cellMatrix[cellPoint.x][cellPoint.y];
    }

    public Cell[][] getCellMatrix() {
        return cellMatrix;
    }

    public VecInt[] getBuffCells() {
        return buffCells;
    }
}
