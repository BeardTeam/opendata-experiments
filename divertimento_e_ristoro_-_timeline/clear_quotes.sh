#!/bin/bash

[ $# -lt 1 ] && exit 1

IN=$1
TMP="${IN}.bak"
cp ${IN} ${TMP}
cat ${TMP} | sed 's/,"/,/g' | sed 's/":/:/g' | sed 's/{"/{/g' > ${IN}
rm -f ${TMP}

