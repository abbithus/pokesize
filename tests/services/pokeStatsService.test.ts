import { PokeStatsService } from '../../src/services/pokeStatsService';
jest.mock('../../node_modules/pokeapi-typescript', () => ({
    __esModule: true,
    default: {
        Pokemon: {
            list: jest.fn(),
            resolve: jest.fn(),
        }
    }
}));
import PokeAPI, { INamedApiResourceList, IPokemon } from '../../node_modules/pokeapi-typescript';

const generateMockPokemonList = (length: number): INamedApiResourceList<IPokemon> => {
    const fakeMonList = [];
    for (let i = 0; i < length; i++) {
        fakeMonList.push({ name: 'evil bulbasaur (there are many of him)', url: '/a/fake/url' });
    }
    const fakeMonResults = { count: length, next: '', previous: '', results: fakeMonList };
    return fakeMonResults;
}

describe('PokeStatsService', () => {
    describe('getPokemonList', () => {
        it('should make as many calls to resolve() as the number of pokemon returned', async () => {
            const totalPokemon = 3;
            jest.spyOn(PokeAPI.Pokemon, 'list').mockResolvedValueOnce(generateMockPokemonList(totalPokemon));
            const spy = jest.spyOn(PokeAPI.Pokemon, 'resolve').mockResolvedValue({ name: 'pokemon' } as IPokemon);
            await PokeStatsService.getPokemonList(totalPokemon, 0);
            expect(spy).toHaveBeenCalledTimes(totalPokemon);

        })
    });
});
