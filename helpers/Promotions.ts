import Promotion from "../models/Promotion";
import PromotionState from "../models/PromotionState";
import { CartLineItem, PromotionStateMutation, Variant } from "../types";

export function hookPromotionLeader(promotion: Promotion, item: CartLineItem, state: PromotionState) {
    state.addMutation({
        key: item.key,
        quantity: item.quantity, 
        properties: {
            ...item.properties,
            ...{
                _promotion: 'true',
                _promotion_key: promotion.key,
                _promotion_leader: 'true',
                _promotion_leader_key: item.key, 
            },
        },
    });
} 


export function adjustFollowerQuantity(follower: CartLineItem, quantity: number, state: PromotionState) {
    state.addMutation({
        key: follower.key, 
        quantity: quantity, 
        properties: follower.properties
    } as PromotionStateMutation); 
}


export function createNewFollower(
    promotion: Promotion,
    leader: CartLineItem,
    variant: Variant,
    state: PromotionState
    ) {
    state.addCreation({
        id: variant.id,
        quantity: variant.quantity * leader.quantity,
        properties: {
            _promotion: 'true',
            _promotion_key: promotion.key,
            _promotion_leader: 'false', // Generated items are slaves.
            _promotion_leader_key: leader.key
        },
    });
}