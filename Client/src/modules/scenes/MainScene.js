var MainLayer = BaseLayer.extend({
    ctor: function () {
      this._super(null, res.JSON_MAIN_LAYER);
      this.initUserInfo(gv.mainController.user);
      this.initScale();
      this.initButtons();
      this.initPages();
      this.initTouchScreen();
      this.setCheats();
    },
    initScale:function(){
      this.layer.setScaleX((1.0 * this.winSize.width) / this.layer.width);
      this.layer.setScaleY((1.0 * this.winSize.height) / this.layer.height);
    },
    initUserInfo:function(user){
        user.registerUserGold(this);
        user.registerUserGem(this);
        this.changeUserGold(user.gold);
        this.changeUserGem(user.gem);
    },
    changeUserGold:function(gold){
      this.goldNum.string = "" + gold;
    },
    changeUserGem:function(gem){
      this.gemNum.string = "" + gem;
    },
    initButtons:function(){
      //this.navBar.setZOrder(1000);
      this.tabs = this.navBar.getChildren();
      this.tabWidth = this.tabs[0].width;
      this.tabHeight = this.tabs[0].height;
      this.chosenTab = this.tabs[GC.TAB.lobbyBtn];
      var tabActionUp = cc.MoveBy.create(0.1, cc.p(0, this.tabHeight / 3)).easing(cc.easeBackOut(0.5));
      this.setTab(this.chosenTab, res.PNG_SELECTED_TAB, this.tabWidth, this.tabHeight + 5, 10, tabActionUp, true);
      for(var i = 0; i < this.tabs.length; ++i){
        this.tabs[i].addTouchEventListener(this.tabListener, this);
      }
    },
    tabListener:function(sender, type){
      switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
          break;
        case ccui.Widget.TOUCH_MOVED:
          break;
        case ccui.Widget.TOUCH_ENDED:
          this.changeTab(sender);
          this.changeLayer();
          break;
        case ccui.Widget.TOUCH_CANCELLED:
          break;
      }
    },
    setTab:function(tab, image, width, height, zorder, iconAction, textBool){
      tab.loadTextureNormal(image);
      tab.width = width;
      tab.height = height;
      tab.setLocalZOrder(zorder);
      tab.getChildByName("icon").runAction(iconAction);
      tab.getChildByName("text").setVisible(textBool);
    },
    initPages: function(){
      this.containerLayer = new cc.Layer();
      this.addChild(this.containerLayer, 1)
      var layers = GC.TAB.LAYERS;
      for(var i = 0; i < layers.length; ++i){
        this["layer" + i] = new layers[i](this);
        this["layer" + i].setAnchorPoint(cc.p(0.5, 0.5));
        this.containerLayer.addChild(this["layer" + i]);
        this.setPositionForLayer(i);
      }
      var defaultIdx = GC.TAB.DEFAULT_LAYER;
      this.containerLayer.setAnchorPoint(cc.p(0.5, 0.5));
      this.containerLayer.setPosition(cc.p(-defaultIdx * this.winSize.width, 0));
    },
    setPositionForLayer:function(i){
      this["layer" + i].setPosition(cc.p(i * this.winSize.width, 0));
    },
    initTouchScreen:function(){
      if ('mouse' in cc.sys.capabilities) {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event){
                if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
                  event.getCurrentTarget().beginTouchPos = event.getLocation();
                }
            },
            onMouseUp: function(event){
              if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
                event.getCurrentTarget().processEvent(event.getLocation());
              }
          }
        }, this);
    }
    if ('touches' in cc.sys.capabilities) {
        cc.eventManager.addListener({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan:function (touches, event) {
                    var touch = touches[0];

                    if (this.prevTouchId !== touch.getID()) {
                        this.prevTouchId = touch.getID();
                    } else {
                      event.getCurrentTarget().beginTouchPos = touch.getLocation();
                    }
            },
            onTouchesEnded:function (touches, event) {
              var touch = touches[0];

              if (this.prevTouchId !== touch.getID()) {
                  this.prevTouchId = touch.getID();
              } else {
                event.getCurrentTarget().processEvent(touch.getLocation());
              }
            }
        }, this);
    }
    },
    processEvent: function(endPos) {
      var delta = {
        x: endPos.x - this.beginTouchPos.x,
        y: endPos.y - this.beginTouchPos.y
      }
      var minDelta = 10;

      if (Math.abs(delta.x) < minDelta && Math.abs(delta.y) < minDelta) {
          return;
      }

      if (Math.abs(delta.x) > Math.abs(delta.y)) {
          var idx = 1;
          if (delta.x > 0) {
            idx = -1;
          }
          idx = this.getIdxOfLayer(this.chosenTab) + idx;
          if(idx >= 0 && idx < GC.TAB.LAYERS.length){
            this.changeTab(this.tabs[idx]);
            this.changeLayer();
          }
      }
  },
    changeTab:function(sender){
      var tabActionUp = cc.MoveBy.create(0.1, cc.p(0, this.tabHeight / 3)).easing(cc.easeBackOut(0.5));
      var tabActionDown = cc.MoveBy.create(0.1, cc.p(0, -this.tabHeight / 3)).easing(cc.easeBackOut(0.5));
      this.setTab(this.chosenTab, res["PNG_TAB_" + (this.getIdxOfLayer(this.chosenTab) % 2)], this.tabWidth, this.tabHeight, 0, tabActionDown, false);
      this.setTab(sender, res.PNG_SELECTED_TAB, this.tabWidth, this.tabHeight + 5, 10, tabActionUp, true);
      this.chosenTab = sender;
    },
    changeLayer:function(){
      var idx = this.getIdxOfLayer(this.chosenTab);
      var layerAction = cc.MoveTo.create(0.3, cc.p(-idx * this.winSize.width, 0));
      this.containerLayer.runAction(layerAction);
    },
    getIdxOfLayer:function(layer){
      return GC.TAB[layer.getName()];
    },
    setCheats:function (){
        this.goldBtn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpGold(100);
            }
        }, this);
        this.gemBtn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpG(100);
            }
        }, this);
    }
  });