# Documentation

Sphinx est utilisé pour la génération de la documentation depuis des pages écrites en Markdown (via le [parser MyST](https://myst-parser.readthedocs.io/en/latest/)).

## Génération du site web de documentation

Pour la génération:

```bash
# install aditionnal dependencies
python -m pip install -U -r requirements/documentation.txt
# build it
sphinx-build -b html documentation documentation/_build
# optimized (quiet, multiprocessing, doctrees separated)
sphinx-build -b html -d documentation/_build/cache -j auto -q documentation documentation/_build/html
```

Ouvrir `docs/_build/index.html` dans un navigateur web.

## Ecrire la documentation avec un rendu en direct

```bash
sphinx-autobuild -b html -d documentation/_build/cache documentation/ documentation/_build
```

Ouvrir <http://localhost:8000> dans un navigateur web pour voir le rendu HTML mis à jour quand un fichier est sauvegardé.
