var CardInfoCell = BaseImage.extend({
    ctor:function(context, size, icon, nameText, value, upgradeText){
        this._super(context, res.JSON_CARD_INFO_CELL);
        this.initAttributes(this.node);
        this.scaleSize = size;
        this.setSize(size);
        this.setInfo(icon, nameText, value, upgradeText);
    },
    setSize:function(size){
        this.children = this.node.getChildren();
        let height = this.bg.height;
        let width = this.bg.width;
        this.setScaleY(size.height / height);
        this.setScaleX(size.width / width);
        this.setContentSize(cc.size(width, height));
    },
    setInfo:function(icon, nameText, value, upgradeText){
        this.icon.loadTexture(icon);
        this.nameText.string = nameText;
        this.value.string = value;
        this.upgradeText.string = upgradeText;
        this.upgradeText.setPosition(cc.p(this.value.x + this.value.width + 5, this.value.y));
    },
  });