#!/usr/bin/env python
# coding=utf-8

"""
Temporary script to build HTML pages from result JSON files.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import io
import os
import sys

__author__ = "Alberto Pettarin"
__copyright__ = "Copyright 2016-2017, Alberto Pettarin (www.albertopettarin.it)"
__license__ = "GNU AGPL 3"
__version__ = "0.0.1"
__email__ = "aeneas@readbeyond.it"
__status__ = "Production"


template_file_path = "templates/base.html"

input_directory_path = "input"
output_directory_path = "output/pages"

inp = sys.argv[1]

with io.open(template_file_path, "r", encoding="utf-8") as template_file:
    template_data = template_file.read()

replaced = "var data = {"
replaced += "\"title\": \"Compare Runs " + inp + "\","
replaced += "\"type\": \"cm\","
replaced += "\"raw\": ["
for root, dirs, files in os.walk(input_directory_path):
    for f in sorted([f for f in files if f.startswith(inp)]):
        input_file_path = os.path.join(input_directory_path, f)
        with io.open(input_file_path, "r", encoding="utf-8") as input_file:
            inp_data = input_file.read()
            replaced += inp_data
            replaced += ","
replaced += "]}"

input_file_path = os.path.join(output_directory_path, "cm" + inp + ".html")
with io.open(input_file_path, "w", encoding="utf-8") as output_file:
    output_file.write(template_data.replace("    <!-- DATA -->", replaced))
