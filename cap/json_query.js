/*******************************************************************************
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (json_query.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
*
*    json_query.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    json_query.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/**
 * 
 */

//var nameFileWithPathWithoutExtension = "data_totale_camelized_some_fields";
var nameFileWithPathWithoutExtension = "data_totale_camelized_some_fields";
//var csvFile =  nameFileWithPathWithoutExtension+".csv";
var jsonFile = nameFileWithPathWithoutExtension+".json";

// loading json zone
var json;
$.ajax({
	url: jsonFile,
	async: true,
	dataType: 'text/json',
	timeout: 10000,
	success: parse,
	error: handleError
});
function parse(data) {
	json = JSON.parse(data);
	var queryMap = [
	  /*{key:"tipiSpecifici",value:"Discoteca"}
	  ,{key:"tipiSpecifici",value:"Pub, Discopub"},
	  {key:"tipi",value:"accoglienza"},
	  {key:"tipiSpecifici",value:"Hotel"},
	  {key:"tipiSpecifici",value:"Bed and Breakfast"},
	  {key:"tipiSpecifici",value:"Chiesa"},
	  {key:"tipiSpecifici",value:"Palazzo"},
	  {key:"tipiSpecifici",value:"Galleria artistica, Museo"}
	  ,*/{key:"tipi",value:"ristoro"}
	  ,{key:"tipi",value:"divertimento, ristoro"}
    ];
	for (var q=0;q<queryMap.length;q++) {
		doQuery(json,queryMap[q].key,queryMap[q].value);
	}

//	doQuery(json);
}
function handleError(data) {
	if (data.readyState === 4 && data.status === 200 && data.statusText === "OK")
		parse(data.responseText);
	else
		console.error(data);
}

function doQuery(json, key, value) {
//	var query = $objeq("nome =~ %1 -> {nome: nome, geolocazione: geolocazione, indirizzo: indirizzo, numeroCivico: numeroCivico, telefono: telefono, mobile: mobile, web: web, tipiSpecifici: tipiSpecifici}",place.name);
//	var query = $objeq("tipiSpecifici =~ %1 -> {cap: cap} ","DiscoPub");
/*	var query = $objeq(key+" =~ %1 -> {cap: cap}",value);	
	var res = query(json);
	console.log(res);
	var capsRepeated = [];
	for (var i=0;i<res.length;i++) {
		var cap = res[i].cap;
		capsRepeated.push(cap);
	}
	var caps = capsRepeated.filter( onlyUnique );
	*/
	var capsCountMap = getCapsCountMap(json,key,value);
//	console.log(caps);
	/*var capsCounted = count(caps);
	console.log(capsCounted);
	var capsN = capsCounted[0];
	var counted = capsCounted[1];
	*/
	var htmlResult = "<div><b>"+value+"</b></div>";
	for (var c in capsCountMap) {
		htmlResult+= "<div>"+c+" "+capsCountMap[c]+"</div>";
	}
//	var htmlResult = "<div><b>"+value+"</b></div>";
//	capsCountMap
//	htmlResult += "<div>--</div>";
	var currentHtml = $('#out').html();
	$('#out').html(currentHtml+htmlResult);
}


function count(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a, b];
}

function getCapsCountMap(json,key,value) {
	var queryString = key+" IN %1 -> {nome: nome, tipiSpecifici: tipiSpecifici, cap: cap}";
//	console.log(queryString);
	var query = $objeq(queryString,value);
//	var query = $objeq("{cap: cap}");
//	console.log(query);
	var res = query(json);
//	console.log(res);
	//var capsRepeated = [];
	var capsCountMap = new Object();
	for (var i=0;i<res.length;i++) {
		var cap = res[i].cap;		
//		console.log("testing "+cap);
		if (!capsCountMap.hasOwnProperty(cap))
			capsCountMap[cap] = 1;
		else
			capsCountMap[cap] = capsCountMap[cap] +1;
//		console.log(caps);
//		capsRepeated.push(cap);
	}
//	console.log(Object.keys(caps));
//	console.log(capsCountMap);
	//var caps = capsRepeated.filter( onlyUnique );
	
	return capsCountMap;
//	var caps = {}
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
