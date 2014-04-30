/**
 * 
 */

var nameFileWithPathWithoutExtension = "../divertimento_e_ristoro_-_openhours/divertimento_e_ristoro_-_openhours";
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
	                {key:"tipiSpecifici",value:"Discoteca"},
	                {key:"tipiSpecifici",value:"Pub, DiscoPub"}
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
	var query = $objeq(key+" =~ %1 -> {cap: cap}",value); // poi
	var res = query(json);
	var caps = [];
	for (var i=0;i<res.length;i++) {
		var cap = res[i].cap;
		caps.push(cap);
	}
	var capsCounted = count(caps);
	var capsN = capsCounted[0];
	var counted = capsCounted[1];
	var htmlResult = "<div><b>"+value+"</b></div>";
	for (var c=0;c<capsN.length;c++) {
		htmlResult+= "<div>"+capsN[c]+" "+counted[c]+"</div>";
	}
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