/**
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (ajaxJsonLoader.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of <https://github.com/BeardTeam/opendata-experiments>
*
*    ajaxJsonLoader.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    ajaxJsonLoader.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

$.ajax({
	url: jsonFile,
	async: true,
	dataType: 'json',
	timeout: 10000,
	success: visualize,
	error: handleError
});

function handleError(data) {
	if (data.readyState === 4 && data.status === 200 && data.statusText === "OK")
		visualize(data.responseText);
	else
		console.error(data);
}
