#!/bin/bash


function getYear() {
   line=$1
   year=$(echo $line | cut -d"," -f1)
   echo $year
}
function getCircolante() {
   line=$1
   circolante=$(echo $line | cut -d"," -f2)
   echo $circolante
}
function getImmatricolata() {
   line=$1
   immatricolata=$(echo $line | cut -d"," -f4)
   echo $immatricolata
}

i=0
while read line; do
   year=$(getYear $line)
   year=$i
   circolante=$(getCircolante $line)

   echo -n "{ x:" $year, y: $circolante },
   i=$((i+1))
done < circolanti_e_immatricolate.csv

echo 
echo

i=0
while read line; do
   year=$(getYear $line)
   year=$i
   immatricolata=$(getImmatricolata $line)

   echo -n "{ x:" $year, y: $immatricolata },

   i=$((i+1))
done < circolanti_e_immatricolate.csv

echo
