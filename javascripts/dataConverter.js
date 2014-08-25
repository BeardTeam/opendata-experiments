/**
* Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
* This file (ajaxJsonLoader.js) is part of ipc-d3, 
* 	and developed by: Antonio Notarangelo - 
* 	<progsoul91@gmail.com> - https://plus.google.com/+AntonioNotarangelo91
* 	as part of https://github.com/BeardTeam/opendata-experiments
* 
*     ajaxJsonLoader.js is free software: you can redistribute it and/or modify
*     it under the terms of the GNU General Public License as published by
*     the Free Software Foundation, either version 3 of the License, or
*     (at your option) any later version.
* 
*     ajaxJsonLoader.js is distributed in the hope that it will be useful,
*     but WITHOUT ANY WARRANTY; without even the implied warranty of
*     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*     GNU General Public License for more details.
* 
*     You should have received a copy of the GNU General Public License
*     along with .  If not, see <http://www.gnu.org/licenses/>.
*/

var convertToJSON = function(data, origin) {
  return (origin == 'cloc') ? convertFromClocToJSON(data) : convertFromWcToJSON(data);
};

/**
 * Convert the output of cloc in csv to JSON format
 *
 *  > cloc . --csv --exclude-dir=vendor,tmp --by-file --report-file=data.cloc
 */
var convertFromClocToJSON = function(data) {
  var lines = data.split("\n");
  lines.shift(); // drop the header line

  var json = {};
  lines.forEach(function(line) {
    var cols = line.split(',');
    var filename = cols[1];
    if (!filename) return;
    var elements = filename.split(/[\/\\]/);
    var current = json;
    elements.forEach(function(element) {
      if (!current[element]) {
        current[element] = {};
      }
      current = current[element];
    });
    current.language = cols[0];
    current.size = parseInt(cols[4], 10);
  });

  json = getChildren(json)[0];
  json.name = 'root';

  return json;
};

/**
 * Convert the output of wc to JSON format
 *
 *  > git ls-files | xargs wc -l
 */
var convertFromWcToJSON = function(data) {
  var lines = data.split("\n");

  var json = {};
  var filename, size, cols, elements, current;
  lines.forEach(function(line) {
      cols = line.trim().split(' ');
      size = parseInt(cols[0], 10);
      if (!size) return;
      filename = cols[1];
      if (filename === "total") return;
      if (!filename) return;
      elements = filename.split(/[\/\\]/);
      current = json;
      elements.forEach(function(element) {
          if (!current[element]) {
              current[element] = {};
          }
          current = current[element];
      });
      current.size = size;
  });

  json.children = getChildren(json);
  json.name = 'root';

  return json;
};

/**
 * Convert a simple json object into another specifying children as an array
 * Works recursively
 *
 * example input:
 * { a: { b: { c: { size: 12 }, d: { size: 34 } }, e: { size: 56 } } }
 * example output
 * { name: a, children: [
 *   { name: b, children: [
 *     { name: c, size: 12 },
 *     { name: d, size: 34 }
 *   ] },
 *   { name: e, size: 56 }
 * ] } }
 */
var getChildren = function(json) {
  var children = [];
  if (json.language) return children;
  for (var key in json) {
    var child = { name: key };
    if (json[key].size) {
      // value node
      child.size = json[key].size;
      child.language = json[key].language;
    } else {
      // children node
      var childChildren = getChildren(json[key]);
      if (childChildren) child.children = childChildren;
    }
    children.push(child);
    delete json[key];
  }
  return children;
};

// Recursively count all elements in a tree
var countElements = function(node) {
  var nbElements = 1;
  if (node.children) {
    nbElements += node.children.reduce(function(p, v) { return p + countElements(v); }, 0);
  }
  return nbElements;
};
