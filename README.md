# aeneas-benchmark

The official benchmark suite for **aeneas**

* Version: 0.0.2 (aeneas 1.6.0.1)
* Date: 2016-10-05
* Developed by: [ReadBeyond](http://www.readbeyond.it/)
* Lead Developer: [Alberto Pettarin](http://www.albertopettarin.it/)
* License: the GNU Affero General Public License Version 3 (AGPL v3)
* Contact: [aeneas@readbeyond.it](mailto:aeneas@readbeyond.it)
* Quick Links: [Results](https://readbeyond.github.io/aeneas-benchmark/) - [Code](https://github.com/readbeyond/aeneas-benchmark/) - [aeneas](http://www.readbeyond.it/aeneas/)


## Goal

To benchmark
[aeneas](http://www.readbeyond.it/aeneas/)
on different machines and under different I/O and parameter configurations.


## Usage

### Running the benchmark

1. Clone the repository from GitHub and switch to the ``master`` branch:

   ```bash
    $ git clone https://github.com/ReadBeyond/aeneas-benchmark
    $ cd aeneas-benchmark
    $ git checkout master
    ```

2. Enter the ``benchmark`` directory:
   
   ```bash
   $ cd benchmark
   ```

3. Rename the ``ENVINFO.editme`` file to ``ENVINFO``, and edit it with your system info.

4. Run the benchmark suite (IMPORTANT: it requires several minutes to complete!):

   ```bash
   $ python run_benchmark.py --all
   ```

If you want to contribute your benchmark,
please contact us via email
(the email address is written at the beginning of the page).

### Creating the static site

TBW


## License

**aeneas-benchmark** is released under the terms of the
GNU Affero General Public License Version 3.
See the
[LICENSE file](https://github.com/readbeyond/aeneas-benchmark/blob/master/LICENSE) for details.

Licenses for third party code and files included in **aeneas-benchmark**
can be found in the
[licenses](https://github.com/readbeyond/aeneas-benchmark/blob/master/licenses/README.md) directory.

No copy rights were harmed in the making of this project.



