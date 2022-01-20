import Promotion from "../models/Promotion";
import PromotionState from "../models/PromotionState";
import { Cart } from "../types";

export default class PromotionStrategy {

    promotion: Promotion; 

    constructor(promotion: Promotion) {
        this.promotion = promotion; 
    }

    run(cart: Cart): PromotionState {
        throw 'Not implemented'
    }
}