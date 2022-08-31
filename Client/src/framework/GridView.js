var GridView = ccui.Layout.extend({
    _gap:0,
    _rowNum: 1,
    _colNum: 4,
    _cells: [],
    _cellSize:cc.size(100, 100),
    _index: null,
    ctor:function(colNum, rowNum, cellSize, gap, isWrapped){
        this._super();
        this._colNum = colNum;
        this._rowNum = rowNum;
        this._cellSize = cellSize;
        this._gap = gap;
        for(let i = 0; i < rowNum; ++i){
            this._cells.push(new Array(colNum));
        }
        this._index = {i: 0, j: -1};
        this._isWrapped = isWrapped;
        if(isWrapped){
            this._width = colNum * cellSize.width + (colNum - 1) * gap;
            this._height = rowNum * cellSize.height + (rowNum - 1) * gap;
            this.setSize(cc.size(this._width, this._height));
        }
    },
    insertCell:function(cell){
        this._index.i = this._index.i + Math.floor((this._index.j + 1) / this._colNum);
        this._index.j = (this._index.j + 1) % this._colNum;
        if(this._index.i > this._rowNum - 1){
            this._cells.push(new Array(this._colNum));
            this._rowNum++;
        }
        this._cells[this._index.i][this._index.j] = cell;
        cell.setAnchorPoint(cc.p(0, 1));
        cell.indexI = this._index.i;
        cell.indexJ = this._index.j;
        this.addChild(cell);
        this.setCellPosition(this._index.i, this._index.j);
    },
    getCellPosition:function(i, j){
        let x = j * (this._cellSize.width + this._gap);
        let y = this._height - i * (this._cellSize.height + this._gap);
        return cc.p(x, y);
    },
    setCellPosition:function(i, j){
        this._cells[i][j].setPosition(this.getCellPosition(i, j));
    },
    removeCell:function(i, j){
        this._cells[i][j] = null;
    },
    insertCellWithIdx:function(cell, i, j){
        this._cells[i][j] = cell;
        cell.setAnchorPoint(cc.p(0, 1));
        cell.indexI = i;
        cell.indexJ = j;
        this.addChild(cell);
        this.setCellPosition(i, j);
    }
});