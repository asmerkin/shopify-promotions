import PromotionStrategyFactory from "../strategies/PromotionStrategyFactory";
import { Cart, CartLineItem, PromotionState, PromotionStateMutation, RegistrablePromotion, Variant } from "../types";

export default class Promotion {

    key: string; 
    lookup_variants: number[]; 
    min_purchase?: number;
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
        this.min_purchase = promotion.min_purchase || null; 
    }

    run(cart: Cart): PromotionState {
        if ( this.min_purchase && this.getCartSubtotal(cart) < this.min_purchase) {
            return { creations: [], mutations: [], deletions: [] }; 
        }

        return PromotionStrategyFactory.getStrategy(this).run(cart); 
    }

    getCartSubtotal(cart: Cart): number {
        return cart.items.reduce((total, item) => {
            if ( item.properties?._promotion_leader !== 'false' ) {
                total += item.original_line_price; 
            }
            return total; 
        }, 0);
    }
}