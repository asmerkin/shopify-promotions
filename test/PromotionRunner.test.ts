import Promotion from "../models/Promotion";
import PromotionRunner from "../models/PromotionRunner";

describe('Promotion runner Tests', () => {
    test('it can register single new promotions', () => {
        const runner = new PromotionRunner(); 

        runner.register(new Promotion({
            key: 'somekey', 
            lookup_variants: [123, 456], 
            add_variants: [{
                id: 1234, 
                quantity: 1
            }]
        })); 

        expect(runner.getPromotions().length).toBe(1); 
    }); 

    it('can register an array of new promotions', () => {
        const runner = new PromotionRunner(); 

        runner.register([new Promotion(
            {
                key: 'somekey', 
                lookup_variants: [123, 456], 
                add_variants: [{
                    id: 1234, 
                    quantity: 1
                }]
            }), 
            new Promotion({
                key: 'somekey', 
                lookup_variants: [123, 456], 
                add_variants: [{
                    id: 1234, 
                    quantity: 1
                }]
            })
        ]); 

        expect(runner.getPromotions().length).toBe(2); 
    }); 
}); 