import Promotion from "../models/Promotion";
import PromotionStrategy from "./PromotionStrategy";
import PromotionStrategyWithLookup from "./PromotionStrategyWithLookup";

export default class PromotionStrategyFactory {

    static getStrategy(promotion: Promotion): PromotionStrategy {
        if ( promotion.lookup_variants !== undefined ) {
            return new PromotionStrategyWithLookup(promotion); 
        }
    }
}