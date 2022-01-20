import Promotion from "../models/Promotion";
import { Cart, PromotionState } from "../types";

export default class PromotionStrategy {

    promotion: Promotion; 

    constructor(promotion: Promotion) {
        this.promotion = promotion; 
    }

    run(cart: Cart): PromotionState {
        throw 'Not implemented'
    }
}