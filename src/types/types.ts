import { IPokemon } from 'pokeapi-typescript';

export type PokemonSizeValues = {
    height: number; // height is in decimeters (1/10 of m)
    weight: number; // weight is in hectograms (1/10 of kg)
};

export type TypeGroupedPokemon = {
    [pokemonType in PokemonTypes]?: IPokemon[];
};

export type TypeGroupedPokemonSizeValues = {
    [pokemonType in PokemonTypes]?: PokemonSizeValues;
};

export type CombinedAverages = {
    globalAverages: PokemonSizeValues;
    groupedAverages: TypeGroupedPokemonSizeValues;
};

// retrieved from the PokeAPI https://pokeapi.co/api/v2/type
export type PokemonTypes =
    'normal' |
    'fighting' |
    'flying' |
    'poison' |
    'ground' |
    'rock' |
    'bug' |
    'ghost' |
    'steel' |
    'fire' |
    'water' |
    'grass' |
    'electric' |
    'psychic' |
    'ice' |
    'dragon' |
    'dark' |
    'fairy' |
    'unknown' |
    'shadow';
