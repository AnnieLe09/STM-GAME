var BaseLayer = cc.Layer.extend({
     // Truyền vào context là màn hình gọi nó và jsonFile là file resource
    ctor: function (context, jsonFile) {
      this._super();
      this.context = context;
      this.initGUI(jsonFile);
      this.initAttributes(this.layer);
    },
    initGUI: function(jsonFile) {
        this.winSize = cc.director.getWinSize();
        this.layer = ccs.load(jsonFile).node;
        if(this.context){
            this.layer.setScaleX(this.context.scaleX);
            this.layer.setScaleY(this.context.scaleY);
        }
        this.layer.setAnchorPoint(cc.p(0.5, 0.5));
        this.layer.setPosition(cc.p(this.winSize.width / 2, this.winSize.height / 2));
        this.addChild(this.layer);
    },
    initAttributes:function(parent){
        let children = parent.getChildren();
        for(let i = 0; i < children.length; ++i){
            this[children[i].getName()] = children[i];
            this.initAttributes(children[i]);
        }
    }
  });
  