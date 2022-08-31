package util.supportClass;

public class TimeSupport {
    public static long unixTimeNow(){
        return System.currentTimeMillis();
    }
    public static long unixTimeSecondNow(){
        return System.currentTimeMillis() / 1000L;
    }

}
