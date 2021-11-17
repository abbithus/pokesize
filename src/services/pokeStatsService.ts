import PokeAPI, { IPokemon } from "pokeapi-typescript";
import {
    CombinedAverages,
    PokemonSizeValues,
    PokemonTypes,
    TypeGroupedPokemon,
    TypeGroupedPokemonSizeValues
} from "../types/types";

export const BATCH_SIZE = 500;

export class PokeStatsService {
    /**
     * Retrieves the list of pokemen. Runs multiple requests in parallel to
     * retrieve full info for every pokemon.
     * @param {number} limit - The number of pokemen to fetch
     * @param {number} offset - The number of pokemen to skip (use 0 to start from the beginning)
     * @returns {Promise<IPokemon[]>}
     */
    static async getPokemonList(limit: number, offset: number): Promise<IPokemon[]> {
        const response = await PokeAPI.Pokemon.list(limit, offset);
        const pokemonNames = response.results.map((result) => result.name);
        // do in batches so as to not overwhelm the API with too many requests 
        // seems to break around 1000 for me, adjust BATCH_SIZE as needed
        let currentFetchCount = 0;
        const pokemonList = [];
        while (currentFetchCount < pokemonNames.length) {
            const currentNameBatch = pokemonNames.slice(currentFetchCount, currentFetchCount + BATCH_SIZE);
            const currentResults = await this.getBatchedPokemonDetails(currentNameBatch);
            pokemonList.push(...currentResults);
            currentFetchCount += BATCH_SIZE;
        }
        return pokemonList;
    }

    /**
     * Retrieves the full info for a given list of pokemen names.
     * @param {string[]} pokemonNames - The names of pokemen to fetch
     * @returns {Promise<IPokemon[]>}
     */
    static async getBatchedPokemonDetails(pokemonNames: string[]): Promise<IPokemon[]> {
        const results = await Promise.all(pokemonNames.map(async name => {
            const innerResults = await PokeAPI.Pokemon.resolve(name);
            return innerResults;
        }));
        return results;
    }

    /**
     * Averages the height and weight values for any list of pokemen and returns them as a tuple.
     * @param {IPokemon[]} pokemons - The pokemen for which you want to get a height/weight average
     * @returns {PokemonSizeValues}
     */
    static getAverageHeightAndWeightForList(pokemons: IPokemon[]): PokemonSizeValues {
        const pokemonSizeValues = pokemons.map((pokemon) => ({ height: pokemon.height, weight: pokemon.weight }));
        const summedValues = pokemonSizeValues.reduce((accumulator, next) => {
            return { height: accumulator.height + next.height, weight: accumulator.weight + next.weight };
        });
        const pokemonCount = pokemonSizeValues.length;
        return { height: summedValues.height / pokemonCount, weight: summedValues.weight / pokemonCount };
    }

    /**
     * Returns the total average height and weight for all pokemen passed in.
     * @param {IPokemon[]} pokemons - The pokemen for which you want to get a height/weight average
     * @returns {PokemonSizeValues}
     */
    static getGlobalAverage(pokemons: IPokemon[]): PokemonSizeValues {
        return this.getAverageHeightAndWeightForList(pokemons);
    }

    /**
     * Given a list of pokemen, group them by their types. Pokemen which have multiple types will appear multiple times.
     * @param {IPokemon[]} pokemons - The pokemen that you want to group by type
     * @returns {TypeGroupedPokemon} - The pokemen, grouped by their type in a key-value store
     */
    static groupPokemonByType(pokemons: IPokemon[]): TypeGroupedPokemon {
        const groupedPokemon: TypeGroupedPokemon = {};
        pokemons.forEach(pokemon => {
            pokemon.types.forEach(type => {
                const typeName = type.type.name as PokemonTypes;
                if (groupedPokemon[typeName]?.length) {
                    groupedPokemon[typeName]!.push(pokemon);
                } else {
                    groupedPokemon[typeName] = [pokemon];
                }
            })
        });
        return groupedPokemon;
    }

    /**
     * Given a list of pokemen, return the average weight/height of them, grouped by type.
     * @param {IPokemon[]} pokemons - The pokemen that you want to find the grouped height/weight values of
     * @returns {TypeGroupedPokemonSizeValues} - The pokemen' height/weight values, grouped by their type in a key-value store
     */
    static getGroupedAverage(pokemons: IPokemon[]): TypeGroupedPokemonSizeValues {
        const groupedPokemon = this.groupPokemonByType(pokemons);
        const groupedPokemonSizeValues: TypeGroupedPokemonSizeValues = {};
        for (let pokemonType in groupedPokemon) {
            // this apparently doesn't give us keyof type safety even though we are iterating keys of a type
            // https://github.com/microsoft/TypeScript/issues/12314
            const currentGroup = groupedPokemon[pokemonType as keyof TypeGroupedPokemon];
            groupedPokemonSizeValues[pokemonType as keyof TypeGroupedPokemon] = this.getAverageHeightAndWeightForList(currentGroup!);
        }
        return groupedPokemonSizeValues;
    }

    /**
     * Given a limit and offset, retrieves all pokemen for the given limit/offset, and returns their average height/weight values.
     * Also returns their height/weight values grouped by type, in a tuple. Will return 0/0 if no pokemon are found.
     * @param {number} limit - The number of pokemen to fetch
     * @param {number} offset - The number of pokemen to skip (use 0 to start from the beginning)
     * @returns {TypeGroupedPokemonSizeValues} - The pokemen's height/weight values, grouped by their type in a key-value store
     */
    static async getCombinedAverages(limit: number, offset: number): Promise<CombinedAverages> {
        const pokemonList = await this.getPokemonList(limit, offset);
        if (!pokemonList.length) {
            return {
                globalAverages: { height: 0, weight: 0 },
                groupedAverages: { }
            }
        }
        const globalAverages = this.getGlobalAverage(pokemonList);
        const groupedAverages = this.getGroupedAverage(pokemonList);
        return {
            globalAverages,
            groupedAverages
        };
    }
}
