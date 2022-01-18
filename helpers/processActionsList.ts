import { Cart, CartApiAction } from "../types";
import CartApi from "./CartApi";

/**
 * Runs the processing queue to alter the cart in the desired way. 
 * (Shopify doesn't like concurrent calls, so we have to do it this way)
 * 
 * @param actions list of actions to process. 
 * @param cart the last cart response. 
 * @returns the last cart response after the actions array is cleared. 
 */
export async function processActionsList(actions: CartApiAction[]): Promise<Cart> {
    let lastCart = null; 
    let lastCall = null; 

    for( const next of actions) {
        lastCall = next.action; 
        try {
            lastCart = await CartApi[next.action](next.payload);
        } catch ( error ) {
            console.log( error ); 
        }
    }

    // the add method returns a list of items, and not a cart, so we call 
    // the get cart method to pull an updated one if required. 
    if ( lastCall === 'add') {
        lastCart = await CartApi.getCart(); 
    }

    return lastCart as Cart;
}