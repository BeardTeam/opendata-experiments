/*******************************************************************************
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (smoothScrolling.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
*
*    smoothScrolling.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    smoothScrolling.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

/*
 * from http://www.hughlashbrooke.com
 */
function scrollToElement( target ) {
    var topoffset = 30;
    var speed = 800;
    var destination = jQuery( target ).offset().top - topoffset;
    jQuery( 'html:not(:animated),body:not(:animated)' ).animate( { scrollTop: destination}, speed, function() {
        window.location.hash = target;
    });
    return false;
}
