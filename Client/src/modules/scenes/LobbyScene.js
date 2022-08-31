var LobbyLayer = BaseLayer.extend({
    ctor: function (context) {
      this._super(context, res.JSON_LOBBY_LAYER);
      this.setUserInfo(gv.mainController.user);

      this.initButton();
    },

    setUserInfo: function(user){
        user.registerUserTrophy(this);
      this.name.string = user.name;
      this.trophy.string = user.trophy;
      this.setChests(user);
    },

    setChests:function(user){
      this.chestList = new GridView(4, 1, cc.size(GC.CHEST.WIDTH, GC.CHEST.HEIGHT), 10, true);
      this.chestList.setAnchorPoint(cc.p(0.5, 0));
      this.chestList.setPosition(cc.p(this.chestPanel.width / 2, 30));
      this.chestPanel.addChild((this.chestList));
      for(let i = 0; i < GC.CHEST.NUM; ++i){
        this.chestList.insertCell(new LobbyChest(this, cc.size(GC.CHEST.WIDTH, GC.CHEST.HEIGHT), null));
      }
      for(let i = 0; i < user.chests.length; ++i){
        this.chestList._cells[0][i].setChest(user.chests[i]);
      }
      for(let i = user.chests.length; i < 4; ++i){
        this.chestList._cells[0][i].setChest(null);
      }
    },
    changeUserTrophy:function (trophy){
      this.trophy.string = trophy;
    },
    
    initButton:function(){
        //this.trophyIcon.setTouchEnabled(true);
        this.trophyPanel.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                gv.cheatController.sendCheatUpTrophy(100);
            }
        },this);
      this.battleBtn.addTouchEventListener(this.onButtonClicked,this);
      this.infoPanel.getChildByName("avatar").addTouchEventListener(function(sender, type){
          if(type == ccui.Widget.TOUCH_ENDED){
              gv.mainController.sendResetUserInfo();
          }
      },this);
    },

    onButtonClicked: function(sender, type){
      if(type == ccui.Widget.TOUCH_BEGAN){
          fr.view(FindMatchScene, 0.1);


          //fr.view(BattleScene);
            // dang bi loi bat dong bo!!!!!!!!!!
            // fr.view(BattleScene);
      }
    },
  });
  