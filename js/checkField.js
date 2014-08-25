/**
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (checkField.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
*
*    checkField.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    checkField.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

function checkField(field) {
	if (field !== undefined || field !== null)
		return field;
	else
		return "";
}
