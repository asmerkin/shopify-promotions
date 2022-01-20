import { adjustFollowerQuantity, createNewFollower, hookPromotionLeader } from "../helpers/Promotions";
import PromotionState from "../models/PromotionState";
import { Cart } from "../types";
import PromotionStrategy from "./PromotionStrategy";

/**
 * This promotion is created when there are items to lookup, and the promotion 
 * depends on certain items to add others. 
 */
export default class PromotionStrategyWithLookup extends PromotionStrategy {


    run(cart: Cart): PromotionState {
        const state: PromotionState = new PromotionState(); 

        cart.items.filter( item => {
            return this.promotion.lookup_variants.includes(item.variant_id)
                && item.properties?._promotion_leader !== 'false'; 
        }).forEach( leader => {

            if ( leader.properties?._promotion_leader == null ) {
                hookPromotionLeader(this.promotion, leader, state); 
            }

            // followers are the items added by this promotion. 
            const followers = cart.items.filter( item => {
                return item.properties?._promotion_leader === 'false'
                    && item.properties?._promotion_key === this.promotion.key
                    && item.properties?._promotion_leader_key === leader.key
            }); 

            this.promotion.add_variants.forEach( variant => {
                let isCreated = followers.map( item => item.variant_id )
                    .includes( variant.id ); 
                
                if ( isCreated ) {
                    const follower = followers.find(item => item.variant_id === variant.id ); 
                    const expected_quantity = variant.quantity * leader.quantity; 
                    if (follower.quantity != expected_quantity) {
                        adjustFollowerQuantity(follower, expected_quantity, state); 
                    }
                } else {
                    createNewFollower(this.promotion, leader, variant, state);  
                }
            });
        }); 


        return state; 
    }
}