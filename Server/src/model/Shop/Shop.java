package model.Shop;

import controller.MainController;
import model.PlayerInfo;
import util.supportClass.TimeSupport;
import util.database.DataModel;

import java.sql.Date;


public class Shop extends DataModel {
    private  LoginItem commonLoginItem;
    private  Date commonCurDate ;

    private LoginItem loginItem;
    private GoldBuying goldBuying;
    private Date curDate;
    private long timeRemaining;
    public Shop(){
        super();
        commonCurDate = new Date(0);
        updateCommonLoginItem();
    }
    public Shop(PlayerInfo playerInfo){
        super();
        curDate = new Date(0);
        this.updateLoginItem(playerInfo);
        goldBuying = new GoldBuying();
    }
    public void updateCommonLoginItem(){
        Date today = new Date(TimeSupport.unixTimeNow());
        if (!commonCurDate.toString().equals(today.toString())) {
            commonCurDate = today;
            commonLoginItem = new LoginItem();
        }
    }
    public void updateLoginItem(PlayerInfo playerInfo){
        MainController.getShop().updateCommonLoginItem();
        MainController.saveModel(MainController.getShop());
        commonLoginItem = MainController.getShop().getCommonLoginItem();
        commonCurDate = MainController.getShop().getCommonCurDate();
        Date today = new Date(TimeSupport.unixTimeNow());
        if (!curDate.toString().equals(today.toString())) {
            this.curDate = today;
            this.loginItem = new LoginItem(playerInfo,commonLoginItem);
        }
        Date curDateTime = new Date(TimeSupport.unixTimeNow());
        Date beginCurDateTime = Date.valueOf(curDateTime.toString());
        this.timeRemaining =  ((long) 3600*24 - (curDateTime.getTime() - beginCurDateTime.getTime())/1000L);


    }
    public LoginItem getLoginItem() {
        return loginItem;
    }
    public GoldBuying getGoldBuying() {
        return goldBuying;
    }

    public long getTimeRemaining() {
        return timeRemaining;
    }

    public LoginItem getCommonLoginItem() {
        return commonLoginItem;
    }

    public Date getCommonCurDate() {
        return commonCurDate;
    }
}
