package net.iubris.ipc_d3.openhours;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.DecimalFormat;

import org.json.CDL;
import org.json.JSONArray;
import org.json.JSONObject;

import net.iubris.datautils.FileUtils;

public class CsvToOpenHoursCsv {
	
	public static void main(String[] args) {
		try {
//			String input = args[0];
			String input = "../../data/divertimento_e_ristoro.csv";
			String jsonFileAsString = FileUtils.readFile(input, Charset.defaultCharset());
			JSONArray adjustedHours = new CsvToOpenHoursCsv().adjustHours(jsonFileAsString);
			String openHoursCSV = new CsvToOpenHoursCsv().adjustHoursToCSV(adjustedHours);
			FileUtils.writeToFile(openHoursCSV, "divertimento_e_ristoro_-_openhours.csv");
			String openHoursJSON = new CsvToOpenHoursCsv().adjustHoursToJSONString(adjustedHours);
			FileUtils.writeToFile(openHoursJSON, "divertimento_e_ristoro_-_openhours.json");
//			System.out.println(openHoursCSV);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private String adjustHoursToCSV(JSONArray jsonArrayAdjusted) {
		return CDL.toString(jsonArrayAdjusted);
	}
	private String adjustHoursToJSONString(JSONArray jsonArrayAdjusted) {
		return jsonArrayAdjusted.toString();
	}

	private JSONArray adjustHours(String jsonFileAsString) {
		JSONArray jsonArray = CDL.toJSONArray(jsonFileAsString);
		
		JSONArray newJsonArray = new JSONArray();
		
		int length = jsonArray.length();		
		for (int i=0;i<length;i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			
			JSONObject newJsonObject = new JSONObject();
			
			String header = "";
			
			header = "nome";
			newJsonObject.put(header, jsonObject.getString(header) );
			
			String openHours = "Mon-Sun ";
			
			double apertura = jsonObject.getDouble("apertura");
			openHours+= getAmPm(apertura)+" - ";
			
			double chiusura = jsonObject.getDouble("chiusura");
			openHours += getAmPm(chiusura);
			
			newJsonObject.put("openhours", openHours);
			
			
			String[] headers = new String[]{"geolocazione","indirizzo","numero-civico","cap","quartiere","citta","telefono","fax","mobile","email","web","tipi","tipi-specifici"};
			for (String h: headers) {
				newJsonObject.put(h, jsonObject.getString(h) );
			}
			
			newJsonArray.put(newJsonObject);
		}
		
		return newJsonArray;
	}
	
	private String getAmPm(double hours) {
		
		DecimalFormat df2 = new DecimalFormat("#.00");
		String hoursString = ""+df2.format(hours);
		hoursString = hoursString.replace(",", ":")+" ";
		if (hours<12)
			hoursString+="am";
		else
			hoursString+="pm";
		return hoursString;
	}

}
