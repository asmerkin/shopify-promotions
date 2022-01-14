import Cart from "../definitions/Cart";
import Plan from "../models/Plan";
import Promotion from "../models/Promotion";
import CartGenerator from "./helpers/CartGenerator";

describe('Promotion Plans', () => {
    test('Running one promotion attaches all mutations and creations', () => {
        const promotions: Promotion[] = [
            new Promotion({
                key: 'addnewitem', 
                lookup_variants: [123, 456], 
                add_variants: [{id: 789, quantity: 2}],
            })
        ]; 
    
        const cart: Cart = (new CartGenerator([
            {id: 123456, key: 'abc', variant_id: 123, quantity: 1, properties: {_something: 'true'}}
        ])).generate();
        
        const {mutations, creations, deletions}: Plan = (new Plan(cart)).create(promotions); 
    
        expect(mutations.length).toBe(1); 
        expect(mutations[0]).toEqual({
            key: 'abc', 
            quantity: 1, 
            properties: {
                _something: 'true', 
                _promotion: 'true', 
                _promotion_key: 'addnewitem', 
                _promotion_leader: 'true',
                _promotion_leader_key: 'abc'
            }
        })
        expect(creations.length).toBe(1); 
        expect(creations[0]).toEqual({
            id: 789, 
            quantity: 2, 
            properties: {
                _promotion: 'true', 
                _promotion_key: 'addnewitem', 
                _promotion_leader: 'false', 
                _promotion_leader_key: 'abc'
            }
        })    
        expect(deletions.length).toBe(0); 
    });

    test('Applying more promotions resolves all of them', () => {
        const promotions: Promotion[] = [
            new Promotion({
                key: 'addnewitem', 
                lookup_variants: [123, 456], 
                add_variants: [{id: 789, quantity: 2}],
            }), 
            new Promotion({
                key: 'anotherpromo', 
                lookup_variants: [444, 666],
                add_variants: [{id: 999, quantity: 1}] 
            })
        ]; 
    
        const cart: Cart = (new CartGenerator([
            {id: 123456, key: 'abc', variant_id: 123, quantity: 1, properties: {_something: 'true'}},
            {id: 333333, key: 'xyz', variant_id: 444, quantity: 3, properties: {_something: 'another thing'}}
        ])).generate();
        
        const {mutations, creations, deletions}: Plan = (new Plan(cart)).create(promotions);

        expect(mutations).toHaveLength(2); 
        expect(creations).toHaveLength(2); 
        expect(deletions).toHaveLength(0); 
    }); 


    test('Deletes all orphan followers', () => {
        const promotions = []; 
        const cart = (new CartGenerator([
            {
                id: 444444,
                key: 'def',
                variant_id: 789,
                quantity: 2,
                properties: {
                    _promotion: 'true', 
                    _promotion_leader: 'false', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader_key: 'abc'
                }
            }, 
        ])).generate(); 

        const {deletions} = (new Plan(cart)).create(promotions); 

        expect(deletions).toEqual(['def']); 
    }); 
}); 