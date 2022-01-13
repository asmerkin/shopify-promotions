import Cart, { CartLineItem } from "../definitions/Cart";

type PromotionStateCreation = {
    id: number,
    quantity: number,
    properties: {
        _promotion: 'true' | 'false', 
        _promotion_key: string,
        _promotion_leader: 'true' | 'false',
        _promotion_leader_key: string
    }
};

type PromotionStateMutation = {
    key: string,
    quantity: number,
    properties: {
        _promotion: 'true' | 'false', 
        _promotion_key: string,
        _promotion_leader: 'true' | 'false',
        _promotion_leader_key: string
    }
}

interface PromotionState {
    creations: PromotionStateCreation[], 
    mutations: PromotionStateMutation[], 
    deletions: string[]
}

export default class Promotion {

    key: string; 
    lookup_variants: number[]; 
    add_variants: Array<{
        id: number, 
        quantity: number, 
        properties?: Array<{
            [index: string]: string
        }>
    }>

    constructor({key, lookup_variants, add_variants}) {
        this.key = key; 
        this.lookup_variants = lookup_variants; 
        this.add_variants = add_variants; 
    }

    run(cart: Cart): PromotionState {
        const state = {
            creations: [], 
            mutations: [], 
            deletions: []
        }

        cart.line_items.filter( item => {
            return this.lookup_variants.includes(item.variant_id)
                && item.properties?._promotion_leader !== 'false'; 
        }).forEach( leader => {

            if ( leader.properties?._promotion_leader == null ) {
                this.hookPromotionLeader(leader, state); 
            }

            // followers are the items added by this promotion. 
            const followers = cart.line_items.filter( item => {
                return item.properties?._promotion_leader === 'false'
                    && item.properties?._promotion_key === this.key
                    && item.properties?._promotion_leader_key === leader.key
            }); 

            this.add_variants.forEach( variant => {
                let isCreated = followers.map( item => item.variant_id )
                    .includes( variant.id ); 
                
                if ( isCreated ) {
                    const follower = followers.find(item => item.variant_id === variant.id ); 
                    const expected_quantity = variant.quantity * leader.quantity; 
                    if (follower.quantity != expected_quantity) {
                        this.adjustFollowerQuantity(follower, expected_quantity, state); 
                    }
                } else {
                    this.createNewFollower(leader, variant, state);  
                }
            });
        }); 


        return state; 
    }

    /**
     * Sets the parameters to the leader object. 
     * 
     * @param item the cart line item to use, 
     * @param state the return state
     */
    hookPromotionLeader(item, state) {
        state.mutations.push({
            key: item.key,
            quantity: item.quantity, 
            properties: {
                ...item.properties,
                ...{
                    _promotion: 'true',
                    _promotion_key: this.key,
                    _promotion_leader: 'true',
                    _promotion_leader_key: item.key, 
                },
            },
        });   
    }

    /**
     * Creates a new follower for the specified variant. 
     * @param leader 
     * @param variant 
     * @param state 
     */
    createNewFollower(leader: CartLineItem, variant, state) {
        state.creations.push({
            id: variant.id,
            quantity: variant.quantity * leader.quantity,
            properties: {
                _promotion: 'true',
                _promotion_key: this.key,
                _promotion_leader: 'false', // Generated items are slaves.
                _promotion_leader_key: leader.key
            },
        });
    }

    /**
     * Adjusts the follower to match the leader quantity using the defined
     * promotion quantity. 
     * 
     * @param follower 
     * @param quantity 
     * @param state 
     */
    adjustFollowerQuantity(follower: CartLineItem, quantity: number, state) {
        state.mutations.push({
            key: follower.key, 
            quantity: quantity, 
            properties: follower.properties
        }); 
    }
}