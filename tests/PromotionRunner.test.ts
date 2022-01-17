import Plan from "../models/Plan";
import PromotionRunner from "../models/PromotionRunner";
import CartGenerator from "../helpers/CartGenerator";
import CartApi from '../helpers/CartApi'; 
import { mocked } from "ts-jest/dist/utils/testing";
jest.mock('../helpers/CartApi'); 

const mock = mocked(CartApi, true); 

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


    it('Can commit a plan to the API', () => {
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

        runner.commit(cart, plan); 

        expect(mock.change).toBeCalledTimes(2); 
        expect(mock.add).toBeCalledTimes(1); 
        expect(mock.update).toBeCalledTimes(1); 

        // Here we should create a plan object with some values, 
        // and then trigger the commit, checking the calls to a 
        // mock to make sure all api calls were made. 
    }); 
}); 