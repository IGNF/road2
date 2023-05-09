# Documentation

Sphinx is used to generate documentation from pages written in Markdown (via the [MyST parser](https://myst-parser.readthedocs.io/en/latest/)).

## Generation of the documentation website

For the generation:

```bash
# install additional dependencies
python -m pip install -U -r requirements/documentation.txt
# build it
sphinx-build -b html documentation documentation/_build
# optimized (quiet, multiprocessing, doctrees separated)
sphinx-build -b html -d documentation/_build/cache -j auto -q documentation documentation/_build/html
```

Open `documentation/_build/index.html` in a web browser.

## Write documentation with live rendering

```bash
sphinx-autobuild -b html -d documentation/_build/cache documentation/ documentation/_build
```

Open <http://localhost:8000> in a web browser to see updated rendered HTML when a file is saved.