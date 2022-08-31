var GeneralCardUI = BaseImage.extend({
    ctor:function(context, size, cardID){
        this._super(context, res.JSON_GENRAL_CARD_NODE);
        this.initAttributes(this.node);
        this.setSize(size);
        this.card = new Card(cardID, 0, 0);
        let object = this.card.object;
        this.avatar.loadTexture(CARD_PATH + object.avatar);
    },
    setSize:function(size){
        this.children = this.node.getChildren();
        let height = this.bg.height;
        let width = this.bg.width;
        this.setScaleY(size.height / height);
        this.setScaleX(size.width / width);
        this.setContentSize(cc.size(width, height));
    },
});