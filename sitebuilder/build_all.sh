#!/bin/bash

cp ../benchmark/output/*.json input/

for f in input/*.json
do
    arg=`basename $f .json`
    python compose_single.py "$arg"
    cp "$f" output/pages/

done

python compose_cm.py "001.pla.s"
python compose_cm.py "005.pla.s"
python compose_cm.py "010.pla.s"
python compose_cm.py "020.pla.s"
python compose_cm.py "030.pla.s"
python compose_cm.py "060.pla.s"

python compose_cm.py "001.pla.w"
python compose_cm.py "005.pla.w"
python compose_cm.py "010.pla.w"
python compose_cm.py "020.pla.w"
python compose_cm.py "030.pla.w"
python compose_cm.py "060.pla.w"

python compose_cm.py "001.mpl.m"
python compose_cm.py "005.mpl.m"
python compose_cm.py "010.mpl.m"
python compose_cm.py "020.mpl.m"
python compose_cm.py "030.mpl.m"
python compose_cm.py "060.mpl.m"

python compose_ct.py "pla.s.lap001"
python compose_ct.py "pla.w.lap001"
python compose_ct.py "mpl.m.lap001"

python compose_ct.py "pla.s.lap002"
python compose_ct.py "pla.w.lap002"
python compose_ct.py "mpl.m.lap002"

python compose_ct.py "pla.s.mac002"
python compose_ct.py "pla.w.mac002"
python compose_ct.py "mpl.m.mac002"

python compose_ct.py "pla.s.vps001"
python compose_ct.py "pla.w.vps001"
python compose_ct.py "mpl.m.vps001"
