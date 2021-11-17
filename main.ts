import { program } from 'commander';
import { PokeStatsService } from './src/services/pokeStatsService';
import { StatPrintingService } from './src/services/statPrintingService';

async function main() {
    program
        .requiredOption('-l, --limit <number>', 'The number of pokemon to fetch (maximum)')
        .requiredOption('-o, --offset <number>', 'The number of pokemon to skip before beginning fetch')
        .option('-u, --use-standard-units', 'Pass this flag to display units in meters and kilograms, rather than decimeters and hectagrams');

    program.parse(process.argv);
    const options = program.opts();
    
    const start = Date.now();
    const results = await PokeStatsService.getCombinedAverages(options.limit, options.offset);
    const finish = Date.now();
    const delta = finish - start;

    StatPrintingService.printGlobalAverages(results.globalAverages, options.useStandardUnits);
    console.log();
    StatPrintingService.printGroupedAverages(results.groupedAverages, options.useStandardUnits);

    console.log(`Results retrieved in ${delta} ms`);
}

main();