/*******************************************************************************
 * Copyleft (c) 2014, "Massimiliano Leone 
 * <maximilianus@gmail.com> - https://plus.google.com/+MassimilianoLeone"
 * This file (CamelizeSomeFieldsAndExtractInformazioniStoricheDates.java) is part of CAP_CamelizeFields.
 * 
 *     CamelizeSomeFieldsAndExtractInformazioniStoricheDates.java is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     CamelizeSomeFieldsAndExtractInformazioniStoricheDates.java is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package net.iubris.ipc_d3.cap;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.iubris.datautils.FileUtils;

import org.json.CDL;
import org.json.JSONArray;
import org.json.JSONObject;

public class CamelizeSomeFieldsAndExtractInformazioniStoricheDates {

	public static void main(String[] args) {
		try {
//			String input = args[0];
			String input = "../../data/data_totale.csv";
			String csvString = FileUtils.readFile(input, Charset.defaultCharset());
			
			csvString.replace("\"\"\"", "\"");
			JSONArray adjustedTimeAndTipiSpecifici = new CamelizeSomeFieldsAndExtractInformazioniStoricheDates().adjustTimeAndTipiSpecifici(csvString);
			String adjustedTimeAndTipiSpecificiString = adjustedTimeAndTipiSpecifici.toString();
			System.out.println( adjustedTimeAndTipiSpecificiString );
			FileUtils.writeToFile(adjustedTimeAndTipiSpecificiString, "../data_totale_camelized_some_fields.json");
			

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
			
			jsonObjectNew.put("nome",jsonObject.getString("nome"));
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
			
//			jsonObjectNew.put("tipiSpecificiReduced", getTipiReduced(jsonObject));
//			jsonObjectNew.put("times", getTimes(jsonObject));
			
			LinkedList<String> date = findNumbers( jsonObject.getString("luogo-da-visitare.informazioni_storiche"));
			String dateString = date.toString().replace("[", "").replace("]", "");
			jsonObjectNew.put("luoghiDaVisitare.informazioniStoriche.date", dateString);
			
			jsonArrayNew.put(jsonObjectNew);
		}
		return jsonArrayNew;
	}
	
	private LinkedList<String> findNumbers(CharSequence line) {
		LinkedList<String> numbers = new LinkedList<String>();

		Pattern p = Pattern.compile("\\d+");
		Matcher m = p.matcher(line); 
		while (m.find()) {
		   numbers.add(m.group());
		}
		return numbers;
	}
	
	private String getTipiReduced(JSONObject jsonObject) {
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
		return tipiSpecificiReduced;
	}
	
	private JSONArray getTimes(JSONObject jsonObject) throws ParseException{
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
		
		return times;
	}
}
