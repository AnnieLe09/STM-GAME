var Toast = ccui.Text.extend({
   ctor:function (){
       this._super("", res.FONT_SUPERCELL_MAGIC, 12);
       this.setVisible(true);
   },
    display:function (time){
       this.setVisible(true);
       this.scheduleOnce(function() {
            this.setVisible(false);
       }, time);
    }
});