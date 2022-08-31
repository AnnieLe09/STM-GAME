package util.readJson;

import com.google.gson.JsonParser;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class ReadJson {
    private JSONObject jsonDetail;

    public ReadJson(String fileName) {
        JsonParser jsonParser = new JsonParser();
        try (FileReader reader = new FileReader(fileName)) {
            Object obj = jsonParser.parse(reader);
            this.jsonDetail = new JSONObject(obj.toString());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public String getWithJSONObject(JSONObject obj, String[] s){
        if (s.length == 0) {
            return obj.toString();
        }
        for (int i = 0; i < s.length; i++) {
            try {
                if (i < s.length - 1) {
                    obj = (JSONObject) obj.get(s[i]);
                } else {

                    return obj.get(s[i]).toString();
                }
            } catch (Exception e) {
                e.printStackTrace();
                return "";
            }
        }
        return "";
    }

    public  String get(String[] s) {
        JSONObject tmp = this.jsonDetail;
        return this.getWithJSONObject(tmp,s);
    }
    public String get(){
        JSONObject tmp = this.jsonDetail;
        String[] s = new String[0];
        return this.getWithJSONObject(tmp,s);
    }

    public String getWithJsonString( String source, String key){
        JSONObject tmp = null;
        try {
            tmp = new JSONObject(source);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String[] s = new String[1];
        s[0]=key;
        return this.getWithJSONObject(tmp,s);
    }
    public int getIntWithJsonString( String source, String key){
        String ans = this.getWithJsonString(source,key);
        return Integer.parseInt(ans);
    }
    public double getDoubleWithJsonString( String source, String key){
        String ans = this.getWithJsonString(source,key);
        return Double.parseDouble(ans);
    }
    public String removeOneBraket(String source){
        return source.substring(1,source.length() - 1);
    }
}
