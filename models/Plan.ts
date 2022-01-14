import Cart, { CartLineItem } from "../definitions/Cart";
import { findCartItemByKey } from "../helpers";
import Promotion from "./Promotion";

export default class Plan {
    cart: Cart;
    promotions: Promotion[];

    // This will contain all the results to handle.
    mutations: object[] = [];
    creations: object[] = [];
    deletions: string[] = [];

    constructor(cart: Cart) {
        this.cart = cart;
    }

    /**
     * Creates the plan mutations,
     */
    create(promotions: Promotion[]) {
        
        // Here we need to loop through each promotion and add the creations,
        // mutations and deletions.
        promotions.forEach((promotion) => {
            let state = promotion.run(this.cart); 

            this.creations = [...this.creations, ...state.creations]; 
            this.mutations = [...this.mutations, ...state.mutations]; 
            this.deletions = [...this.deletions, ...state.deletions]; 
        });

        this.deletions = [
            ...this.deletions, 
            ...this.removeOrphans()
        ]

        return this;
    }


    /**
     * Creates a deletion array with all the orphans. 
     * 
     * @returns 
     */
    removeOrphans(): string[] {
        // Orphans are all the followers that do not have a belonging 
        // leader line_item. 
        return this.cart.line_items.filter( item => {
            return item.properties?._promotion_leader === 'false'
                && !this.cart.line_items.some( found => {
                    return found.key === item.properties?._promotion_leader_key
                }); 
        }).map(item => item.key); 
    }

}
