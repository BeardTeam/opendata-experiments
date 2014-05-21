/*******************************************************************************
 * Copyleft (c) 2014, "Massimiliano Leone - <maximilianus@gmail.com> - https://plus.google.com/+MassimilianoLeone"
 * This file (CsvToOpenHours.java) is part of OpenHours_DataToCSV.
 * 
 *     CsvToOpenHours.java is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     CsvToOpenHours.java is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package net.iubris.ipc_d3.openhours;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.DecimalFormat;

import org.json.CDL;
import org.json.JSONArray;
import org.json.JSONObject;

import net.iubris.datautils.FileUtils;

public class CsvToOpenHours {
	
	public static void main(String[] args) {
		try {
//			String input = args[0];
			String input = "../../data/divertimento_e_ristoro.csv";
			String jsonFileAsString = FileUtils.readFile(input, Charset.defaultCharset());
			JSONArray adjustedHours = new CsvToOpenHours().adjustHours(jsonFileAsString);
			String openHoursCSV = new CsvToOpenHours().adjustHoursToCSVWithoutHeader(adjustedHours);
			FileUtils.writeToFile(openHoursCSV, "divertimento_e_ristoro_-_openhours.csv");
			String openHoursJSON = new CsvToOpenHours().adjustHoursToJSONString(adjustedHours);
			FileUtils.writeToFile(openHoursJSON, "divertimento_e_ristoro_-_openhours.json");
//			System.out.println(openHoursCSV);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private String adjustHoursToCSVWithoutHeader(JSONArray jsonArrayAdjusted) {
		String string = CDL.toString(new JSONArray("[nome,openhours,geolocazione,indirizzo,numeroCivico,cap,quartiere,citta,telefono,fax,mobile,email,web,tipi,tipiSpecifici]"), jsonArrayAdjusted);
		return string;
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
				if (h=="numero-civico")
					newJsonObject.put("numeroCivico", jsonObject.getString(h) );
				else if (h=="tipi-specifici")
					newJsonObject.put("tipiSpecifici", jsonObject.getString(h) );
				else
					newJsonObject.put(h, jsonObject.getString(h) );
			}
//			System.out.println(newJsonObject);
			newJsonArray.put(newJsonObject);
		}
		
		return newJsonArray;
	}
	
	private String getAmPm(double hours) {
		
		DecimalFormat df2 = new DecimalFormat("#.00");
		String hoursString = ""+df2.format(hours);
		hoursString = hoursString.replace(",", ":").replace(".", ":")+" ";
		if (hours<12)
			hoursString+="am";
		else
			hoursString+="pm";
		return hoursString;
	}

}
