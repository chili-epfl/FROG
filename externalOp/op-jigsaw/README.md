# Installation

Install [pipenv](https://github.com/pypa/pipenv), and Python 3

Run `pipenv install`.

You also need to download the spacy word embedding model, by running 
`python -m spacy download en_core_web_lg` (this is quite large, and could take a while).

# Running

Start by doing `pipenv shell`, and then `python index.py`. It will take a few
seconds to start up, because it needs to parse a huge word embedding file.
Once it prints "Waiting for incoming operator calls", it has announced itself
to FROG, and is ready to process data.
