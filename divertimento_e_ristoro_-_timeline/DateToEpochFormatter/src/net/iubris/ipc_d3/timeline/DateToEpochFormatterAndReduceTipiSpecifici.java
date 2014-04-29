package net.iubris.ipc_d3.timeline;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import net.iubris.datautils.FileUtils;

import org.json.CDL;
import org.json.JSONArray;
import org.json.JSONObject;

public class DateToEpochFormatterAndReduceTipiSpecifici {

	public static void main(String[] args) {
		try {
//			String input = args[0];
			String input = "../divertimento_e_ristoro_-_timeline.json";
			input = "../../data/divertimento_e_ristoro.csv";
			String jsonFile = FileUtils.readFile(input, Charset.defaultCharset());
			JSONArray adjustedTimeAndTipiSpecifici = new DateToEpochFormatterAndReduceTipiSpecifici().adjustTimeAndTipiSpecifici(jsonFile);
			String adjustedTimeAndTipiSpecificiString = adjustedTimeAndTipiSpecifici.toString();
			FileUtils.writeToFile(adjustedTimeAndTipiSpecificiString, "../divertimento_e_ristoro_-_timeline.json");
//			System.out.println( adjustedTimeAndTipiSpecificiString );
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
	
	private JSONArray adjustTimeAndTipiSpecifici(String dataAsCSV) throws ParseException {
		JSONArray jsonArray = CDL.toJSONArray(dataAsCSV);
		int length = jsonArray.length();
		JSONArray jsonArrayNew = new JSONArray();
		for (int i=0;i<length;i++) {		
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			JSONObject jsonObjectNew = new JSONObject();
			
			jsonObjectNew.put("label",jsonObject.getString("nome"));
			jsonObjectNew.put("indirizzo",jsonObject.getString("indirizzo"));
			jsonObjectNew.put("numeroCivico",jsonObject.getString("numero-civico"));
			jsonObjectNew.put("cap",jsonObject.getString("cap"));
			jsonObjectNew.put("quartiere",jsonObject.getString("quartiere"));
			jsonObjectNew.put("citta",jsonObject.getString("citta"));
			jsonObjectNew.put("geolocazione",jsonObject.getString("geolocazione"));
			jsonObjectNew.put("telefono",jsonObject.getString("telefono"));
			jsonObjectNew.put("mobile",jsonObject.getString("mobile"));
			jsonObjectNew.put("email",jsonObject.getString("email"));
			jsonObjectNew.put("web",jsonObject.getString("web"));
			jsonObjectNew.put("tipi",jsonObject.getString("tipi"));
			jsonObjectNew.put("tipiSpecifici",jsonObject.getString("tipi-specifici"));
			
			
			
			String tipiSpecifici = jsonObject.getString("tipi-specifici");
			String tipiSpecificiReduced = "";
			switch (tipiSpecifici) {
				case "Discoteca":
					tipiSpecificiReduced = "Discoteca";
					break;
				case "Pub, DiscoPub":
					tipiSpecificiReduced = "DiscoPub";
					break;
				case "Cocktail Bar":
					tipiSpecificiReduced = "Cocktail";
					break;
				case "Cocktail Bar, American Bar, Ristorante":
					tipiSpecificiReduced = "American";
					break;
				case "Cocktail Bar, Pizzeria, Ristorante, Panineria":
					tipiSpecificiReduced = "Panineria";
					break;
				case "Wine Bar, Pub":
					tipiSpecificiReduced = "Pub";
					break;
				case "Wine Bar":
					tipiSpecificiReduced = "Wine";
					break;
				default:
					tipiSpecificiReduced = "";
					break;					
			}
			
			jsonObjectNew.put("tipiSpecificiReduced", tipiSpecificiReduced);

			DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String date = "1970-01-01";
			JSONArray times = new JSONArray();
			String apertura = jsonObject.getString("apertura");
			long startingTimeEpoch = 0;
			if (apertura.isEmpty())
				apertura = "19.00"; // default
			startingTimeEpoch = sdf.parse(date+" "+apertura.replace(".", ":")).getTime();
			
			String chiusura = jsonObject.getString("chiusura");
			long endingTimeEpoch = 0;
			if (chiusura.isEmpty())
				chiusura = "1.00"; // default
			double parsedEndingTime = Double.parseDouble(chiusura);
			if ( parsedEndingTime >= 0f && parsedEndingTime < 6f ) // we are in next day
				date = "1970-01-02";
			endingTimeEpoch = sdf.parse(date+" "+chiusura.replace(".", ":")).getTime();
			
			String startingTimeEpoched = ""+startingTimeEpoch;
			String endingTimeEpoched = ""+endingTimeEpoch;
			JSONObject et = new JSONObject();
			et.put("starting_time", startingTimeEpoched);
			et.put("ending_time", endingTimeEpoched);
			times.put(et);
			
			jsonObjectNew.put("times", times);
			jsonArrayNew.put(jsonObjectNew);
		}
		return jsonArrayNew;
	}
}
