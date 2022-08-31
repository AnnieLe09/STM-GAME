package util;

import com.google.gson.JsonParser;
import model.Define.MapDefine;
import model.Map.Map;
import org.json.JSONException;
import org.json.JSONObject;
import util.vector.VecDouble;
import util.vector.VecInt;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class Helper {
    public static Object ReadJsonObject(String fileName){
            JsonParser jsonParser = new JsonParser();
            try (FileReader reader = new FileReader(fileName)) {
                Object obj = jsonParser.parse(reader);
                return new JSONObject(obj.toString());
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        return null;
    }

    public static VecDouble convertPoint2Pixel(VecInt point){
        return new VecDouble(point.x + 0.5, point.y + 0.5);
    }

    public static double roundTo3(double x){
        return Math.round(x*1000)/(double)1000;
    }
}


