import { PokemonSizeValues, TypeGroupedPokemon, TypeGroupedPokemonSizeValues } from '../types/types';


export class StatPrintingService {
    static printStats(stats: PokemonSizeValues, useStandardUnits: boolean): void {
        const heightDisplay = useStandardUnits ? `${stats.height / 10}m` : `${stats.height}dm`;
        console.log(`HEIGHT: ${heightDisplay}`);
        const weightDisplay = useStandardUnits ? `${stats.weight / 10}kg` : `${stats.weight}hg`;
        console.log(`WEIGHT: ${weightDisplay}`);
    }

    static printGlobalAverages(averageStats: PokemonSizeValues, useStandardUnits = false): void {
        console.log('Averages for all found pokemon:');
        console.log('---------------------------');
        this.printStats(averageStats, useStandardUnits);
    }

    static printGroupedAverages(groupedAverageStats: TypeGroupedPokemonSizeValues, useStandardUnits = false): void {
        for (let pokemonType in groupedAverageStats) {
            // this apparently doesn't give us keyof type safety even though we are iterating keys of a type
            // https://github.com/microsoft/TypeScript/issues/12314
            const currentStats = groupedAverageStats[pokemonType as keyof TypeGroupedPokemon];
            console.log(`Average stats for type ${pokemonType}:`);
            this.printStats(currentStats!, useStandardUnits);
            console.log();
        }
    }
}
