import { StatPrintingService } from '../../src/services/statPrintingService';
describe('StatPrintingService', () => {
    describe('printStats', () => {
        it('should print using dm and hg if useStandardUnits is false', async () => {
            console.log = jest.fn();
            StatPrintingService.printStats({ height: 50, weight: 50 }, false);
            expect(console.log).toHaveBeenCalledWith('HEIGHT: 50dm');
            expect(console.log).toHaveBeenCalledWith('WEIGHT: 50hg');
        });

        it('should print using m and kg if useStandardUnits is true', async () => {
            console.log = jest.fn();
            StatPrintingService.printStats({ height: 50, weight: 50 }, true);
            expect(console.log).toHaveBeenCalledWith('HEIGHT: 5m');
            expect(console.log).toHaveBeenCalledWith('WEIGHT: 5kg');
        });
    });
});
