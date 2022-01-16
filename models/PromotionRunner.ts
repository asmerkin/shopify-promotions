import Promotion from '../models/Promotion'; 
import Plan from '../models/Plan'; 
import { processActions } from '../helpers/ActionsProcessor';
import CartApi from '../helpers/CartApi';
import { Cart, CartApiAction, RegistrablePromotion } from '../types';

export default class PromotionRunner {
    promotions: Promotion[] = []; 

    /**
     * Registers a new promotion. 
     * @param promotion the promotion to register. 
     */
    register(promotion: RegistrablePromotion | RegistrablePromotion[]): void {
        if (Array.isArray(promotion)) {
            promotion.forEach(p => this.promotions.push(
                new Promotion(p)
            )); 
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
    async commit(cart: Cart, plan: Plan) {
        const actions: CartApiAction[] = []; 
        // this method should create a series of calls to, 
        // 1. delete all deltable items. 
        // 2. mutate all changeable items. 
        // 3. add all new items. 
        if ( plan.deletions.length > 0) {
            actions.push({
                action: 'update', 
                payload: cart.items.map( item => {
                    return plan.deletions.includes(item.key)
                        ? 0
                        : item.quantity; 
                })
            }); 
        }

        if ( plan.mutations.length > 0 ) {
            plan.mutations.forEach( mutation => {
                actions.push({
                    action: 'change', 
                    payload: {
                        id: mutation.key, 
                        quantity: mutation.quantity, 
                        properties: mutation.properties
                    }
                })
            }); 
        }

        if(  plan.creations.length > 0 ) {
            actions.push({
                action: 'add', 
                payload: {
                    items: plan.creations.map( creation => {
                        return {
                            id: creation.id, 
                            quantity: creation.quantity, 
                            properties: creation.properties
                        }; 
                    })
                }
            })
        }
        
        try {
            const updatedCart = await processActions(actions); 
            return updatedCart; 
        } catch( error ) {
            console.log(error); 
        }
    }

    /**
     * Excecutes the plan in the cart, and then returns the cart object 
     * back to the caller. 
     */
    async check(cart?: Cart): Promise<Cart> {
        if (!cart) {
            cart = await CartApi.getCart(); 
        }

        const plan = await this.plan(cart); 

        return this.commit(cart, plan); 
    }
}