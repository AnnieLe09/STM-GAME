var BaseImage = ccui.ImageView.extend({
    // Truyền vào context là màn hình gọi nó và jsonFile là file resource
    ctor:function(context, jsonFile){
        this._super();
        this.context = context;
        this.initGUI(jsonFile);
    },
    initGUI:function(jsonFile){
        this.node = ccs.load(jsonFile).node;
        this.addChild(this.node);
        this.setTouchEnabled(true);
        this.ignoreContentAdaptWithSize(false);
    },
    // Gọi khi muốn dùng node con this.name_node
    initAttributes:function(parent){
        let children = parent.getChildren();
        for(let i = 0; i < children.length; ++i){
            this[children[i].getName()] = children[i];
            this.initAttributes(children[i]);
        }
    }
});