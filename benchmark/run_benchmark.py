#!/usr/bin/env python
# coding=utf-8

"""
Run the benchmark suite or selected tests.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import io
import numpy
import os
import sys
import toml

from aeneas.tools.abstract_cli_program import AbstractCLIProgram
from aeneas.tools.execute_task import ExecuteTaskCLI
import aeneas.globalfunctions as gf

__author__ = "Alberto Pettarin"
__copyright__ = """
    Copyright 2016, Alberto Pettarin (www.albertopettarin.it)
    """
__license__ = "GNU AGPL 3"
__version__ = "0.0.1"
__email__ = "aeneas@readbeyond.it"
__status__ = "Production"

class RunBenchmarkCLI(AbstractCLIProgram):
    """
    Run the benchmark suite or selected tests.
    """
    CONFIG_FILE_NAME = "config.toml"
    INPUT_DIRECTORY_PATH = "input"
    OUTPUT_DIRECTORY_PATH = "output"

    TESTS = [
        "001",
        "002",
        "003",
        "004",
        "005",
        "006",
        "007",
        "008",
        "009",
        "010",
        "011",
        "012",
        "013",
        "014",
        "015",
        "016",
        "017",
        "018",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
    ]

    NAME = gf.file_name_without_extension(__file__)

    HELP = {
        "description": u"Run the benchmark suite or selected tests",
        "synopsis": [
            (u"--all", True),
            (u"--tests=TEST1,TEST2,...", True),
        ],
        "examples": [
            u"--all",
            u"--tests=001,003,005",
            u"--tests=001-006,010-012",
        ],
        "options": [
            u"-a, --all : run all tests",
            u"-d, --debug : run in debug mode (1 warmup, 3 timed)",
            u"--label=LABEL : output results to file with this label", 
            u"--list : list all available tests",
            u"-t=TESTS, --tests=TESTS : run tests TESTS"
        ]
    }

    def print_list(self):
        """
        Print the list of all available tests and exit.
        """
        self.print_info(u"Available tests:")
        for test in self.TESTS:
            config_obj = self.get_config(test)
            self.print_generic(u"%s : (%d+%dx) %s, %s" % (
                test,
                config_obj["execution"]["warmup_runs"],
                config_obj["execution"]["timed_runs"],
                gf.time_to_hhmmssmmm(config_obj["audio_length"]),
                config_obj["description"]
            ))
        return self.HELP_EXIT_CODE

    def parse_tests(self):
        """
        Parse the -t or --tests value,
        returning the list of tests to be run.

        :rtype: list of strings
        """
        tests = set()
        tokens = self.has_option_with_value(u"--tests")
        if tokens is None:
            tokens = self.has_option_with_value(u"-t")
        tokens = tokens.split(",")
        for token in tokens:
            if u"-" in token:
                if len(token.split(u"-")) == 2:
                    start, stop = token.split(u"-")
                    try:
                        start = int(start)
                        stop = int(stop)
                    except:
                        return None
                    for i in range(start, stop + 1):
                        tests.add(u"%03d" % i)
                else:
                    return None
            else:
                tests.add(token)
        tests = tests & set(self.TESTS)
        if len(tests) == 0:
            return None
        return sorted(list(tests))

    def perform_command(self):
        """
        Perform command and return the appropriate exit code.

        :rtype: int
        """
        if len(self.actual_arguments) < 1:
            return self.print_help()

        if self.has_option([u"--list"]):
            return self.print_list()

        single = self.has_option([u"-s", u"--single"])
        if single:
            self.print_warning(u"Running in single mode")

        debug = self.has_option([u"-d", u"--debug"])
        if debug:
            self.print_warning(u"Running in debug mode")

        machine_label = self.has_option_with_value(u"--label")
        if machine_label is None:
            machine_label = u""

        if self.has_option([u"-a", u"--all"]):
            tests = self.TESTS
        elif (self.has_option_with_value(u"--tests") is not None) or (self.has_option_with_value(u"-t") is not None):
            tests = self.parse_tests()
            if tests is None:
                self.print_error(u"Invalid test id(s)")
                return self.ERROR_EXIT_CODE
        else:
            self.print_error(u"You must specify --all or --tests")
            return self.ERROR_EXIT_CODE

        self.log([u"Tests: %s", tests])

        for test in tests:
            # get test config
            self.print_info(u"Test %s ..." % test)
            self.log([u"Test %s", test])
            config_obj = self.get_config(test)
            self.log([u"  Description:  %s", config_obj["description"]])
            self.print_info(u"  Description: %s" % config_obj["description"])
            audio_length = config_obj["audio_length"]
            audio_file_path = os.path.join(self.INPUT_DIRECTORY_PATH, config_obj["arguments"]["audio"])
            text_file_path = os.path.join(self.INPUT_DIRECTORY_PATH, config_obj["arguments"]["text"])
            config_string = config_obj["arguments"]["config"]
            rconf_string = config_obj["arguments"]["rconf"]
            warmup_runs = config_obj["execution"]["warmup_runs"]
            timed_runs = config_obj["execution"]["timed_runs"]
            if single:
                warmup_runs = 0
                timed_runs = 1
            elif debug:
                warmup_runs = min(1, warmup_runs)
                timed_runs = min(3, timed_runs)
            self.log([u"  Warmup runs:  %d", warmup_runs])
            self.log([u"  Timed runs:   %d", timed_runs])
            self.log([u"  Audio length: %d", audio_length])

            # perform warmup runs
            for i in range(warmup_runs):
                self.print_info(u"  Warmup run %d/%d ..." % (i + 1, warmup_runs))
                self.log([u"    Warmup tun %d/%d ...", i + 1, warmup_runs])
                self.perform_run(audio_file_path, text_file_path, config_string, rconf_string)

            # perform timed runs
            labels = []
            runs = []
            for i in range(timed_runs):
                self.print_info(u"  Timed run %d/%d ..." % (i + 1, timed_runs))
                self.log([u"    Timed run %d/%d ...", i + 1, timed_runs])
                logger = self.perform_run(audio_file_path, text_file_path, config_string, rconf_string)
                runs.append(self.get_run_values(logger))
                if i == 0:
                    labels = self.get_labels(logger)
           
            # save results
            self.save_results(test, labels, runs, machine_label)
            self.print_info(u"Test %s ... completed" % test)
        self.print_success(u"Benchmark completed")
        return self.NO_ERROR_EXIT_CODE

    def save_results(self, test, labels, runs, machine_label):
        runs_matrix = numpy.array(runs, dtype=float)
        total_times = runs_matrix[:, -1]
        self.log(u"  Total time")
        self.log([u"    Min: %.3f", numpy.min(total_times)])
        self.log([u"    Max: %.3f" % numpy.max(total_times)])
        self.log([u"    Avg: %.3f" % numpy.mean(total_times)])
        self.log([u"    Std: %.3f" % numpy.std(total_times)])
        # use machine label, if any
        output_file_name = test
        if len(machine_label) > 0:
            output_file_name += ".%s" % (machine_label)
        # save times, txt format
        output_file_path = os.path.join(self.OUTPUT_DIRECTORY_PATH, "%s.dat" % (output_file_name))
        self.log([u"  Saving %s", output_file_path])
        numpy.savetxt(output_file_path, runs_matrix, fmt="%.3f")
        # save times, numpy format
        output_file_path = os.path.join(self.OUTPUT_DIRECTORY_PATH, "%s.npy" % (output_file_name))
        self.log([u"  Saving %s", output_file_path])
        numpy.save(output_file_path, runs_matrix)
        # save labels
        output_file_path = os.path.join(self.OUTPUT_DIRECTORY_PATH, "%s.lab" % (output_file_name))
        self.log([u"  Saving %s", output_file_path])
        with io.open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.write("\n".join(labels))
        # save global stats (min, max, mean, std)
        stats = numpy.zeros((4, runs_matrix.shape[1]))
        stats[0] = numpy.min(runs_matrix, axis=0)
        stats[1] = numpy.max(runs_matrix, axis=0)
        stats[2] = numpy.mean(runs_matrix, axis=0)
        stats[3] = numpy.std(runs_matrix, axis=0)
        output_file_path = os.path.join(self.OUTPUT_DIRECTORY_PATH, "%s.res" % (output_file_name))
        numpy.savetxt(output_file_path, stats, fmt="%.3f")

    def get_config(self, test):
        config_obj = {}
        config_file_path = os.path.join(test, self.CONFIG_FILE_NAME)
        with open(config_file_path) as config_file:
            config_obj = toml.loads(config_file.read())
        return config_obj

    def perform_run(self, audio_file_path, text_file_path, config_string, rconf_string):
        output_file_handler, output_file_path = gf.tmp_file()
        executor = ExecuteTaskCLI(use_sys=False)
        executor.run(arguments=[
            "dummy placeholder for aeneas.tools.execute_task",
            audio_file_path,
            text_file_path,
            config_string,
            output_file_path,
            "-r=\"%s\"" % rconf_string
        ])
        gf.delete_file(output_file_handler, output_file_path)
        return executor.logger

    def get_run_values(self, logger):
        run = []
        for msg in [e.message for e in logger.entries if "DURATION" in e.message]:
            l = msg.split(" ")
            index = l.index("DURATION")
            duration = float(l[index+1])
            run.append(duration)
        return run

    def get_labels(self, logger):
        labels = []
        for msg in [e.message for e in logger.entries if "DURATION" in e.message]:
            l = msg.split(" ")
            index = l.index("DURATION")
            label = " ".join(l[index+2:])
            label = "(total)" if len(label) < 1 else label
            label = label.replace("(", "").replace(")", "")
            labels.append(label)
        return labels 




def main():
    """
    Execute program.
    """
    RunBenchmarkCLI().run(arguments=sys.argv)

if __name__ == '__main__':
    main()



