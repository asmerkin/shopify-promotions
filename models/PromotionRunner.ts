import Promotion from '../models/Promotion'; 
import Plan from '../models/Plan'; 
import Cart from '../definitions/Cart'; 

export default class PromotionRunner {
    promotions: Promotion[] = []; 

    /**
     * Registers a new promotion. 
     * @param promotion the promotion to register. 
     */
    register(promotion: Promotion | Promotion[]): void {
        if (Array.isArray(promotion)) {
            promotion.forEach(p => this.promotions.push(p)); 
        } else {
            this.promotions.push(new Promotion(promotion)); 
        }
    }


    /**
     * returns the list of registered promotions. 
     * 
     * @returns the list of promotions. 
     */
    getPromotions(): Promotion[] {
        return this.promotions; 
    }


    /**
     * Generates a plan to run all promotions.. 
     */
    async plan(cart: Cart): Promise<Plan> {
        return (new Plan(cart)).create(this.promotions); 
    }

    /**
     * Executes the plan handling all Promotions 
     * 
     * @param plan 
     * @returns 
     */
    async commit(plan: Plan) {
        return {} as Cart; // this should return the updated cart, 
    }

    /**
     * Excecutes the plan in the cart, and then returns the cart object 
     * back to the caller. 
     */
    async run(cart?: Cart): Promise<Cart> {
        if (!cart) {
            // we do something to get the cart. 
        }

        const plan = await this.plan(cart); 

        return this.commit(plan); 
    }
}