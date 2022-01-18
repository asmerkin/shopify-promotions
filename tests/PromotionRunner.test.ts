import Plan from "../models/Plan";
import PromotionRunner from "../models/PromotionRunner";
import CartGenerator from "../helpers/CartGenerator";
import CartApi from '../helpers/CartApi'; 
import { Cart } from "../types";

beforeAll( () => {
    jest.spyOn(CartApi, 'getCart').mockImplementation( async () => { return {} as Cart }); 
    jest.spyOn(CartApi, 'add').mockImplementation( async (payload) => { return {} as Cart }); 
    jest.spyOn(CartApi, 'change').mockImplementation( async (payload) => { return {} as Cart }); 
    jest.spyOn(CartApi, 'update').mockImplementation( async (payload) => { return {} as Cart }); 
}); 

afterEach( () => {
    jest.clearAllMocks(); 
})

describe('Promotion runner Tests', () => {
    test('it can register single new promotions', () => {
        const runner = new PromotionRunner(); 

        runner.register({
            key: 'somekey', 
            lookup_variants: [123, 456], 
            add_variants: [{
                id: 1234, 
                quantity: 1
            }]
        }); 

        expect(runner.getPromotions().length).toBe(1); 
    }); 

    it('can register an array of new promotions', () => {
        const runner = new PromotionRunner(); 

        runner.register([
            {
                key: 'somekey', 
                lookup_variants: [123, 456], 
                add_variants: [{
                    id: 1234, 
                    quantity: 1
                }]
            }, 
            {
                key: 'somekey', 
                lookup_variants: [123, 456], 
                add_variants: [{
                    id: 1234, 
                    quantity: 1
                }]
            }
        ]); 

        expect(runner.getPromotions().length).toBe(2); 
    });


    it('Can commit a plan to the API', async () => {
        const cart = (new CartGenerator([])).generate(); 
        const runner = new PromotionRunner(); 
        const plan = (new Plan(cart))
            .setMutations([{
                key: 'def', 
                quantity: 6, 
                properties: {
                    _promotion: 'true', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader: 'false', 
                    _promotion_leader_key: 'abc'
                }
            },
            {
                key: '334', 
                quantity: 1, 
                properties: {
                    _promotion: 'true', 
                    _promotion_key: 'anotherpromotion', 
                    _promotion_leader: 'false', 
                    _promotion_leader_key: 'abc'
                }
            }
            ])
            .setCreations([
                {
                    id: 789, 
                    quantity: 2, 
                    properties: {
                        _promotion: 'true', 
                        _promotion_key: 'addnewitem', 
                        _promotion_leader: 'false', 
                        _promotion_leader_key: 'abc'
                    }
                }, 
                {
                    id: 123, 
                    quantity: 1, 
                    properties: {
                        _promotion: 'true', 
                        _promotion_key: 'anotherpromotion', 
                        _promotion_leader: 'false', 
                        _promotion_leader_key: 'abc'
                    }
                },                 
            ])
            .setDeletions(['abcd', '113']);

        const response = await runner.commit(cart, plan); 

        expect(response).toBeTruthy(); 
        expect(CartApi.change).toBeCalledTimes(2); 
        expect(CartApi.add).toBeCalledTimes(1); 
        expect(CartApi.update).toBeCalledTimes(1);
    });

    it('Commiting an empty plan returns the initial cart', async () => {
        const cart = (new CartGenerator([])).generate(); 
        const runner = new PromotionRunner(); 
        const plan = (new Plan(cart)); 

        const response = await runner.commit(cart, plan); 

        expect(response).toBeTruthy(); 
        expect(CartApi.change).toBeCalledTimes(0); 
        expect(CartApi.add).toBeCalledTimes(0); 
        expect(CartApi.update).toBeCalledTimes(0);
    }); 
}); 