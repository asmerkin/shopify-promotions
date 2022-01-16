import { Cart, CartLineItem, PromotionState, PromotionStateMutation, RegistrablePromotion, Variant } from "../types";

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

    constructor(promotion: RegistrablePromotion) {
        this.key = promotion.key; 
        this.lookup_variants = promotion.lookup_variants; 
        this.add_variants = promotion.add_variants; 
    }

    run(cart: Cart): PromotionState {
        const state: PromotionState = {
            creations: [], 
            mutations: [], 
            deletions: []
        }

        cart.items.filter( item => {
            return this.lookup_variants.includes(item.variant_id)
                && item.properties?._promotion_leader !== 'false'; 
        }).forEach( leader => {

            if ( leader.properties?._promotion_leader == null ) {
                this.hookPromotionLeader(leader, state); 
            }

            // followers are the items added by this promotion. 
            const followers = cart.items.filter( item => {
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
    hookPromotionLeader(item: CartLineItem, state: PromotionState) {
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
    createNewFollower(leader: CartLineItem, variant: Variant, state: PromotionState) {
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
    adjustFollowerQuantity(follower: CartLineItem, quantity: number, state: PromotionState) {
        state.mutations.push({
            key: follower.key, 
            quantity: quantity, 
            properties: follower.properties
        } as PromotionStateMutation); 
    }
}