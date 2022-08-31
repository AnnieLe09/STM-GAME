var LobbyChest = BaseImage.extend({
    ctor:function(context, size, chest){
        this._super(context, res.JSON_CHEST_NODE);
        this.initAttributes(this.node);
        this.scaleSize = size;
        this.chest = chest;
        this.status = GC.CHEST.STATUS.EMPTY;
        this.addTouchEventListener(this.changeType, this);
        this.setSize(size);
        //if(!chest) this.setCheats();
    },
    setSize:function(size){
        this.types = this.node.getChildren();
        let height = this.types[0].height;
        let width = this.types[0].width;
        this.setScale(size.height / height);
        this.setContentSize(cc.size(width, height));
    },
    setChest:function(chest){
        this.chest = chest;
        if(chest){
            chest.registerChestStatus(this);
            chest.registerChestTime(this);
            this.nameText.string = chest.name;
            this.waitingIcon.setTexture(chest.image);
            this.openingIcon.setTexture(chest.image);
            this.finishedIcon.setTexture(chest.image);
            this.time.string = Helper.convertHMDisplay(chest.remainingTime);
            this.priceText.string = "" + chest.price;
            this.timeValue.string = this.time.string;
            this.changeChestStatus(chest.status);
        }
        else{
            this.changeChestStatus(GC.CHEST.STATUS.EMPTY);
        }
    },
    changeChestStatus:function(status){
        this.types[this.status].setVisible(false);
        this.types[status].setVisible(true);
        this.status = status;

        switch(status){
            case GC.CHEST.STATUS.OPENING:
                this.interval = 1;
                this.schedule(this.scheduleOpenTime, this.interval, Math.floor(this.chest.remainingTime / this.interval) - 1, 0);
                break;
            case GC.CHEST.STATUS.FINISHED:
                this.unschedule(this.scheduleOpenTime);
        }
    },
    scheduleOpenTime:function() {
        this.chest.updateTime(this.chest.remainingTime - this.interval);
        if(this.chest.remainingTime == 0){
            //this.chest.status = (this.chest.status + 1) % GC.CHEST.NUM;
            this.chest.updateStatus(GC.CHEST.STATUS.FINISHED);
        }
        this.chest.updateTime(this.chest.remainingTime);
    },
    removeChest:function(){
        this.changeChestStatus(GC.CHEST.STATUS.EMPTY);
        this.unschedule(this.scheduleOpenTime);
        this.chest = null;

    },
    changeChestTime:function(time){
        this.timeValue.string = Helper.convertHMDisplay(time);
        this.priceText.string = "" + this.chest.getPrice();
    },
    changeType:function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                if(this.chest){
                    var openChestLayer = new OpenChestLayer(this, this.chest);
                    openChestLayer.setPosition(cc.p(0, 0));
                    gv.mainController.mainLayer.addChild(openChestLayer, GC.CARD_INFO.Z_ORDER);
                }
                else{
                    gv.cheatController.sendCheatUpLobbyChest(this);
                }
                break;
            case ccui.Widget.TOUCH_CANCELLED:
                break;
        }
    },
    setCheats:function (){
        this.setTouchEnabled(true);
        this.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpLobbyChest(this);
            }
        }, this);
    }
});