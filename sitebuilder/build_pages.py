#!/usr/bin/env python
# coding=utf-8

"""
Run the benchmark suite or selected tests.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import io
import json
import os
import sys

__author__ = "Alberto Pettarin"
__copyright__ = """
    Copyright 2016, Alberto Pettarin (www.albertopettarin.it)
    """
__license__ = "GNU AGPL 3"
__version__ = "0.0.1"
__email__ = "aeneas@readbeyond.it"
__status__ = "Production"


template_file_path = "templates/base.html"

input_directory_path = "input"
output_directory_path = "output"

inp = sys.argv[1]

with io.open(os.path.join(input_directory_path, inp + ".json"), "r", encoding="utf-8") as input_file:
    inp_data = input_file.read()

with io.open(template_file_path, "r", encoding="utf-8") as template_file:
    template_data = template_file.read()


replaced  = "var data = {"
replaced += "\"title\": \"Run " + inp + "\","
replaced += "\"type\": \"single\","
replaced += "\"raw\":"
replaced += inp_data
replaced += "}"

with io.open(os.path.join(output_directory_path, inp + ".html"), "w", encoding="utf-8") as output_file:
    output_file.write(template_data.replace("    <!-- DATA -->", replaced))



