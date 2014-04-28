package net.iubris.ipc_d3;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import net.iubris.datautils.FileUtils;

import org.json.JSONArray;
import org.json.JSONObject;

public class DateToEpochFormatterAndReduceTipiSpecifici {

	public static void main(String[] args) {
		try {
//			String input = args[0];
			String input = "../divertimento_e_ristoro_-_timeline.json";
			String jsonFile = FileUtils.readFile(input, Charset.defaultCharset());
			String adjustedTimeAndTipiSpecifici = new DateToEpochFormatterAndReduceTipiSpecifici().adjustTimeAndTipiSpecifici(jsonFile);
			FileUtils.writeToFile(adjustedTimeAndTipiSpecifici, "../divertimento_e_ristoro_-_timeline__epoched_tipireduced.json");
//			System.out.println( adjustedTimeAndTipiSpecifici );
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
	
	private String adjustTimeAndTipiSpecifici(String dataAsString) throws ParseException {
		JSONArray jsonArray = new JSONArray(dataAsString);
		int length = jsonArray.length();
//		System.out.println(jsonArray);
		for (int i=0;i<length;i++) {		
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			/*
			int id = jsonObject.getInt("id");
			String label = jsonObject.getString("label");
			String indirizzo = jsonObject.getString("indirizzo");
			int numeroCivico = jsonObject.getInt("numero-civico");
			int cap = jsonObject.getInt("cap");
			String quartiere = jsonObject.getString("quartiere");
			String citta = jsonObject.getString("citta");
			String geolocazione = jsonObject.getString("geolocazione");
			String telefono = jsonObject.getString("telefono");
			String fax = jsonObject.getString("fax");
			String mobile = jsonObject.getString("mobile");
			String email = jsonObject.getString("email");
			String web = jsonObject.getString("web");
			String tipi = jsonObject.getString("tipi");
			String tipiSpecifici = jsonObject.getString("tipi-specifici");
			*/
			
			String tipiSpecifici = jsonObject.getString("tipi-specifici");
			String tipiSpecificiNew = "";
			switch (tipiSpecifici) {
				case "Discoteca":
					tipiSpecificiNew = "Discoteca";
					break;
				case "Pub, DiscoPub":
					tipiSpecificiNew = "DiscoPub";
					break;
				case "Cocktail Bar":
					tipiSpecificiNew = "Cocktail";
					break;
				case "Cocktail Bar, American Bar, Ristorante":
					tipiSpecificiNew = "American";
					break;
				case "Cocktail Bar, Pizzeria, Ristorante, Panineria":
					tipiSpecificiNew = "Panineria";
					break;
				case "Wine Bar, Pub":
					tipiSpecificiNew = "Pub";
					break;
				case "Wine Bar":
					tipiSpecificiNew = "Wine";
					break;
				default:
					tipiSpecificiNew = "";
					break;					
			}
//			jsonObject.put("tipi_specifici", tipiSpecifici);
			jsonObject.put("tipi_specifici-reduced", tipiSpecificiNew);
			/*
			Discoteca d3.js:7621
			Pub, Discopub d3.js:7621
			Cocktail Bar d3.js:7621
			Cocktail Bar, American Bar, Ristorante d3.js:7621
			Cocktail Bar, Pizzeria, Ristorante, Panineria d3.js:7621
			Wine Bar, Pub d3.js:7621
			Wine Bar 
			*/
			
			DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String date = "1970-01-01";
//			JSONObject times = jsonObject.getJSONObject("times");
			JSONArray times = jsonObject.getJSONArray("times");
			String startingTime = times.getJSONObject(0).getString("starting_time");
			long startingTimeEpoch = 0;
			if (startingTime.isEmpty())
				startingTime = "19.00"; // default
				
//			sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			startingTimeEpoch = sdf.parse(date+" "+startingTime.replace(".", ":")).getTime();
			
//			System.out.println(startingTimeEpoch);
			String endingTime = times.getJSONObject(0).getString("ending_time");
			long endingTimeEpoch = 0;
			if (endingTime.isEmpty())
				endingTime = "1.00"; // default
			
			double parsedEndingTime = Double.parseDouble(endingTime);
			if ( parsedEndingTime >= 0f && parsedEndingTime < 6f /*endingTime.length()==4*/) { // we are in next day
				date = "1970-01-02";
			}
			endingTimeEpoch = sdf.parse(date+" "+endingTime.replace(".", ":")).getTime();
			
//			System.out.println(jsonObject.getString("label")+": "+startingTime+ " - "+ endingTime);
//			System.out.println( endingTimeEpoch - startingTimeEpoch);
			
			String startingTimeEpoched = (startingTimeEpoch!=0 ? ""+startingTimeEpoch : "");
			String endingTimeEpoched = (endingTimeEpoch!=0 ? ""+endingTimeEpoch : "");
			JSONObject et = new JSONObject();
			et.put("starting_time", startingTimeEpoched);
			et.put("ending_time", endingTimeEpoched);
			times.put(0,et);
			
			jsonObject.put("times", times);
			jsonArray.put(i, jsonObject);
		}
		return jsonArray.toString();		
	}
}
