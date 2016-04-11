# Configuration JSON File Naming Convention

Configuration JSON files must follow the naming convention:

```
    dur.fmt.res[rconf_spec].json
```

where:

* ``dur`` is the input audio file duration, in minutes, three digits (e.g., ``001`` for 1 minute, etc.)
* ``fmt`` is the input text file format, first three letters (e.g., ``mpl`` for ``mplain``, ``pla`` for ``plain``, etc.)
* ``res`` is the input text file format resolution: ``p`` for paragraph, ``s`` for sentence, ``w`` for word, ``m`` for multilevel
* ``rconf_spec`` is an optional specifier for runtime configuration options, starting with ``rconf_``

Example:

```
   001.pla.s.json                => 1m,  plain,     sentence
   010.mpl.m.json                => 10m, mplain,    multilevel
   060.sub.s.json                => 60m, subtitles, sentence
   005.pla.s.rconf_mfcc0010.json => 5m,  plain,     sentence,  MFCC resolution 10ms
   020.unp.w.rconf_noc.json      => 20m, unparsed,  word,      no C extensions
```


