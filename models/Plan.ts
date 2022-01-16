import {Cart} from "../types";
import { PromotionStateCreation, PromotionStateMutation } from "../types";
import Promotion from "./Promotion";

export default class Plan {
    cart: Cart;
    promotions: Promotion[];

    // This will contain all the results to handle.
    mutations: PromotionStateMutation[] = [];
    creations: PromotionStateCreation[] = [];
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

            this.setCreations(state.creations); 
            this.setMutations(state.mutations); 
            this.setDeletions(state.deletions); 
        });

        // Removing orphans. 
        this.setDeletions(this.removeOrphans()); 

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


    /**
     * Sets the list of mutations into the plan. 
     * 
     * @param mutations the list of mutations 
     * @returns Plan 
     */
    setMutations(mutations: PromotionStateMutation | PromotionStateMutation[]): Plan {
        if ( Array.isArray(mutations)) {
            this.mutations = [...this.mutations, ...mutations]; 
        } else {
            this.mutations.push(mutations); 
        }

        return this; 
    }


    /**
     * Sets a list of items to create. 
     * 
     * @param creations the list of creations 
     * @returns Plan 
     */
    setCreations(creations: PromotionStateCreation | PromotionStateCreation[]): Plan {
        if ( Array.isArray(creations)) {
            this.creations = [...this.creations, ...creations]; 
        } else {
            this.creations.push(creations); 
        }

        return this; 
    }

    /**
     * Sets a list of deletions
     * @param deletions the keys to delete. 
     * @returns Plan 
     */
    setDeletions(deletions: string | string[]): Plan {
        if ( Array.isArray(deletions)) {
            this.deletions = [...this.deletions, ...deletions]; 
        } else {
            this.deletions.push(deletions); 
        }

        return this; 
    }

}
