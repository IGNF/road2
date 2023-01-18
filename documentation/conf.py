#!python3

"""
    Configuration for project documentation using Sphinx.
"""

# standard
import sys
from datetime import datetime
from os import environ, path

sys.path.insert(0, path.abspath(".."))  # move into project package

# -- Build environment -----------------------------------------------------
on_rtd = environ.get("READTHEDOCS", None) == "True"

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    # Sphinx included
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.extlinks",
    "sphinx.ext.githubpages",
    "sphinx.ext.imgmath",
    "sphinx.ext.intersphinx",
    "sphinx.ext.viewcode",
    # 3rd party
    "myst_parser",
    "sphinx_copybutton",
    "sphinx.ext.napoleon",
]

# The suffix(es) of source filenames.
# You can specify multiple suffix as a list of string:
source_suffix = {".md": "markdown", ".rst": "restructuredtext"}
autosectionlabel_prefix_document = True
# The master toctree document.
master_doc = "index"


# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path .
exclude_patterns = [
    "_build",
    ".venv",
    "Thumbs.db",
    ".DS_Store",
    "_output",
    "demo",
]

# The name of the Pygments (syntax highlighting) style to use.
pygments_style = "sphinx"


# -- Options for HTML output -------------------------------------------------

# -- Theme

#html_favicon = str(__about__.__icon_path__)
#html_logo = str(__about__.__icon_path__)
html_theme = "furo"
html_title = "Road2 documentation"

# -- EXTENSIONS --------------------------------------------------------
# MyST Parser
myst_enable_extensions = [
    "amsmath",
    "colon_fence",
    "deflist",
    "dollarmath",
    "html_image",
    "linkify",
    "replacements",
    "smartquotes",
    "substitution",
]

myst_substitutions = {
    #"author": author,
    "date_update": datetime.now().strftime("%d %B %Y"),
    #"description": description,
    #"repo_url": __about__.__uri__,
    #"title": project,
    #"version": version,
    #"license": license,
}

myst_url_schemes = ["http", "https", "mailto"]
