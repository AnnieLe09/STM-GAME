gv.loginButton = function(w, h, x, y, text){
    if(text === undefined)
        text = "";
    var btn = new ccui.Button(res.base.common_btn_orange);
    if(x === undefined)
        x = 0;
    if(y === undefined)
        y = 0;
    btn.attr({
        x: x,
        y: y
    });

    btn.setTitleText(text);
    btn.setTitleFontSize(32);
    btn.setTitleColor(cc.color(0,0,0));
    btn.setZoomScale(0.1);
    btn.setPressedActionEnabled(true);

    btn.setScale9Enabled(true);
    btn.setUnifySizeEnabled(false);
    btn.ignoreContentAdaptWithSize(false);
    var capInsets = cc.rect(15,15, 15, 15);
    btn.setCapInsets(capInsets);
    btn.setContentSize(cc.size(w,h));
    return btn;
};

gv.textField = function(x,y,text){
    var size = cc.director.getVisibleSize();


    var textField = new ccui.TextField(text, "Marker Felt",30);
    textField.ignoreContentAdaptWithSize(false);
    //textField.getVirtualRenderer().setLineBreakWithoutSpace(true);
    textField.setContentSize(240, 120);
    textField.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    textField.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    textField.setPosition(x, y);

    return textField;


};

var LoginLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.initGUI();
        this.initAttributes();
        //this.initDisplay();

    },
    initGUI: function() {
        this.winSize = cc.director.getWinSize();
        this.loginLayer = ccs.load(res.JSON_LOGIN_LAYER).node;
        this.scaleBgX = (1.0 * this.winSize.width) / this.loginLayer.width;
        this.scaleBgY = (1.0 * this.winSize.height) / this.loginLayer.height;
        this.loginLayer.setScaleX(this.scaleBgX);
        this.loginLayer.setScaleY(this.scaleBgY);
        this.addChild(this.loginLayer);
    },
    initAttributes:function(){
        this.idTextField = this.loginLayer.getChildByName("textField_Login");
        this.btn_Login = this.loginLayer.getChildByName("btn_Login");
        this.btn_Login.addClickEventListener(this.onSelectLogin.bind(this));
    },

    initDisplay: function() {
        var size = this.winSize;

        var yBtn = 3*size.height/5;


        this.lblLog = gv.commonText(fr.Localization.text(""), size.width*0.4, size.height*0.05);
        this.addChild(this.lblLog);

        this.idTextField = gv.textField(size.width / 2.0,size.height / 2.0,"Nhập ID");
        this.addChild(this.idTextField);


        var btnLogin = gv.loginButton(200, 64, cc.winSize.width/2, cc.winSize.height/4,"Đăng Nhập");
        this.addChild(btnLogin);
        btnLogin.addClickEventListener(this.onSelectLogin.bind(this));
    },

    onSelectLogin:function(sender)
    {
        gv.gameClient.userId = this.idTextField.getString();
        gv.mainController.onConnect();
    },
})
LoginLayer.scene = function (context) {
    var scene = new cc.Scene();
    var layer = new MainLayer();
    scene.addChild(layer);
    return scene;
};
