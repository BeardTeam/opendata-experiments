/*******************************************************************************
 * Copyleft (c) 2014, "Massimiliano Leone 
 * <maximilianus@gmail.com> - https://plus.google.com/+MassimilianoLeone"
 * This file (CreateJson.java) is part of CreateJson.
 * 
 *     CreateJson.java is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     CreateJson.java is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 * 
 *     You should have received a copy of the GNU General Public License
 *     along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package net.iubris.ipc_d3.multidimensionaltimeline;

import java.io.IOException;
import java.nio.charset.Charset;
import java.text.ParseException;

import net.iubris.datautils.FileUtils;

import org.json.CDL;
import org.json.JSONArray;
import org.json.JSONObject;

public class CreateJson {

	public static void main(String[] args) {
		try {
//			String input = args[0];
			
			Charset encoding = Charset.defaultCharset();
			
			String csvFilesDir = "../";
			
			String redditoFileName = csvFilesDir+"Serie_Storiche_Istat_Reddito_Italiani_1995_-_2011_-_d3__reddito_disponibile_netto.csv";
			String redditoCSV = FileUtils.readFile(redditoFileName, encoding);
			
			String popolazioneFileName = csvFilesDir+"Serie_Storiche_Istat_Reddito_Italiani_1995_-_2011_-_d3__popolazione_residente.csv";
			String popolazioneCSV = FileUtils.readFile(popolazioneFileName, encoding);
			
			String occupatiFileName = csvFilesDir+"Occupati_1995-2011_-_Sheet2.csv";
			String occupatiCSV = FileUtils.readFile(occupatiFileName, encoding);
			
			JSONArray createdJson = new CreateJson().createJson(redditoCSV, popolazioneCSV, occupatiCSV);
			
//			JSONArray adjustedTimeAndTipiSpecifici = new CreateJson().adjustTimeAndTipiSpecifici(jsonFile);
			String createdJsonString = createdJson.toString();
			FileUtils.writeToFile(createdJsonString, "../italiani_popolazione_reddito_occupazione_1995-2011.json");
//			System.out.println( createdJson );
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
	
	private JSONArray createJson(String redditoCSV, String popolazioneCSV, String occupatiCSV) throws ParseException {
		JSONArray redditoJsonArray = CDL.toJSONArray(redditoCSV);
		JSONArray popolazioneJsonArray = CDL.toJSONArray(popolazioneCSV);
		JSONArray occupatiJsonArray = CDL.toJSONArray(occupatiCSV);
		
		int length = redditoJsonArray.length();
		/*System.out.println(redditoJsonArray.length());
		System.out.println(popolazioneJsonArray.length());
		System.out.println(occupatiJsonArray.length());*/
		JSONArray jsonArrayNew = new JSONArray();
		for (int i=0;i<length;i++) {
			JSONObject redditoJsonObject = redditoJsonArray.getJSONObject(i);
			JSONObject popolazioneJsonObject = popolazioneJsonArray.getJSONObject(i);
			JSONObject occupatiJsonObject = occupatiJsonArray.getJSONObject(i);
			
			JSONObject jsonObjectNew = new JSONObject();
			
			jsonObjectNew.put("nomeRegione", redditoJsonObject.getString("Regione"));
			jsonObjectNew.put("area", redditoJsonObject.getString("Area"));
			
			JSONArray incomeJsonArray = new JSONArray();
			JSONArray populationJsonArray = new JSONArray();
			JSONArray occupationalJsonArray = new JSONArray(); // really, it's work occupation
			for (int year=1995;year<=2011;year++) {
				JSONArray yearValueJsonArrayForIncome = new JSONArray();
				yearValueJsonArrayForIncome.put(year).put( redditoJsonObject.getDouble(""+year));
				incomeJsonArray.put(yearValueJsonArrayForIncome);
				
				JSONArray yearValueJsonArrayForPopulation = new JSONArray();
				yearValueJsonArrayForPopulation.put(year).put( popolazioneJsonObject.getDouble(""+year));
				populationJsonArray.put(yearValueJsonArrayForPopulation);
				
				
				JSONArray yearValueJsonArrayForLifeExpectancy = new JSONArray();
				yearValueJsonArrayForLifeExpectancy.put(year).put( occupatiJsonObject.getDouble(""+year));
				occupationalJsonArray.put(yearValueJsonArrayForLifeExpectancy);
				
//				System.out.println(year);
			}
			
			jsonObjectNew.put("reddito", incomeJsonArray);
			jsonObjectNew.put("popolazione", populationJsonArray);
			jsonObjectNew.put("occupazione", occupationalJsonArray);
			

			jsonArrayNew.put(jsonObjectNew);
		}
		return jsonArrayNew;
	}
}
