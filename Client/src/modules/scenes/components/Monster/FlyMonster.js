var FlyMonster = Monster.extend({
    ctor: function(id, isMyMap, hpRate, isSystemMonster, battleObjectId){
        this._super(id, isMyMap, hpRate, isSystemMonster, battleObjectId);
        //LA
        this.isFlying = 1;
    },

    // update:function(dt){
    //     if (!this.inMap){
    //         if(this.isMyMap){
    //             this.y -= dt*this.speed;
    //             if(this.y <= (GC.MAP.HEIGHT - 0.5)*GC.MAP.CELL.P_HEIGHT){
    //                 this.findPath();
    //                 this.inMap = true;
    //             }
    //         }
    //         else{
    //             this.y += dt*this.speed;
    //             if(this.y >= 0.5*GC.MAP.CELL.P_HEIGHT){
    //                 this.findPath();
    //                 this.inMap = true;
    //             }
    //         }
    //     }
    //     else{
    //         this.makeMove(dt,this.curr_direction);
    //     }
    // },

    findPath: function(){
        if (this.path == null){
            this.path = [this.cellMatrix[0][5], this.cellMatrix[0][4], this.cellMatrix[4][0], this.cellMatrix[this.endPosition.x][this.endPosition.y]]

            // for(var i = 0; i < this.path.length; i++){
            //     this.path[i].addChild(new Assasin());
            // };

            this.next_cell = 0;
            this.next_pos = this.path[this.next_cell].posInMap;
            this.changeDirection();
        }
    },
});