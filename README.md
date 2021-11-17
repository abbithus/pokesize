# PokeSize

## About

PokeSize is a simple command line app built on top of the [PokeAPI](https://pokeapi.co), made to calculate and print the average heights and weights for a given selection of pokemon, supplied via offset and limit parameters. It uses [pokeapi-typescript](https://www.npmjs.com/package/pokeapi-typescript) to read from the API, though this was primarily done to avoid needing to re-create types for the PokeAPI API.

## Getting Started

The app has one main entrypoint, using [Commander](https://www.npmjs.com/package/commander) to process command line arguments supplied to the main file. Run `npm ci` to install all necessary packages, then use the node script `start` to run it, along with a `--` to pass in additional parameters, like so:

```bash
npm run start -- -o 0 -l 100 
```

## Options/Parameters

Limit (`-l` or `--limit`) and offset (`-o` or `--offset`) are both required parameters (adding defaults was considered, but rejected). "Limit" refers to the maximum number of records to be calculated from, and "offset" gives the number of pokemon to skip before taking up to the limit. Note that if no pokemon are found (such as from a very high offset, or a limit <=0), the app will report back 0 for height and weight.

While PokeAPI reports weight and height in hectagrams and decimeters respectively, PokeSize also provides the option to convert into the more familiar kg and m using the `-u` or `--use-standard-units` flag. There is a `--help` flag for parameters if needed:

```bash
npm run start -- --help
```
