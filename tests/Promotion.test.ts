import {Cart} from "../types";
import Promotion from "../models/Promotion";
import CartGenerator from "../helpers/CartGenerator";

describe('Promotion Tests', () => {

    test('A promotion can be run on a cart', () => {
        const promotion = new Promotion({
            key: 'addnewitem', 
            lookup_variants: [123, 456], 
            add_variants: [{id: 789, quantity: 2}],
        }); 

        const cart: Cart = (new CartGenerator([
            {id: 123456, key: 'abc', variant_id: 123, quantity: 1, properties: {_something: 'true'}, original_line_price: 8000}
        ])).generate();

        let {creations, mutations, deletions} = promotion.run(cart); 

        expect(creations).toHaveLength(1); 
        expect(mutations).toHaveLength(1); 
        expect(deletions).toHaveLength(0); 
        expect(creations[0]).toEqual({
            id: 789, 
            quantity: 2, 
            properties: {
                _promotion: 'true', 
                _promotion_key: 'addnewitem', 
                _promotion_leader: 'false', 
                _promotion_leader_key: 'abc'
            }
        });  
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
    }); 

    it('skips a promotion if it has already been applied', () => {
        const promotion = new Promotion({
            key: 'addnewitem', 
            lookup_variants: [123, 456], 
            add_variants: [{id: 789, quantity: 2}],
        }); 

        const cart: Cart = (new CartGenerator([
            {
                id: 123456,
                key: 'abc',
                variant_id: 123,
                quantity: 1,
                original_line_price: 8000,
                properties: {
                    _promotion: 'true', 
                    _promotion_leader: 'true', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader_key: 'abc'
                }
            }, 
            {   // this is the "already added item"
                id: 444444,
                key: 'def',
                variant_id: 789,
                quantity: 2,
                original_line_price: 8000,
                properties: {
                    _promotion: 'true', 
                    _promotion_leader: 'false', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader_key: 'abc'
                }
            }, 
        ])).generate();

        const {mutations, creations, deletions} = promotion.run(cart); 
        expect(mutations).toHaveLength(0); 
        expect(creations).toHaveLength(0);
        expect(deletions).toHaveLength(0); 
    });

    it('updates the promotion item quantity if the leader has been updated', () => {
        const promotion = new Promotion({
            key: 'addnewitem', 
            lookup_variants: [123, 456], 
            add_variants: [{id: 789, quantity: 2}],
        }); 

        const cart: Cart = (new CartGenerator([
            {
                id: 123456,
                key: 'abc',
                variant_id: 123,
                quantity: 3,
                original_line_price: 8000,
                properties: {
                    _promotion: 'true', 
                    _promotion_leader: 'true', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader_key: 'abc'
                }
            }, 
            {   // this is the "already added item"
                id: 444444,
                key: 'def',
                variant_id: 789,
                quantity: 2,
                original_line_price: 8000,
                properties: {
                    _promotion: 'true', 
                    _promotion_leader: 'false', 
                    _promotion_key: 'addnewitem', 
                    _promotion_leader_key: 'abc'
                }
            }, 
        ])).generate();

        const {mutations, creations, deletions} = promotion.run(cart); 
        expect(mutations[0]).toEqual({
            key: 'def', 
            quantity: 6, 
            properties: {
                _promotion: 'true', 
                _promotion_key: 'addnewitem', 
                _promotion_leader: 'false', 
                _promotion_leader_key: 'abc'
            }
        }); 
        expect(creations).toHaveLength(0);
        expect(deletions).toHaveLength(0); 
    });


    test('A promotion with a cart minimum is only applied if the cart subtotal is above', () => {
        const promotion = new Promotion({
            key: 'addnewitem', 
            min_purchase: 10000, 
            lookup_variants: [123, 456], 
            add_variants: [{id: 789, quantity: 2}],
        });

        const cart: Cart = (new CartGenerator([
            {id: 123456, key: 'abc', variant_id: 123, quantity: 1, original_line_price: 8000}
        ])).generate();

        let firstResult = promotion.run(cart); 
        expect(firstResult.creations).toHaveLength(0); 
        expect(firstResult.mutations).toHaveLength(0); 

        const secondCart: Cart = (new CartGenerator([
            {id: 123456, key: 'abc', variant_id: 123, quantity: 1, original_line_price: 12000}
        ])).generate();

        let secondResult = promotion.run(secondCart); 
        expect(secondResult.creations).toHaveLength(1); 
        expect(secondResult.mutations).toHaveLength(1); 
    }); 

}); 